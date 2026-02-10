import { Check, Server, Zap, Shield, Globe, Users, Clock, HeadphonesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { siteCopy } from '../../content/siteCopy';
import { useGetAllPricingPlans } from '../../hooks/useQueries';
import ScrollReveal from './ScrollReveal';

export function Stats() {
  return (
    <section className="py-12 md:py-16 bg-accent/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {siteCopy.stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const iconMap = {
    server: Server,
    zap: Zap,
    shield: Shield,
    globe: Globe,
    users: Users,
    clock: Clock,
  };

  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{siteCopy.features.title}</h2>
            <p className="text-lg text-muted-foreground">{siteCopy.features.subtitle}</p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {siteCopy.features.items.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <ScrollReveal key={index} delay={index * 0.1}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  const { data: backendPlans, isLoading, isError } = useGetAllPricingPlans();

  // Use backend plans if available, otherwise fallback to siteCopy
  const plans = backendPlans && backendPlans.length > 0 
    ? backendPlans.map(plan => ({
        name: plan.name,
        description: plan.description,
        price: `Rs ${Number(plan.priceCents) / 100}`,
        period: `/${Number(plan.durationDays)} days`,
        popular: false, // Backend doesn't have popular flag yet
        features: plan.features,
        cta: 'Get Started',
      }))
    : siteCopy.pricing.plans;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-accent/20">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{siteCopy.pricing.title}</h2>
            <p className="text-lg text-muted-foreground">{siteCopy.pricing.subtitle}</p>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {[1, 2].map((i) => (
              <Card key={i} className="h-full">
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-10 w-40 mt-4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <Card
                  className={`h-full flex flex-col ${
                    plan.popular
                      ? 'border-primary shadow-xl scale-105 relative'
                      : 'border-border/50 hover:border-border transition-colors'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground ml-2">{plan.period}</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-3">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => scrollToSection('contact')}
                      variant={plan.popular ? 'default' : 'outline'}
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        )}

        {isError && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Showing default pricing plans
          </p>
        )}
      </div>
    </section>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{siteCopy.faq.title}</h2>
            <p className="text-lg text-muted-foreground">{siteCopy.faq.subtitle}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {siteCopy.faq.items.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-lg px-6 bg-card"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function FinalCTA() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTalkToSales = () => {
    window.open('https://discord.gg/NMcBdXYVFe', '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <HeadphonesIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{siteCopy.finalCTA.badge}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{siteCopy.finalCTA.title}</h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {siteCopy.finalCTA.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => scrollToSection('pricing')} size="lg" className="text-base px-8">
                {siteCopy.finalCTA.primaryCTA}
              </Button>
              <Button onClick={handleTalkToSales} variant="outline" size="lg" className="text-base px-8">
                {siteCopy.finalCTA.secondaryCTA}
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
