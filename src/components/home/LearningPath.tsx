import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, PieChart, Scale, Brain, RotateCcw, Target, Calendar, BarChart3, DollarSign, Globe, Store, Briefcase, RefreshCw, AlertTriangle, X } from "lucide-react";

const learningSteps = [
  // Beginner Level
  {
    number: 1,
    icon: Target,
    title: "What Is Investing?",
    description: "Learn what investing means and how it differs from saving money.",
    color: "accent",
  },
  {
    number: 2,
    icon: Building2,
    title: "What is a Company?",
    description: "Understand how businesses work, create value, and why people invest in them.",
    color: "accent",
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "What is a Stock?",
    description: "Learn how owning a piece of a company works and what affects stock prices.",
    color: "accent",
  },
  {
    number: 4,
    icon: PieChart,
    title: "What is Market Cap?",
    description: "Discover how to measure the total value of a company and compare sizes.",
    color: "accent",
  },
  {
    number: 5,
    icon: Scale,
    title: "What is Diversification?",
    description: "Learn why spreading investments across different companies reduces risk.",
    color: "accent",
  },
  {
    number: 6,
    icon: Brain,
    title: "What is an ETF?",
    description: "Understand bundles of stocks and why they exist for easier investing.",
    color: "accent",
  },
  // Intermediate Level
  {
    number: 7,
    icon: Calendar,
    title: "Long-Term vs Short-Term Investing",
    description: "Learn the difference between quick trades and patient growth over time.",
    color: "accent",
  },
  {
    number: 8,
    icon: Store,
    title: "What Is a Stock Exchange?",
    description: "Learn where stocks are bought and sold.",
    color: "accent",
  },
  {
    number: 9,
    icon: DollarSign,
    title: "How Dividends Work",
    description: "Learn how companies share profits with shareholders.",
    color: "accent",
  },
  {
    number: 10,
    icon: BarChart3,
    title: "Why Do Markets Go Up and Down?",
    description: "Understand what causes market fluctuations and price changes.",
    color: "accent",
  },
  {
    number: 11,
    icon: Globe,
    title: "How the Economy Affects Investing",
    description: "Understand how economic factors impact the stock market.",
    color: "accent",
  },
  // Advanced Level
  {
    number: 12,
    icon: Briefcase,
    title: "What Is a Portfolio?",
    description: "Learn how to think about all your investments together.",
    color: "accent",
  },
  {
    number: 13,
    icon: RefreshCw,
    title: "Rebalancing a Portfolio",
    description: "Learn how to adjust your portfolio to maintain balance.",
    color: "accent",
  },
  {
    number: 14,
    icon: AlertTriangle,
    title: "Responsible Investing",
    description: "Understand the risks and responsibilities of investing.",
    color: "accent",
  },
  {
    number: 15,
    icon: X,
    title: "What Investing Is NOT",
    description: "Learn what investing is not and how to avoid common mistakes.",
    color: "accent",
  },
  {
    number: 16,
    icon: RotateCcw,
    title: "Practice & Reflect",
    description: "Apply what you learned in simulations and see how concepts work together.",
    color: "primary",
  },
];

export function LearningPath() {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
            Your Learning Journey
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Follow our step-by-step guide to understand how markets work, from basic concepts to hands-on practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {learningSteps.map((step, index) => (
            <LearningStepCard key={step.number} step={step} index={index} />
          ))}
        </div>

        {/* Learning Loop Diagram */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-4 rounded-lg bg-card border border-border px-8 py-4">
            <span className="font-semibold text-accent">Learn</span>
            <span className="text-muted-foreground">→</span>
            <span className="font-semibold text-accent">Simulate</span>
            <span className="text-muted-foreground">→</span>
            <span className="font-semibold text-accent">Reflect</span>
            <span className="text-muted-foreground">→</span>
            <span className="font-semibold text-accent">Learn More</span>
            <RotateCcw className="h-5 w-5 text-accent animate-pulse-soft" />
          </div>
        </div>
      </div>
    </section>
  );
}

function LearningStepCard({ step, index }: { step: typeof learningSteps[0]; index: number }) {
  const Icon = step.icon;

  return (
    <Card variant="interactive" className="relative overflow-hidden">
      {/* Step Number Badge */}
      <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
        {step.number}
      </div>
      
      <CardHeader className="pb-2">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent-lighter text-accent mb-3">
          <Icon className="h-7 w-7" />
        </div>
        <CardTitle className="text-xl">{step.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{step.description}</p>
      </CardContent>
    </Card>
  );
}
