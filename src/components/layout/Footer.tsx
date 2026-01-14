import { Link } from "react-router-dom";
import { TrendingUp, Shield, BookOpen, AlertTriangle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white overflow-hidden">
                <img src="/logo.png" alt="Logo" className="h-full w-full object-contain" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                Stock<span className="text-accent">School</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              An educational platform helping students understand how markets work through interactive lessons and simulations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/learn" className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Learning Guide
              </Link>
              <Link to="/simulator" className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Market Simulator
              </Link>
              <Link to="/mistakes" className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Common Mistakes
              </Link>
              <Link to="/safety" className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Safety & Ethics
              </Link>
            </nav>
          </div>

          {/* Important Notice */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Important Notice</h4>
            <div className="rounded-xl bg-warning-light border border-warning/20 p-4">
              <p className="text-sm text-foreground">
                <strong>Educational Only:</strong> This platform is designed for learning purposes. No real money is involved, and we do not provide financial advice.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StockSchool. Designed for education.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/safety" className="text-sm text-muted-foreground hover:text-accent transition-colors">
              Privacy & Safety
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
