import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, TrendingUp, PieChart, Scale, Brain, 
  ChevronRight, CheckCircle2, Lock, Sparkles, ArrowRight, MessageCircle,
  Shield, Clock, Wallet, BarChart3, Target, Calendar, DollarSign, Globe, Store, Briefcase, RefreshCw, AlertTriangle, X
} from "lucide-react";
import { Link } from "react-router-dom";
import { AITutor } from "@/components/learn/AITutor";

const lessons = [
  // Beginner Level - Fundamentals
  {
    id: "investing",
    icon: Target,
    title: "What Is Investing?",
    description: "Understand what investing means and how it differs from saving",
    duration: "5 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Investing means putting money into something with the goal of growing it over time. When you invest, you are accepting some risk in exchange for possible reward. Investing is different from saving, which is about protecting money, not growing it..."
  },
  {
    id: "company",
    icon: Building2,
    title: "What is a Company?",
    description: "Learn how businesses create value and make money",
    duration: "5 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Think of a company like a lemonade stand, but much bigger! When you run a lemonade stand, you create something people want (delicious lemonade) and sell it to make money..."
  },
  {
    id: "stock",
    icon: TrendingUp,
    title: "What is a Stock?",
    description: "Understand owning a piece of a company",
    duration: "7 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Imagine if you could own a tiny piece of your favorite pizza shop. Every time they sell a pizza, you'd get a small share of the profits..."
  },
  {
    id: "marketcap",
    icon: PieChart,
    title: "What is Market Cap?",
    description: "Measure and compare company sizes",
    duration: "5 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "If a pizza shop is worth $10,000 and you own 10% of it, your share is worth $1,000. Market cap is simply the total value of all the pieces..."
  },
  {
    id: "diversification",
    icon: Scale,
    title: "What is Diversification?",
    description: "Why spreading investments reduces risk",
    duration: "8 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Would you put all your eggs in one basket? What if you dropped it? The same idea applies to investing — spreading out helps protect you..."
  },
  {
    id: "etf",
    icon: Brain,
    title: "What is an ETF?",
    description: "Bundles of stocks made simple",
    duration: "6 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Imagine buying a variety pack instead of just one flavor. An ETF is like a variety pack of stocks — you get a bit of everything in one purchase..."
  },
  // Intermediate Level - Strategy & Context
  {
    id: "longterm",
    icon: Calendar,
    title: "Long-Term vs Short-Term Investing",
    description: "Learn the difference between quick trades and patient growth",
    duration: "6 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Short-term investing focuses on quick price changes. Long-term investing focuses on growth over time. Long-term investing usually involves less stress and fewer decisions. A stock might drop one week but grow steadily over five years..."
  },
  {
    id: "exchange",
    icon: Store,
    title: "What Is a Stock Exchange?",
    description: "Learn where stocks are bought and sold",
    duration: "5 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Stock exchanges are places where stocks are bought and sold. Examples include NYSE and NASDAQ. They help match buyers and sellers. A buyer wants to purchase a stock, a seller wants to sell it, and the exchange connects them..."
  },
  {
    id: "dividends",
    icon: DollarSign,
    title: "How Dividends Work",
    description: "Learn how companies share profits with shareholders",
    duration: "5 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Some companies pay dividends to shareholders. Dividends provide income, not just price growth. Not all companies pay dividends. A company pays a small amount to shareholders each year, and investors earn money even if the price doesn't change..."
  },
  {
    id: "marketmovements",
    icon: BarChart3,
    title: "Why Do Markets Go Up and Down?",
    description: "Understand what causes market fluctuations and price changes",
    duration: "6 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Markets react to economic news, interest rates, and events. Fear and confidence influence prices. Short-term movements are unpredictable. News about higher interest rates causes markets to drop, but long-term investors wait instead of reacting..."
  },
  {
    id: "economy",
    icon: Globe,
    title: "How the Economy Affects Investing",
    description: "Understand how economic factors impact the stock market",
    duration: "6 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "The stock market reflects the overall economy. Things like jobs, inflation, and interest rates matter. Economic changes affect many companies at once. When interest rates rise, borrowing becomes more expensive, companies may grow more slowly, and stock prices can fall..."
  },
  {
    id: "risk",
    icon: Shield,
    title: "Understanding Risk",
    description: "Learn about risk and reward in investing",
    duration: "7 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Every investment has some level of risk. Think of riding a bike — going slow is safe, racing downhill is exciting but risky..."
  },
  {
    id: "compound",
    icon: Clock,
    title: "The Magic of Compound Growth",
    description: "How time makes your money grow faster",
    duration: "6 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Compound growth is like a snowball rolling downhill — it gets bigger and bigger! Learn why starting early is so powerful..."
  },
  {
    id: "savings",
    icon: Wallet,
    title: "Saving vs. Investing",
    description: "Know when to save and when to invest",
    duration: "5 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Saving is like storing food in your refrigerator. Investing is like planting a garden. Both are important for different reasons..."
  },
  {
    id: "news",
    icon: BarChart3,
    title: "How News Affects Stocks",
    description: "Understand why stock prices move with news",
    duration: "6 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Good news about a company usually makes its stock rise. Bad news makes it fall. Learn why and how to read market reactions..."
  },
  // Advanced Level - Portfolio Management & Responsibility
  {
    id: "portfolio",
    icon: Briefcase,
    title: "What Is a Portfolio?",
    description: "Learn how to think about all your investments together",
    duration: "5 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "A portfolio is all your investments together. Balance matters more than individual picks. Portfolios change over time. An investor owns stocks, ETFs, and cash. Losses in one area may be balanced by gains in another..."
  },
  {
    id: "rebalancing",
    icon: RefreshCw,
    title: "Rebalancing a Portfolio",
    description: "Learn how to adjust your portfolio to maintain balance",
    duration: "6 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Over time, some investments grow faster than others. Rebalancing adjusts the portfolio back to balance. It helps manage risk. Tech stocks grow quickly, the portfolio becomes risky, and the investor rebalances..."
  },
  {
    id: "responsible",
    icon: AlertTriangle,
    title: "Responsible Investing",
    description: "Understand the risks and responsibilities of investing",
    duration: "6 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Investing involves risk and responsibility. No one can predict the market perfectly. Learning matters more than winning. Someone promises guaranteed profits, but this is unrealistic and risky..."
  },
  {
    id: "notinvesting",
    icon: X,
    title: "What Investing Is NOT",
    description: "Learn what investing is not and how to avoid common mistakes",
    duration: "6 min",
    completed: false,
    locked: false,
    color: "accent",
    preview: "Investing is not gambling. Investing is not a shortcut to quick money. Investing requires patience and understanding. Someone buys stocks based on hype and loses money quickly..."
  },
];

