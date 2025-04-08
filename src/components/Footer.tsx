
import { Link } from "react-router-dom";
import { Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t py-12 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent font-bold text-xl">
                JobCostCompass
              </span>
            </Link>
            <p className="text-muted-foreground mt-2 max-w-md">
              Track business expenses, capture receipts with AI, and monitor mileage for perfect job costing and tax reporting.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-base mb-3">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Project Tracking
                </Link>
              </li>
              <li>
                <Link to="/expenses" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Receipt Capture
                </Link>
              </li>
              <li>
                <Link to="/trips" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Mileage Tracking
                </Link>
              </li>
              <li>
                <Link to="/analysis" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Cost Analysis
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-base mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} JobCostCompass. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
