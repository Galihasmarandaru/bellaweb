import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, Outlet, useLocation, useNavigate, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { authService } from '../../auth/services/authService.ts';
import { setUser } from '../../auth/stores/authStore.ts';

export function Cms() {
  const navigate = useNavigate();
  const router = useRouter();
  const location = useLocation();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  
  const isHome = location.pathname === '/admin' || location.pathname === '/admin/';

  const handleBack = () => {
    if (location.pathname === '/admin/penginapan' || location.pathname === '/admin/penginapan/') {
      navigate({ to: '/admin' });
    } else {
      router.history.back();
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate({ to: '/login' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <header className="relative flex h-16 w-full items-center justify-between bg-white px-6 shadow-sm">
        <div className="flex w-[100px] items-center">
          {!isHome && (
            <Button 
              variant="outline"
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center p-0 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              title="Kembali"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7"/>
                <path d="M19 12H5"/>
              </svg>
            </Button>
          )}
        </div>
        
        <h1 
          className={cn(
            "text-xl font-bold text-gray-800 absolute top-1/2 -translate-y-1/2",
            !isHome ? "left-1/2 -translate-x-1/2" : "left-6"
          )}
        >
          Hallo Bella
        </h1>

        <div className="flex w-[120px] items-center justify-end gap-2">
          {isHome && (
            <Link 
              to="/"
              className="flex h-10 w-10 items-center justify-center p-0 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              title="Ke Halaman Utama"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </Link>
          )}
          <AlertDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
            <AlertDialogTrigger 
              render={
                <Button 
                  variant="outline" 
                  className="flex h-10 w-10 items-center justify-center p-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  title="Logout"
                />
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </AlertDialogTrigger>
            <AlertDialogContent onOverlayClick={() => setIsLogoutOpen(false)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Yakin mau logout Bella?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="outline" size="default">No</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">Yes</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <main className="flex w-full flex-1 flex-col items-center p-6">
        <Outlet />
      </main>
    </div>
  );
}
