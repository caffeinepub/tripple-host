import { useState } from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import { Features, Stats, Pricing, Reviews, FAQ, FinalCTA } from '../components/landing/Sections';
import Footer from '../components/landing/Footer';
import AdminPanel from '../components/admin/AdminPanel';
import AdminAccessDenied from '../components/admin/AdminAccessDenied';
import ProfileSetupDialog from '../components/profile/ProfileSetupDialog';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useCheckAdminsExist } from '../hooks/useQueries';

export default function LandingPage() {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: adminsExist = true } = useCheckAdminsExist();

  const isAuthenticated = !!identity;
  const canAccessAdmin = isAuthenticated && isAdmin;

  return (
    <div className="min-h-screen bg-background">
      <Header onAdminClick={() => setShowAdminPanel(true)} />
      <Hero />
      <Stats />
      <Features />
      <Pricing />
      <Reviews />
      <FAQ />
      <FinalCTA />
      <Footer />

      {/* Profile Setup Dialog */}
      <ProfileSetupDialog />

      {/* Admin Panel or Access Denied */}
      {showAdminPanel && (
        <>
          {canAccessAdmin ? (
            <AdminPanel onClose={() => setShowAdminPanel(false)} />
          ) : (
            <AdminAccessDenied
              onClose={() => setShowAdminPanel(false)}
              adminsExist={adminsExist}
            />
          )}
        </>
      )}
    </div>
  );
}
