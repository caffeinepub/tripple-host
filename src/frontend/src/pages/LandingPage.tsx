import { useState } from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import { Features, Stats, Pricing, FAQ, FinalCTA } from '../components/landing/Sections';
import Footer from '../components/landing/Footer';
import PricingPlansAdminPanel from '../components/admin/PricingPlansAdminPanel';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';

export default function LandingPage() {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const canAccessAdmin = isAuthenticated && isAdmin;

  return (
    <div className="min-h-screen bg-background">
      <Header onAdminClick={() => setShowAdminPanel(true)} />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />

      {showAdminPanel && (
        canAccessAdmin ? (
          <PricingPlansAdminPanel onClose={() => setShowAdminPanel(false)} />
        ) : (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-card border border-border rounded-lg p-8 max-w-md text-center">
              <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
              <p className="text-muted-foreground mb-6">
                You do not have permission to access the admin panel.
              </p>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
