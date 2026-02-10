import { useState, useEffect } from 'react';
import { Menu, Shield, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { siteCopy } from '../../content/siteCopy';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetLogo, useGetSiteSettings, useCheckAdminsExist } from '../../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { mergeSiteSettings } from '../../utils/siteSettings';
import UserProfileDialog from '../profile/UserProfileDialog';
import AdminSetupDialog from '../admin/AdminSetupDialog';

interface HeaderProps {
  onAdminClick?: () => void;
}

export default function Header({ onAdminClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdminSetup, setShowAdminSetup] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: adminsExist = true, isLoading: adminsExistLoading } = useCheckAdminsExist();
  const { data: logo } = useGetLogo();
  const { data: backendSettings } = useGetSiteSettings();

  const settings = mergeSiteSettings(backendSettings);
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Show admin setup button only when signed in, no admins exist, and not loading
  const showSetupButton = isAuthenticated && !adminsExist && !adminsExistLoading;
  // Show admin button only when signed in, user is admin, and not loading
  const showAdminButton = isAuthenticated && isAdmin && !isAdminLoading;

  const logoUrl = logo?.getDirectURL() || '/assets/generated/tripple-host-logo-wordmark.dim_512x256.png';
  const mobileLogoUrl = logo?.getDirectURL() || '/assets/generated/tripple-host-logo.dim_512x256.png';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img
                src={logoUrl}
                alt="Logo"
                className="h-8 md:h-10 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {siteCopy.nav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {showSetupButton && (
                <Button
                  onClick={() => setShowAdminSetup(true)}
                  variant="outline"
                  size="default"
                  className="font-medium border-primary/50 text-primary hover:bg-primary/10"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Set up admin access
                </Button>
              )}
              {showAdminButton && (
                <Button
                  onClick={onAdminClick}
                  variant="outline"
                  size="default"
                  className="font-medium"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}
              {isAuthenticated && <UserProfileDialog />}
              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                variant={isAuthenticated ? 'ghost' : 'default'}
                size="lg"
                className="font-semibold"
              >
                {isLoggingIn ? 'Signing in...' : isAuthenticated ? 'Sign out' : 'Sign in'}
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-6 mt-8">
                  <img
                    src={mobileLogoUrl}
                    alt="Logo"
                    className="h-8 w-auto mb-4"
                  />
                  {siteCopy.nav.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-left text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                  {showSetupButton && (
                    <Button
                      onClick={() => setShowAdminSetup(true)}
                      variant="outline"
                      size="lg"
                      className="w-full border-primary/50 text-primary hover:bg-primary/10"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Set up admin access
                    </Button>
                  )}
                  {showAdminButton && (
                    <Button
                      onClick={onAdminClick}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  {isAuthenticated && (
                    <div className="w-full">
                      <UserProfileDialog />
                    </div>
                  )}
                  <Button
                    onClick={handleAuth}
                    disabled={isLoggingIn}
                    variant={isAuthenticated ? 'outline' : 'default'}
                    size="lg"
                    className="w-full mt-4"
                  >
                    {isLoggingIn ? 'Signing in...' : isAuthenticated ? 'Sign out' : 'Sign in'}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <AdminSetupDialog open={showAdminSetup} onOpenChange={setShowAdminSetup} />
    </>
  );
}
