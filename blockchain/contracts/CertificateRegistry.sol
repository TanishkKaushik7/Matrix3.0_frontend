// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CertificateRegistry {
    struct Certificate {
        string cid;
        bytes32 hash;
        address issuer;
        uint256 issuedAt;
    }

    uint256 public nextTokenId = 1;

    mapping(uint256 => Certificate) public certificates;
    mapping(bytes32 => uint256) public tokenByHash;

    event CertificateMinted(
        address indexed issuer,
        uint256 indexed tokenId,
        string cid,
        bytes32 hash
    );

    function mintCertificate(string memory cid, bytes32 hash) public {
        require(bytes(cid).length > 0, "CID required");
        require(hash != bytes32(0), "Hash required");
        require(tokenByHash[hash] == 0, "Certificate already minted");

        uint256 tokenId = nextTokenId;
        nextTokenId += 1;

        certificates[tokenId] = Certificate({
            cid: cid,
            hash: hash,
            issuer: msg.sender,
            issuedAt: block.timestamp
        });

        tokenByHash[hash] = tokenId;

        emit CertificateMinted(msg.sender, tokenId, cid, hash);
    }
}