const Learn = () => {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-hero py-12 md:py-16">
          <div className="container">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent-lighter px-4 py-2 text-sm font-medium text-accent-dark mb-4">
                <Sparkles className="h-4 w-4" />
                AI-Powered Lessons
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Learning Guide
              </h1>
              <p className="text-lg text-muted-foreground">
                Our AI teacher explains complex market concepts using fun analogies and examples. 
                Learn at your own pace with interactive lessons designed for your age.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container">
            <Tabs defaultValue="lessons" className="space-y-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="lessons" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  Lessons
                </TabsTrigger>
                <TabsTrigger value="tutor" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Ask AI Tutor
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lessons">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Lesson Cards */}
                  <div className="space-y-4">
                    <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                      Choose a Lesson
                    </h2>
                    {lessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        isSelected={selectedLesson === lesson.id}
                        onSelect={() => setSelectedLesson(lesson.id)}
                      />
                    ))}
                  </div>

                  {/* Lesson Preview */}
                  <div className="lg:sticky lg:top-24 h-fit">
                    <LessonPreview 
                      lesson={lessons.find(l => l.id === selectedLesson)} 
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tutor">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                      Chat with AI Tutor
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Have questions about stocks, investing, or anything from the lessons? 
                      Our AI tutor is here to help explain concepts in a way that's easy to understand.
                    </p>
                    <div className="space-y-3">
                      <Card variant="interactive" className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-lighter">
                            <Sparkles className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">Ask anything!</h3>
                            <p className="text-sm text-muted-foreground">The AI explains using examples you'll understand</p>
                          </div>
                        </div>
                      </Card>
                      <Card variant="interactive" className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-lighter">
                            <CheckCircle2 className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">Safe & Educational</h3>
                            <p className="text-sm text-muted-foreground">Never gives financial advice, only teaches concepts</p>
                          </div>
                        </div>
                      </Card>
                      <Card variant="interactive" className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-lighter">
                            <MessageCircle className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">Follow-up questions</h3>
                            <p className="text-sm text-muted-foreground">Keep asking until you understand</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                  <AITutor />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

function LessonCard({ 
  lesson, 
  isSelected, 
  onSelect 
}: { 
  lesson: typeof lessons[0]; 
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = lesson.icon;
  
  const colorClasses: Record<string, string> = {
    primary: "bg-accent-lighter text-accent",
    secondary: "bg-accent-lighter text-accent",
    accent: "bg-accent-lighter text-accent",
    success: "bg-accent-lighter text-accent",
    warning: "bg-accent-lighter text-accent",
  };

  return (
    <Card 
      variant={isSelected ? "highlighted" : "interactive"}
      className={`transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={`flex-shrink-0 h-14 w-14 rounded-xl flex items-center justify-center ${colorClasses[lesson.color]}`}>
            <Icon className="h-7 w-7" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-semibold text-foreground truncate">
                {lesson.title}
              </h3>
              {lesson.completed && (
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
              )}
              {lesson.locked && (
                <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{lesson.description}</p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{lesson.duration}</span>
            <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${isSelected ? "rotate-90" : ""}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LessonPreview({ lesson }: { lesson?: typeof lessons[0] }) {
  if (!lesson) {
    return (
      <Card variant="glass" className="h-96 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Select a Lesson
          </h3>
          <p className="text-muted-foreground">
            Click on any lesson to see a preview and start learning
          </p>
        </div>
      </Card>
    );
  }

  const Icon = lesson.icon;

  return (
    <Card variant="highlighted" className="animate-scale-in">
      <CardHeader>
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent-lighter text-accent mb-4">
          <Icon className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl">{lesson.title}</CardTitle>
        <CardDescription className="text-base">{lesson.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-xl bg-muted/50 p-4">
          <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Preview
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            {lesson.preview}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            ⏱️ {lesson.duration} read
          </span>
          <Link to={`/learn/${lesson.id}`}>
            <Button variant="hero" className="group">
              Start Lesson
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default Learn;
