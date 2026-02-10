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

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <img
                src={logoUrl}
                alt="Logo"
                className="h-8 lg:h-10 w-auto object-contain hidden sm:block transition-transform group-hover:scale-105"
              />
              <img
                src={mobileLogoUrl}
                alt="Logo"
                className="h-8 w-auto object-contain sm:hidden transition-transform group-hover:scale-105"
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {showSetupButton && (
                <Button
                  onClick={() => setShowAdminSetup(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Set up admin access
                </Button>
              )}
              {showAdminButton && (
                <Button onClick={onAdminClick} variant="outline" size="sm" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </Button>
              )}
              {isAuthenticated && <UserProfileDialog />}
              <Button onClick={handleAuth} disabled={isLoggingIn} size="sm">
                {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
              <Button asChild size="sm">
                <a href={settings.navCtaLink}>{settings.navCtaText}</a>
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="border-t border-border my-4" />
                  {showSetupButton && (
                    <Button
                      onClick={() => setShowAdminSetup(true)}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Set up admin access
                    </Button>
                  )}
                  {showAdminButton && (
                    <Button onClick={onAdminClick} variant="outline" className="w-full gap-2">
                      <Shield className="h-4 w-4" />
                      Admin
                    </Button>
                  )}
                  {isAuthenticated && (
                    <div className="w-full">
                      <UserProfileDialog />
                    </div>
                  )}
                  <Button onClick={handleAuth} disabled={isLoggingIn} className="w-full">
                    {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
                  </Button>
                  <Button asChild className="w-full">
                    <a href={settings.navCtaLink}>{settings.navCtaText}</a>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Admin Setup Dialog */}
      <AdminSetupDialog open={showAdminSetup} onOpenChange={setShowAdminSetup} />
    </>
  );
}
