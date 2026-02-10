import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PricingPlansAdminPanel from './PricingPlansAdminPanel';
import SiteCustomizationAdminPanel from './SiteCustomizationAdminPanel';
import LogoAdminPanel from './LogoAdminPanel';
import AdminsAdminPanel from './AdminsAdminPanel';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('pricing');

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground mt-1">Manage your website settings and content</p>
            </div>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="pricing">Pricing Plans</TabsTrigger>
              <TabsTrigger value="customization">Website Content</TabsTrigger>
              <TabsTrigger value="logo">Logo</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>

            <TabsContent value="pricing" className="mt-0">
              <PricingPlansAdminPanel embedded />
            </TabsContent>

            <TabsContent value="customization" className="mt-0">
              <SiteCustomizationAdminPanel />
            </TabsContent>

            <TabsContent value="logo" className="mt-0">
              <LogoAdminPanel />
            </TabsContent>

            <TabsContent value="admins" className="mt-0">
              <AdminsAdminPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
