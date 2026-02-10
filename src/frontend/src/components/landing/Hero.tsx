import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteCopy } from '../../content/siteCopy';
import ScrollReveal from './ScrollReveal';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <img
          src="/assets/generated/tripple-host-hero-bg.dim_1600x900.png"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex items-center space-x-2 bg-accent/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-border">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{siteCopy.hero.badge}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {siteCopy.hero.title}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {siteCopy.hero.subtitle}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button onClick={() => scrollToSection('pricing')} size="lg" className="text-base px-8 group">
                {siteCopy.hero.primaryCTA}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => scrollToSection('features')}
                variant="outline"
                size="lg"
                className="text-base px-8"
              >
                {siteCopy.hero.secondaryCTA}
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm text-muted-foreground">
              {siteCopy.hero.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {feature.icon === 'shield' && <Shield className="h-4 w-4 text-primary" />}
                  {feature.icon === 'zap' && <Zap className="h-4 w-4 text-primary" />}
                  {feature.icon === 'globe' && <Globe className="h-4 w-4 text-primary" />}
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
