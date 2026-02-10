import { siteCopy } from '../content/siteCopy';
import type { SiteSettings } from '../backend';

/**
 * Merges backend site settings with frontend defaults.
 * Backend settings take precedence when available.
 */
export function mergeSiteSettings(backendSettings?: SiteSettings | null) {
  if (!backendSettings) {
    return {
      navCtaText: siteCopy.header.cta,
      navCtaLink: '#pricing',
      heroBadge: siteCopy.hero.badge,
      heroTitle: siteCopy.hero.title,
      heroSubtitle: siteCopy.hero.subtitle,
      heroCta1Text: siteCopy.hero.primaryCTA,
      heroCta2Text: siteCopy.hero.secondaryCTA,
      statsTitle: '',
      statsSubtitle: '',
      featuresTitle: siteCopy.features.title,
      featuresSubtitle: siteCopy.features.subtitle,
      faqTitle: siteCopy.faq.title,
      faqSubtitle: siteCopy.faq.subtitle,
      footerTagline: siteCopy.footer.tagline,
      footerCta: siteCopy.finalCTA.primaryCTA,
      footerTerms: 'Terms of Service',
      footerPrivacy: 'Privacy Policy',
      footerSupport: 'Support',
    };
  }

  return {
    navCtaText: backendSettings.navCtaText || siteCopy.header.cta,
    navCtaLink: backendSettings.navCtaLink || '#pricing',
    heroBadge: backendSettings.heroBadge || siteCopy.hero.badge,
    heroTitle: backendSettings.heroTitle || siteCopy.hero.title,
    heroSubtitle: backendSettings.heroSubtitle || siteCopy.hero.subtitle,
    heroCta1Text: backendSettings.heroCta1Text || siteCopy.hero.primaryCTA,
    heroCta2Text: backendSettings.heroCta2Text || siteCopy.hero.secondaryCTA,
    statsTitle: backendSettings.statsTitle || '',
    statsSubtitle: backendSettings.statsSubtitle || '',
    featuresTitle: backendSettings.featuresTitle || siteCopy.features.title,
    featuresSubtitle: backendSettings.featuresSubtitle || siteCopy.features.subtitle,
    faqTitle: backendSettings.faqTitle || siteCopy.faq.title,
    faqSubtitle: backendSettings.faqSubtitle || siteCopy.faq.subtitle,
    footerTagline: backendSettings.footerTagline || siteCopy.footer.tagline,
    footerCta: backendSettings.footerCta || siteCopy.finalCTA.primaryCTA,
    footerTerms: backendSettings.footerTerms || 'Terms of Service',
    footerPrivacy: backendSettings.footerPrivacy || 'Privacy Policy',
    footerSupport: backendSettings.footerSupport || 'Support',
  };
}
