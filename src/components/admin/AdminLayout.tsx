import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';

export default function AdminLayout() {
  const { user, loading, isStaff } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl animate-pulse">🦁</span>
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isStaff) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-strong p-8 text-center max-w-md">
          <span className="text-5xl">🔒</span>
          <h2 className="text-xl font-display font-bold mt-4 text-foreground">Access Denied</h2>
          <p className="text-muted-foreground mt-2">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border px-4 glass-strong">
            <SidebarTrigger className="mr-4" />
            <span className="text-sm text-muted-foreground font-display">Admin Panel</span>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
