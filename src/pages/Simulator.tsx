import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Coins, TrendingUp, TrendingDown, 
  Zap, Gamepad2, AlertCircle,
  RefreshCw, Sparkles, ArrowRight, PieChart, Play, Pause,
  Smartphone, Car, Cpu
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PortfolioChart } from "@/components/simulator/PortfolioChart";
import { NewsSection, NewsItem } from "@/components/simulator/NewsSection";

// Real stocks
const companies = [
  {
    id: "aapl",
    name: "Apple",
    ticker: "AAPL",
    icon: Smartphone,
    description: "Technology company - smartphones, computers, and devices",
    color: "primary",
    currentValue: 175,
    volatility: 0.18,
    riskLevel: "medium",
  },
  {
    id: "tsla",
    name: "Tesla",
    ticker: "TSLA",
    icon: Car,
    description: "Electric vehicles and clean energy",
    color: "secondary",
    currentValue: 240,
    volatility: 0.3,
    riskLevel: "high",
  },
  {
    id: "nvda",
    name: "Nvidia",
    ticker: "NVDA",
    icon: Cpu,
    description: "Graphics processors and AI chips",
    color: "primary",
    currentValue: 450,
    volatility: 0.25,
    riskLevel: "high",
  },
];

const newsScenarios: NewsItem[][] = [
  // Scenario 1: Tech boom
  [
    { id: "n1", day: 1, headline: "Apple announces revolutionary new iPhone!", description: "Sales expected to surge as new model breaks pre-order records.", impact: "positive", affectedStocks: ["Apple"] },
    { id: "n2", day: 2, headline: "Nvidia reports strong AI chip demand", description: "Data centers increasing orders for AI processors.", impact: "positive", affectedStocks: ["Nvidia"] },
    { id: "n3", day: 3, headline: "Tesla delivers record number of vehicles", description: "Production capacity expansion drives strong quarterly results.", impact: "positive", affectedStocks: ["Tesla"] },
    { id: "n4", day: 4, headline: "Electric vehicle adoption accelerates globally", description: "Government incentives boost EV sales nationwide.", impact: "positive", affectedStocks: ["Tesla"] },
    { id: "n5", day: 5, headline: "Tech stocks face chip supply constraints", description: "Manufacturing delays affect production timelines.", impact: "negative", affectedStocks: ["Apple", "Nvidia"] },
  ],
  // Scenario 2: Market volatility
  [
    { id: "n1", day: 1, headline: "Economic concerns grow as inflation rises", description: "Consumers cutting back on non-essential spending.", impact: "negative", affectedStocks: ["Apple", "Tesla", "Nvidia"] },
    { id: "n2", day: 2, headline: "Nvidia launches new AI chip architecture", description: "Next-generation processors promise significant performance gains.", impact: "positive", affectedStocks: ["Nvidia"] },
    { id: "n3", day: 3, headline: "Apple expands into new markets", description: "Company announces major partnerships in emerging regions.", impact: "positive", affectedStocks: ["Apple"] },
    { id: "n4", day: 4, headline: "Tesla faces supply chain challenges", description: "Battery material shortages impact production.", impact: "negative", affectedStocks: ["Tesla"] },
    { id: "n5", day: 5, headline: "AI demand continues to surge", description: "Enterprise adoption drives chip sales higher.", impact: "positive", affectedStocks: ["Nvidia", "Apple"] },
  ],
  // Scenario 3: Mixed market
  [
    { id: "n1", day: 1, headline: "Apple faces production delays", description: "Supply chain issues affect new product launches.", impact: "negative", affectedStocks: ["Apple"] },
    { id: "n2", day: 2, headline: "Tesla announces new Supercharger network expansion", description: "Infrastructure growth supports EV adoption.", impact: "positive", affectedStocks: ["Tesla"] },
    { id: "n3", day: 3, headline: "Nvidia partners with major tech companies", description: "Strategic alliances boost market position.", impact: "positive", affectedStocks: ["Nvidia"] },
    { id: "n4", day: 4, headline: "Competition increases in electric vehicle market", description: "New entrants challenge established players.", impact: "negative", affectedStocks: ["Tesla"] },
    { id: "n5", day: 5, headline: "Tech sector shows strong earnings growth", description: "Consumer demand remains robust across product lines.", impact: "positive", affectedStocks: ["Apple", "Nvidia", "Tesla"] },
  ],
];

