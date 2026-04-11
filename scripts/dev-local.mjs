import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import ganache from 'ganache';
import { HDNodeWallet } from 'ethers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const blockchainDir = path.join(repoRoot, 'blockchain');

const GANACHE_HOST = '127.0.0.1';
const GANACHE_PORT = 8545;
const CHAIN_ID = 1337;
const GANACHE_MNEMONIC =
  process.env.GANACHE_MNEMONIC || 'test test test test test test test test test test test junk';

const npmCmd = 'npm';
const npmSpawnOptions = {
  env: process.env,
  shell: process.platform === 'win32',
};

function runCommand({ cwd, args, label }) {
  return new Promise((resolve, reject) => {
    const child = spawn(npmCmd, args, {
      cwd,
      ...npmSpawnOptions,
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    let output = '';

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      output += text;
      process.stdout.write(text);
    });

    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      output += text;
      process.stderr.write(text);
    });

    child.on('error', (error) => {
      reject(new Error(`${label} failed to start: ${error.message}`));
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(output);
        return;
      }
      reject(new Error(`${label} exited with code ${code}`));
    });
  });
}

async function main() {
  const firstWallet = HDNodeWallet.fromPhrase(
    GANACHE_MNEMONIC,
    undefined,
    "m/44'/60'/0'/0/0"
  );

  console.log('========================================');
  console.log('Starting local chain + deploy + frontend');
  console.log(`Ganache RPC: http://${GANACHE_HOST}:${GANACHE_PORT}`);
  console.log(`Chain ID: ${CHAIN_ID}`);
  console.log('----------------------------------------');
  console.log(`First account address: ${firstWallet.address}`);
  console.log(`First account private key: ${firstWallet.privateKey}`);
  console.log('========================================');

  const ganacheServer = ganache.server({
    chain: { chainId: CHAIN_ID },
    wallet: {
      mnemonic: GANACHE_MNEMONIC,
      totalAccounts: 10,
      defaultBalance: 1000,
    },
    logging: { quiet: false },
  });

  try {
    await ganacheServer.listen(GANACHE_PORT, GANACHE_HOST);
    console.log('\nGanache started by this script. Running deploy script...\n');
  } catch (error) {
    throw new Error(
      `Port ${GANACHE_PORT} is already in use. Close other Ganache/local RPC processes and run again so the first private key is deterministic.`
    );
  }

  let deployOutput = '';
  try {
    deployOutput = await runCommand({
      cwd: blockchainDir,
      args: ['run', 'deploy:ganache'],
      label: 'Deploy command',
    });
  } catch (error) {
    await ganacheServer.close();
    throw error;
  }

  const contractMatch = deployOutput.match(/VITE_CERTIFICATE_CONTRACT_ADDRESS=(0x[a-fA-F0-9]{40})/);
  const deployedAddress = contractMatch ? contractMatch[1] : null;

  console.log('\n========================================');
  console.log('Copy these values:');
  console.log(`Private key: ${firstWallet.privateKey}`);
  if (deployedAddress) {
    console.log(`VITE_CERTIFICATE_CONTRACT_ADDRESS=${deployedAddress}`);
  } else {
    console.log('VITE_CERTIFICATE_CONTRACT_ADDRESS=<not found in deploy output>');
  }
  console.log('========================================\n');

  console.log('Starting frontend dev server...\n');

  const devChild = spawn(npmCmd, ['run', 'dev'], {
    cwd: repoRoot,
    ...npmSpawnOptions,
    stdio: 'inherit',
  });

  const shutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Shutting down...`);
    if (!devChild.killed) {
      devChild.kill('SIGINT');
    }
    await ganacheServer.close();
    process.exit(0);
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });

  devChild.on('close', async (code) => {
    await ganacheServer.close();
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error('\nSetup failed:', error.message);
  process.exit(1);
});
