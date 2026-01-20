import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, PieChart, Scale, Brain, RotateCcw, Target, Calendar, BarChart3, DollarSign, Globe, Store, Briefcase, RefreshCw, AlertTriangle, X, Shield, Clock, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const learningSteps = [
  // Beginner Level
  {
    number: 1,
    icon: Target,
    title: "What Is Investing?",
    description: "Learn what investing means and how it differs from saving money.",
    color: "accent",
    lessonId: "investing",
  },
  {
    number: 2,
    icon: Building2,
    title: "What is a Company?",
    description: "Understand how businesses work, create value, and why people invest in them.",
    color: "accent",
    lessonId: "company",
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "What is a Stock?",
    description: "Learn how owning a piece of a company works and what affects stock prices.",
    color: "accent",
    lessonId: "stock",
  },
  {
    number: 4,
    icon: PieChart,
    title: "What is Market Cap?",
    description: "Discover how to measure the total value of a company and compare sizes.",
    color: "accent",
    lessonId: "marketcap",
  },
  {
    number: 5,
    icon: Scale,
    title: "What is Diversification?",
    description: "Learn why spreading investments across different companies reduces risk.",
    color: "accent",
    lessonId: "diversification",
  },
  {
    number: 6,
    icon: Brain,
    title: "What is an ETF?",
    description: "Understand bundles of stocks and why they exist for easier investing.",
    color: "accent",
    lessonId: "etf",
  },
  // Intermediate Level
  {
    number: 7,
    icon: Calendar,
    title: "Long-Term vs Short-Term Investing",
    description: "Learn the difference between quick trades and patient growth over time.",
    color: "accent",
    lessonId: "longterm",
  },
  {
    number: 8,
    icon: Store,
    title: "What Is a Stock Exchange?",
    description: "Learn where stocks are bought and sold.",
    color: "accent",
    lessonId: "exchange",
  },
  {
    number: 9,
    icon: DollarSign,
    title: "How Dividends Work",
    description: "Learn how companies share profits with shareholders.",
    color: "accent",
    lessonId: "dividends",
  },
  {
    number: 10,
    icon: BarChart3,
    title: "Why Do Markets Go Up and Down?",
    description: "Understand what causes market fluctuations and price changes.",
    color: "accent",
    lessonId: "marketmovements",
  },
  {
    number: 11,
    icon: Globe,
    title: "How the Economy Affects Investing",
    description: "Understand how economic factors impact the stock market.",
    color: "accent",
    lessonId: "economy",
  },
  {
    number: 12,
    icon: Shield,
    title: "Understanding Risk",
    description: "Learn about risk and reward in investing.",
    color: "accent",
    lessonId: "risk",
  },
  {
    number: 13,
    icon: Clock,
    title: "The Magic of Compound Growth",
    description: "How time makes your money grow faster.",
    color: "accent",
    lessonId: "compound",
  },
  {
    number: 14,
    icon: Wallet,
    title: "Saving vs. Investing",
    description: "Know when to save and when to invest.",
    color: "accent",
    lessonId: "savings",
  },
  {
    number: 15,
    icon: BarChart3,
    title: "How News Affects Stocks",
    description: "Understand why stock prices move with news.",
    color: "accent",
    lessonId: "news",
  },
  // Advanced Level
  {
    number: 16,
    icon: Briefcase,
    title: "What Is a Portfolio?",
    description: "Learn how to think about all your investments together.",
    color: "accent",
    lessonId: "portfolio",
  },
  {
    number: 17,
    icon: RefreshCw,
    title: "Rebalancing a Portfolio",
    description: "Learn how to adjust your portfolio to maintain balance.",
    color: "accent",
    lessonId: "rebalancing",
  },
  {
    number: 18,
    icon: AlertTriangle,
    title: "Responsible Investing",
    description: "Understand the risks and responsibilities of investing.",
    color: "accent",
    lessonId: "responsible",
  },
  {
    number: 19,
    icon: X,
    title: "What Investing Is NOT",
    description: "Learn what investing is not and how to avoid common mistakes.",
    color: "accent",
    lessonId: "notinvesting",
  },
  {
    number: 20,
    icon: RotateCcw,
    title: "Practice & Reflect",
    description: "Apply what you learned in simulations and see how concepts work together.",
    color: "primary",
    lessonId: null, // Not a lesson
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

  const cardContent = (
    <Card variant={step.lessonId ? "interactive" : "default"} className="relative overflow-hidden">
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

  // If it's a lesson, make it clickable
  if (step.lessonId) {
    return (
      <Link to={`/learn?lesson=${step.lessonId}`}>
        {cardContent}
      </Link>
    );
  }

  // Otherwise, just return the card (e.g., "Practice & Reflect")
  return cardContent;
}
