
import { Link } from "react-router-dom";
import { 
  Receipt, 
  Car, 
  BarChart3, 
  FolderKanban, 
  Camera, 
  MapPin,
  FileText,
  TrendingUp,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const features = [
  {
    icon: <Camera className="h-6 w-6 text-brand-blue" />,
    title: "Smart Receipt Capture",
    description: "Snap photos of receipts and let AI extract and categorize the data automatically.",
  },
  {
    icon: <MapPin className="h-6 w-6 text-brand-blue" />,
    title: "Automatic Mileage Tracking",
    description: "Track mileage with GPS and easily categorize trips as personal or business.",
  },
  {
    icon: <FolderKanban className="h-6 w-6 text-brand-blue" />,
    title: "Project Management",
    description: "Create and manage projects, assigning expenses and trips to specific jobs.",
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-brand-blue" />,
    title: "Cost Analysis",
    description: "Generate detailed reports and visualize expense breakdowns by project.",
  },
];

const testimonials = [
  {
    quote: "This app has revolutionized how I track expenses for my contracting business. The AI receipt scanning is incredibly accurate!",
    author: "Michael Johnson",
    role: "Independent Contractor",
  },
  {
    quote: "The mileage tracking feature alone saves me hours every month. I no longer have to manually log every business trip.",
    author: "Sarah Williams",
    role: "Real Estate Agent",
  },
];

const pricingPlans = [
  {
    name: "Basic",
    price: "$9.99",
    period: "per month",
    description: "Perfect for freelancers and small businesses",
    features: [
      "Up to 50 receipts per month",
      "Basic mileage tracking",
      "Up to 5 active projects",
      "CSV export",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$19.99",
    period: "per month",
    description: "Ideal for growing businesses",
    features: [
      "Unlimited receipts",
      "Advanced mileage tracking",
      "Unlimited projects",
      "PDF and CSV exports",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
];

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Smart Job Costing <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent">Made Simple</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-md">
                Track expenses, receipts, and mileage effortlessly. Let AI handle the details while you focus on your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to="/login">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="#how-it-works">Learn More</Link>
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-brand-green" />
                <span>No credit card required</span>
              </div>
            </div>
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-xl animate-slide-up">
              <img 
                src="/placeholder.svg" 
                alt="JobCostCompass dashboard preview" 
                className="object-cover h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/80 to-transparent">
                <div className="absolute bottom-6 left-6 flex gap-4">
                  <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-3 flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-brand-blue" />
                    <span className="font-medium">12 Receipts</span>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-3 flex items-center gap-2">
                    <Car className="h-5 w-5 text-brand-blue" />
                    <span className="font-medium">143 Miles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" id="how-it-works">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Powerful tools to streamline your job costing and expense tracking
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="mb-4 p-3 bg-blue-50 inline-block rounded-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Highlight */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-4 text-brand-blue font-medium">
                Receipt Tracking
              </div>
              <h2 className="text-3xl font-bold mb-6">
                AI-Powered Receipt Processing
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Simply snap a photo of your receipt and watch as our AI extracts all the important details automatically.
              </p>
              <ul className="space-y-3">
                {[
                  "Automatic vendor detection",
                  "Line item extraction",
                  "Tax calculation",
                  "Project assignment",
                  "Category suggestions",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8" asChild>
                <Link to="/expenses">
                  <FileText className="h-4 w-4 mr-2" />
                  Try Receipt Scanning
                </Link>
              </Button>
            </div>
            <div className="relative h-[500px] w-full rounded-xl overflow-hidden shadow-xl">
              <img 
                src="/placeholder.svg" 
                alt="Receipt scanning demonstration" 
                className="object-cover h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative h-[500px] w-full rounded-xl overflow-hidden shadow-xl">
              <img 
                src="/placeholder.svg" 
                alt="Mileage tracking demonstration" 
                className="object-cover h-full w-full"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block mb-4 text-brand-blue font-medium">
                Mileage Tracking
              </div>
              <h2 className="text-3xl font-bold mb-6">
                Effortless Trip Monitoring
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Automatically track your business trips and assign them to specific projects for precise job costing.
              </p>
              <ul className="space-y-3">
                {[
                  "Automatic GPS tracking",
                  "Trip categorization",
                  "Project assignment",
                  "IRS-compliant reporting",
                  "Detailed trip history",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8" asChild>
                <Link to="/trips">
                  <Car className="h-4 w-4 mr-2" />
                  Track Your Trips
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground">
              Join thousands of businesses that trust JobCostCompass for their expense tracking needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-md border"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-6 text-brand-blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                    </svg>
                  </div>
                  <p className="text-lg mb-4 flex-grow">{testimonial.quote}</p>
                  <div className="mt-4">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground">
              Choose the plan that works for your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl shadow-md border p-8 relative ${
                  plan.popular ? "border-brand-blue shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-brand-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-brand-green mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              All plans come with a 14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Job Costing?</h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of businesses that use JobCostCompass to track expenses, monitor mileage, and improve profitability.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/login">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