const Simulator = () => {
  const [cash, setCash] = useState(10000);
  const [allocations, setAllocations] = useState<Record<string, number>>(
    Object.fromEntries(companies.map(c => [c.id, 0]))
  );
  const [etfAllocation, setEtfAllocation] = useState(0);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [portfolioHistory, setPortfolioHistory] = useState<{ day: number; value: number }[]>([]);
  const [stockPrices, setStockPrices] = useState<Record<string, number>>(
    Object.fromEntries(companies.map(c => [c.id, c.currentValue]))
  );
  
  // Pre-select news scenario for preview during buying phase
  const [previewNews] = useState<NewsItem[]>(() => 
    newsScenarios[Math.floor(Math.random() * newsScenarios.length)]
  );

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0) + etfAllocation;
  const remainingCash = cash - totalAllocated;

  const calculatePortfolioValue = (prices: Record<string, number>) => {
    let total = 0;
    Object.entries(allocations).forEach(([id, amount]) => {
      if (amount > 0) {
        const company = companies.find(c => c.id === id)!;
        const priceChange = prices[id] / company.currentValue;
        total += amount * priceChange;
      }
    });
    // ETF averages all stock performance
    if (etfAllocation > 0) {
      const avgChange = Object.entries(prices).reduce((sum, [id, price]) => {
        const company = companies.find(c => c.id === id)!;
        return sum + (price / company.currentValue);
      }, 0) / companies.length;
      total += etfAllocation * avgChange;
    }
    return Math.round(total);
  };

  const handleAllocationChange = (companyId: string, value: number[]) => {
    const newValue = value[0];
    const otherAllocations = Object.entries(allocations)
      .filter(([id]) => id !== companyId)
      .reduce((sum, [, val]) => sum + val, 0) + etfAllocation;
    
    if (newValue + otherAllocations <= cash) {
      setAllocations(prev => ({ ...prev, [companyId]: newValue }));
    }
  };

  const handleEtfChange = (value: number[]) => {
    const newValue = value[0];
    const companyTotal = Object.values(allocations).reduce((sum, val) => sum + val, 0);
    
    if (newValue + companyTotal <= cash) {
      setEtfAllocation(newValue);
    }
  };

