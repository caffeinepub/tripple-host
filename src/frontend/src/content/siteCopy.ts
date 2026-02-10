export const siteCopy = {
  header: {
    cta: 'Get Started',
  },
  nav: [
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ],
  hero: {
    badge: 'Lightning Fast Hosting',
    title: 'Premium Hosting Built for Performance',
    subtitle:
      'Experience unmatched speed, reliability, and support with tripple host. Deploy your projects instantly on our cutting-edge infrastructure.',
    primaryCTA: 'PLANS',
    secondaryCTA: 'Explore Features',
    features: [
      { icon: 'shield', text: '99.9% Uptime SLA' },
      { icon: 'zap', text: 'Instant Setup' },
      { icon: 'globe', text: 'Global CDN' },
    ],
  },
  stats: [
    { value: '99.9%', label: 'Uptime Guarantee' },
    { value: '10k+', label: 'Active Servers' },
    { value: '<50ms', label: 'Average Latency' },
    { value: '24/7', label: 'Expert Support' },
  ],
  features: {
    title: 'Everything You Need to Succeed',
    subtitle: 'Powerful features designed to give you complete control and peace of mind.',
    items: [
      {
        icon: 'server',
        title: 'High-Performance Servers',
        description:
          'Powered by AMD Ryzen and EPYC processors with NVMe SSDs for blazing-fast performance and zero lag.',
      },
      {
        icon: 'zap',
        title: 'Instant Deployment',
        description:
          'Go from signup to live in minutes. Our automated setup gets your server running instantly.',
      },
      {
        icon: 'shield',
        title: 'Advanced DDoS Protection',
        description:
          'Enterprise-grade security keeps your applications safe from attacks with always-on protection.',
      },
      {
        icon: 'globe',
        title: 'Global Network',
        description:
          'Multiple data center locations worldwide ensure low latency and optimal performance for your users.',
      },
      {
        icon: 'users',
        title: 'Scalable Infrastructure',
        description:
          'Easily scale your resources up or down as your needs change. Pay only for what you use.',
      },
      {
        icon: 'clock',
        title: '24/7 Expert Support',
        description:
          'Real humans ready to help anytime via live chat and Discord. Fast, knowledgeable assistance when you need it.',
      },
    ],
  },
  pricing: {
    title: 'Simple, Transparent Pricing',
    subtitle: 'Choose the perfect plan for your needs. All plans include our core features.',
    disclaimer: 'All purchases are final and non-refundable. Please choose your plan carefully.',
    plans: [
      {
        name: 'Starter',
        description: 'Perfect for personal projects',
        price: 'Rs 80',
        period: '/month',
        popular: false,
        features: [
          '2 GB RAM',
          '2 CPU Cores',
          '50GB NVMe Storage',
          '2TB Bandwidth',
          'Free SSL Certificate',
          'Daily Backups',
          'Email Support',
        ],
        cta: 'Get Started',
      },
      {
        name: 'Iron',
        description: 'Best for growing businesses',
        price: 'Rs 150',
        period: '/month',
        popular: true,
        features: [
          '4 GB RAM',
          '4 CPU Cores',
          '100GB NVMe Storage',
          '4TB Bandwidth',
          'Free SSL Certificate',
          'Hourly Backups',
          'Priority Support',
          'DDoS Protection',
        ],
        cta: 'Get Started',
      },
    ],
  },
  reviews: {
    title: 'Customer Reviews',
    subtitle: 'See what our customers have to say about their experience with tripple host.',
    formTitle: 'Share Your Experience',
    formDescription: 'Help others by sharing your experience with our service.',
    ratingLabel: 'Your Rating',
    commentLabel: 'Your Review (Optional)',
    commentPlaceholder: 'Tell us about your experience...',
    submitButton: 'Submit Review',
    submittingButton: 'Submitting...',
    validationError: 'Please select a rating before submitting.',
    successMessage: 'Thank you for your review! Your feedback helps us improve.',
    errorMessage: 'Failed to submit review. Please try again.',
    loginRequired: 'Please sign in to submit a review.',
    basedOn: 'Based on {count} reviews',
    recentReviewsTitle: 'Recent Reviews',
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about tripple host.',
    items: [
      {
        question: 'How quickly can I get started?',
        answer:
          'Your server is deployed instantly after payment confirmation. You can start building within minutes of signing up.',
      },
      {
        question: 'What kind of support do you offer?',
        answer:
          'We provide 24/7 support via live chat and Discord. Our expert team is always ready to help with setup, troubleshooting, and optimization.',
      },
      {
        question: 'Can I upgrade my plan later?',
        answer:
          'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing.',
      },
      {
        question: 'Do you offer refunds?',
        answer:
          'All purchases are final and non-refundable. We encourage you to carefully review the plan details and reach out to our support team if you have any questions before purchasing.',
      },
      {
        question: 'Where are your servers located?',
        answer:
          'We have data centers in multiple locations worldwide including North America, Europe, and Asia-Pacific to ensure low latency for your users.',
      },
      {
        question: 'What about backups?',
        answer:
          'All plans include automated backups. Starter plans get daily backups, and Iron plans get hourly backups for enhanced data protection.',
      },
    ],
  },
  finalCTA: {
    badge: '24/7 Support Available',
    title: 'Ready to Experience the Difference?',
    subtitle:
      'Join thousands of developers and businesses who trust tripple host for their hosting needs.',
    noRefundReminder: 'Remember: All purchases are final and non-refundable.',
    primaryCTA: 'View Plans',
    secondaryCTA: 'Purchase Plans',
  },
  footer: {
    tagline: 'Premium hosting built for performance.',
    cta: 'Get Started',
    links: {
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      support: 'Support',
    },
    columns: [
      {
        title: 'Product',
        links: [
          { id: 'features', label: 'Features' },
          { id: 'pricing', label: 'Pricing' },
        ],
      },
      {
        title: 'Support',
        links: [
          { id: 'faq', label: 'FAQ' },
          { id: 'contact', label: 'Contact' },
        ],
      },
      {
        title: 'Company',
        links: [
          { id: 'features', label: 'About' },
          { id: 'contact', label: 'Contact Us' },
        ],
      },
    ],
  },
};
