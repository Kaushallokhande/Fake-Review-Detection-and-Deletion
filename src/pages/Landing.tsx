import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShieldCheck, TrendingUp, Users, BarChart3 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Review Detection</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Stop Fake Reviews,<br />Build Trust
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Advanced AI technology to detect and remove fake reviews, ensuring authentic feedback for your products and services.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Now
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ReviewGuard?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Detection</h3>
              <p className="text-muted-foreground">
                Advanced machine learning algorithms identify fake reviews with high accuracy.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
              <p className="text-muted-foreground">
                Track review authenticity trends and make data-driven decisions.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">User Management</h3>
              <p className="text-muted-foreground">
                Comprehensive dashboards for both users and administrators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="bg-card rounded-lg border px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                How does ReviewGuard detect fake reviews?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                ReviewGuard uses advanced AI algorithms that analyze multiple factors including sentiment analysis, NER classification, AI detection, spam detection, link detection, promotional keywords, and rating-sentiment consistency to provide an accurate authenticity score.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="bg-card rounded-lg border px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                What file formats are supported?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We support XML, ZIP, and CSV file formats for batch review uploads. You can upload multiple reviews at once for efficient analysis.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="bg-card rounded-lg border px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                How long does the analysis take?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Analysis time depends on the batch size. Typically, most batches are processed within a few minutes. You can track the progress in your Analysis Queue.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="bg-card rounded-lg border px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Can I download the results?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! You can download the raw file with authentic and suspicious reviews separated, or download only the authentic reviews. You can also select specific reviews to download.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="bg-card rounded-lg border px-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                How accurate is the detection?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our AI models are trained on millions of reviews and achieve high accuracy rates. Each review receives a detailed authenticity score based on multiple detection parameters.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of businesses protecting their reputation with ReviewGuard.
          </p>
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