const startSimulation = () => {
    if (totalAllocated > 0) {
      // Use the same news that was shown in preview
      setNews(previewNews);
      setSimulationStarted(true);
      setIsPlaying(true);
      setCurrentDay(0);
      setPortfolioHistory([{ day: 0, value: totalAllocated }]);
      setStockPrices(Object.fromEntries(companies.map(c => [c.id, c.currentValue])));
    }
  };

  const resetSimulation = () => {
    setSimulationStarted(false);
    setIsPlaying(false);
    setCurrentDay(0);
    setNews([]);
    setPortfolioHistory([]);
    setAllocations(Object.fromEntries(companies.map(c => [c.id, 0])));
    setEtfAllocation(0);
    setStockPrices(Object.fromEntries(companies.map(c => [c.id, c.currentValue])));
  };

  // Simulation tick
  useEffect(() => {
    if (!isPlaying || currentDay >= 5) {
      if (currentDay >= 5) setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      const nextDay = currentDay + 1;
      setCurrentDay(nextDay);

      // Update stock prices based on news
      const todayNews = news.find(n => n.day === nextDay);
      const newPrices = { ...stockPrices };

      companies.forEach(company => {
        // Base random movement
        const baseChange = (Math.random() - 0.5) * 2 * company.volatility * 10;
        let newsImpact = 0;

        // Check if this stock is affected by today's news
        if (todayNews && todayNews.affectedStocks.includes(company.name)) {
          newsImpact = todayNews.impact === "positive" ? 8 + Math.random() * 7 : -(8 + Math.random() * 7);
        }

        newPrices[company.id] = Math.max(10, newPrices[company.id] + baseChange + newsImpact);
      });

      setStockPrices(newPrices);
      const newValue = calculatePortfolioValue(newPrices);
      setPortfolioHistory(prev => [...prev, { day: nextDay, value: newValue }]);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isPlaying, currentDay, news, stockPrices, allocations, etfAllocation]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-hero py-12 md:py-16">
          <div className="container">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent-lighter px-4 py-2 text-sm font-medium text-accent-dark mb-4">
                <Gamepad2 className="h-4 w-4" />
                Educational Simulation
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Market Simulator
              </h1>
              <p className="text-lg text-muted-foreground">
                Invest virtual tokens in companies inspired by real businesses. 
                Watch how news events affect your portfolio — no real money involved!
              </p>
            </div>
          </div>
        </section>

        {/* Cash Display */}
        <section className="border-b border-border bg-card">
          <div className="container py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-lighter">
                  <Coins className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Cash</p>
                  <p className="font-display text-2xl font-bold text-foreground">${cash.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Allocated</p>
                  <p className="font-semibold text-foreground">${totalAllocated.toLocaleString()}</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className={`font-semibold ${remainingCash > 0 ? "text-success" : "text-muted-foreground"}`}>
                    ${remainingCash.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container">
            {!simulationStarted ? (
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Companies */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      Choose Your Investments
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      Inspired by real companies
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {companies.map((company) => (
                      <CompanyCard
                        key={company.id}
                        company={company}
                        allocation={allocations[company.id]}
                        maxCash={cash}
                        onAllocationChange={(value) => handleAllocationChange(company.id, value)}
                      />
                    ))}
                  </div>

                  {/* ETF Option */}
                  <Card variant="highlighted">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                          <PieChart className="h-7 w-7" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                            Diversified Bundle (ETF)
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Automatically spreads your tokens across all companies equally — lower risk!
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Allocation</span>
                              <span className="font-semibold text-foreground">{etfAllocation} tokens</span>
                            </div>
                            <Slider
                              value={[etfAllocation]}
                              onValueChange={handleEtfChange}
                              max={tokens}
                              step={10}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Your Portfolio</CardTitle>
                      <CardDescription>How your tokens are distributed</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(allocations).map(([id, amount]) => {
                        const company = companies.find(c => c.id === id)!;
                        const percentage = tokens > 0 ? (amount / tokens) * 100 : 0;
                        return amount > 0 ? (
                          <div key={id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground">{company.ticker}</span>
                              <span className="text-muted-foreground">{percentage.toFixed(0)}%</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        ) : null;
                      })}
                      {etfAllocation > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-foreground">ETF Bundle</span>
                            <span className="text-muted-foreground">{((etfAllocation / tokens) * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={(etfAllocation / tokens) * 100} className="h-2" />
                        </div>
                      )}
                      {totalAllocated === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Start allocating tokens to see your portfolio
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Upcoming News Preview */}
                  <NewsSection news={previewNews} currentDay={5} isPreview={true} />

                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full group"
                    onClick={startSimulation}
                    disabled={totalAllocated === 0}
                  >
                    <Play className="h-5 w-5" />
                    Start Simulation
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Watch 5 days of market activity based on news events
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Day indicator */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      Day {currentDay} of 5
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {isPlaying ? "Simulation running..." : currentDay >= 5 ? "Simulation complete!" : "Paused"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {currentDay < 5 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {isPlaying ? "Pause" : "Resume"}
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={resetSimulation}>
                      <RefreshCw className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Progress bar */}
                <Progress value={(currentDay / 5) * 100} className="h-2" />

                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Chart */}
                  <PortfolioChart data={portfolioHistory} startingValue={totalAllocated} />

                  {/* News */}
                  <NewsSection news={news} currentDay={currentDay} />
                </div>

                {/* Stock prices */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Stock Prices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {companies.map(company => {
                        const currentPrice = stockPrices[company.id];
                        const change = currentPrice - company.currentValue;
                        const changePercent = ((change / company.currentValue) * 100).toFixed(1);
                        const isUp = change >= 0;
                        const Icon = company.icon;
                        
                        return (
                          <div key={company.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground">{company.ticker}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">${currentPrice.toFixed(0)}</span>
                                <span className={`text-xs flex items-center ${isUp ? "text-success" : "text-destructive"}`}>
                                  {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                  {isUp ? "+" : ""}{changePercent}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Completion message */}
                {currentDay >= 5 && (
                  <Card className="border-2 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-lighter">
                          <Sparkles className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                            Simulation Complete! 🎉
                          </h3>
                          <div className="text-muted-foreground space-y-2">
                            <p>
                              You started with <strong>{totalAllocated}</strong> tokens and ended with <strong>{portfolioHistory[portfolioHistory.length - 1]?.value || totalAllocated}</strong> tokens.
                            </p>
                            <p>
                              Notice how news events affected different stocks? Companies in the same industry often move together. 
                              That's why <strong>diversification</strong> helps — when some stocks go down, others might go up!
                            </p>
                            <p className="text-sm">
                              Remember: Real markets are unpredictable. This simulation shows how news can affect prices, 
                              but actual investing involves many more factors.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

function CompanyCard({ 
  company, 
  allocation, 
  maxTokens,
  onAllocationChange 
}: { 
  company: typeof companies[0]; 
  allocation: number;
  maxTokens: number;
  onAllocationChange: (value: number[]) => void;
}) {
  const Icon = company.icon;
  
  const colorClasses: Record<string, string> = {
    primary: "bg-accent-lighter text-accent",
    secondary: "bg-accent-lighter text-accent",
    accent: "bg-accent-lighter text-accent",
    success: "bg-accent-lighter text-accent",
    warning: "bg-accent-lighter text-accent",
    destructive: "bg-accent-lighter text-accent",
  };

  const riskColors: Record<string, string> = {
    low: "text-success",
    medium: "text-warning",
    high: "text-destructive",
  };

  return (
    <Card variant="interactive">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[company.color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-foreground">{company.name}</h3>
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{company.ticker}</span>
            </div>
            <p className="text-sm text-muted-foreground">{company.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Your allocation</span>
            <span className="font-semibold text-foreground">{allocation} tokens</span>
          </div>
          <Slider
            value={[allocation]}
            onValueChange={onAllocationChange}
            max={maxTokens}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={riskColors[company.riskLevel]}>Risk: {company.riskLevel}</span>
            <span>Price: ${company.currentValue}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Simulator;
