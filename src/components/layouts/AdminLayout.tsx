import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#050506] flex">
      {/* 1. Fixed Sidebar */}
      <AdminSidebar />

      {/* 2. Main Content Area */}
      {/* ml-64 pushes the content over by the exact width of the sidebar (w-64) */}
      <main className="flex-1 ml-64 relative min-h-screen overflow-x-hidden">
        
        {/* Ambient background glow for the whole admin area */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#5E6AD2]/5 blur-[150px] rounded-full pointer-events-none -z-10" />
        
        {/* Inject the active page component here */}
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>

      </main>
    </div>
  );
};

export default AdminLayout;