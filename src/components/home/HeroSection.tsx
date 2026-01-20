import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Sparkles, TrendingUp, PieChart, Shield } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src="/stock-market-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/50" />
      </div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 animate-slide-up">
            Learn How Investing Works Through Lessons and Simulations
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-12 animate-slide-up stagger-1">
            Discover stocks, ETFs, and smart investing concepts through interactive lessons and safe simulations. Built for curious minds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up stagger-2">
            <Link to="/learn">
              <Button variant="hero" size="xl" className="group">
                <BookOpen className="h-5 w-5" />
                Start Learning
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/simulator">
              <Button variant="hero-secondary" size="xl">
                <TrendingUp className="h-5 w-5" />
                Try Simulator
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Cards Preview */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
          <FeaturePreview
            icon={BookOpen}
            title="Learn Concepts"
            description="AI explains stocks, ETFs, and diversification using fun analogies"
            color="primary"
            delay="stagger-1"
          />
          <FeaturePreview
            icon={TrendingUp}
            title="Simulate Markets"
            description="Practice with virtual tokens and fictional companies"
            color="secondary"
            delay="stagger-2"
          />
          <FeaturePreview
            icon={Sparkles}
            title="Get Feedback"
            description="AI reflects on your decisions and helps you improve"
            color="accent"
            delay="stagger-3"
          />
        </div>
      </div>
    </section>
  );
}

function FeaturePreview({ 
  icon: Icon, 
  title, 
  description, 
  color,
  delay
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  color?: "primary" | "secondary" | "accent";
  delay: string;
}) {
  return (
    <Card variant="default" className={`animate-slide-up ${delay}`}>
      <CardHeader className="pb-2">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent-lighter text-accent mb-3">
          <Icon className="h-7 w-7" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
