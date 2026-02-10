import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetSiteSettings, useUpdateSiteSettings } from '../../hooks/useQueries';
import type { EditableSettings } from '../../backend';

export default function SiteCustomizationAdminPanel() {
  const { data: settings, isLoading } = useGetSiteSettings();
  const updateMutation = useUpdateSiteSettings();

  const [formData, setFormData] = useState<EditableSettings>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        navCtaText: settings.navCtaText,
        navCtaLink: settings.navCtaLink,
        heroBadge: settings.heroBadge,
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        heroCta1Text: settings.heroCta1Text,
        heroCta2Text: settings.heroCta2Text,
        statsTitle: settings.statsTitle,
        statsSubtitle: settings.statsSubtitle,
        featuresTitle: settings.featuresTitle,
        featuresSubtitle: settings.featuresSubtitle,
        faqTitle: settings.faqTitle,
        faqSubtitle: settings.faqSubtitle,
        footerTagline: settings.footerTagline,
        footerCta: settings.footerCta,
        footerTerms: settings.footerTerms,
        footerPrivacy: settings.footerPrivacy,
        footerSupport: settings.footerSupport,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateMutation.mutateAsync(formData);
      setSuccessMessage('Website content updated successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update website content. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <AlertDescription className="text-green-800 dark:text-green-200">{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation</CardTitle>
          <CardDescription>Customize the header navigation button</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="navCtaText">CTA Button Text</Label>
            <Input
              id="navCtaText"
              value={formData.navCtaText || ''}
              onChange={(e) => setFormData({ ...formData, navCtaText: e.target.value })}
              placeholder="e.g., Get Started"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="navCtaLink">CTA Button Link</Label>
            <Input
              id="navCtaLink"
              value={formData.navCtaLink || ''}
              onChange={(e) => setFormData({ ...formData, navCtaLink: e.target.value })}
              placeholder="e.g., #pricing"
            />
          </div>
        </CardContent>
      </Card>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Customize the main hero section at the top of the page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroBadge">Badge Text</Label>
            <Input
              id="heroBadge"
              value={formData.heroBadge || ''}
              onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
              placeholder="e.g., Lightning Fast Hosting"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Main Title</Label>
            <Input
              id="heroTitle"
              value={formData.heroTitle || ''}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              placeholder="e.g., Premium Hosting Built for Performance"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Subtitle</Label>
            <Textarea
              id="heroSubtitle"
              value={formData.heroSubtitle || ''}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              placeholder="e.g., Experience unmatched speed, reliability, and support..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heroCta1Text">Primary CTA Text</Label>
              <Input
                id="heroCta1Text"
                value={formData.heroCta1Text || ''}
                onChange={(e) => setFormData({ ...formData, heroCta1Text: e.target.value })}
                placeholder="e.g., Get Started"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroCta2Text">Secondary CTA Text</Label>
              <Input
                id="heroCta2Text"
                value={formData.heroCta2Text || ''}
                onChange={(e) => setFormData({ ...formData, heroCta2Text: e.target.value })}
                placeholder="e.g., Explore Features"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Card>
        <CardHeader>
          <CardTitle>Stats Section</CardTitle>
          <CardDescription>Optional titles for the statistics section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="statsTitle">Stats Title (optional)</Label>
            <Input
              id="statsTitle"
              value={formData.statsTitle || ''}
              onChange={(e) => setFormData({ ...formData, statsTitle: e.target.value })}
              placeholder="Leave empty for no title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="statsSubtitle">Stats Subtitle (optional)</Label>
            <Input
              id="statsSubtitle"
              value={formData.statsSubtitle || ''}
              onChange={(e) => setFormData({ ...formData, statsSubtitle: e.target.value })}
              placeholder="Leave empty for no subtitle"
            />
          </div>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Card>
        <CardHeader>
          <CardTitle>Features Section</CardTitle>
          <CardDescription>Customize the features section headings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="featuresTitle">Features Title</Label>
            <Input
              id="featuresTitle"
              value={formData.featuresTitle || ''}
              onChange={(e) => setFormData({ ...formData, featuresTitle: e.target.value })}
              placeholder="e.g., Everything You Need to Succeed"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="featuresSubtitle">Features Subtitle</Label>
            <Input
              id="featuresSubtitle"
              value={formData.featuresSubtitle || ''}
              onChange={(e) => setFormData({ ...formData, featuresSubtitle: e.target.value })}
              placeholder="e.g., Powerful features designed to give you complete control"
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ Section</CardTitle>
          <CardDescription>Customize the FAQ section headings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="faqTitle">FAQ Title</Label>
            <Input
              id="faqTitle"
              value={formData.faqTitle || ''}
              onChange={(e) => setFormData({ ...formData, faqTitle: e.target.value })}
              placeholder="e.g., Frequently Asked Questions"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="faqSubtitle">FAQ Subtitle</Label>
            <Input
              id="faqSubtitle"
              value={formData.faqSubtitle || ''}
              onChange={(e) => setFormData({ ...formData, faqSubtitle: e.target.value })}
              placeholder="e.g., Everything you need to know"
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardHeader>
          <CardTitle>Footer</CardTitle>
          <CardDescription>Customize footer content and links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footerTagline">Footer Tagline</Label>
            <Input
              id="footerTagline"
              value={formData.footerTagline || ''}
              onChange={(e) => setFormData({ ...formData, footerTagline: e.target.value })}
              placeholder="e.g., Premium hosting solutions built for performance"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="footerCta">Footer CTA Text</Label>
            <Input
              id="footerCta"
              value={formData.footerCta || ''}
              onChange={(e) => setFormData({ ...formData, footerCta: e.target.value })}
              placeholder="e.g., Get Started"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="footerTerms">Terms Link Text</Label>
              <Input
                id="footerTerms"
                value={formData.footerTerms || ''}
                onChange={(e) => setFormData({ ...formData, footerTerms: e.target.value })}
                placeholder="e.g., Terms of Service"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footerPrivacy">Privacy Link Text</Label>
              <Input
                id="footerPrivacy"
                value={formData.footerPrivacy || ''}
                onChange={(e) => setFormData({ ...formData, footerPrivacy: e.target.value })}
                placeholder="e.g., Privacy Policy"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footerSupport">Support Link Text</Label>
              <Input
                id="footerSupport"
                value={formData.footerSupport || ''}
                onChange={(e) => setFormData({ ...formData, footerSupport: e.target.value })}
                placeholder="e.g., Support"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
