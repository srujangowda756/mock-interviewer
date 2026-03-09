import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic, Brain, BarChart3, Zap, ArrowRight, MessageSquare, Target, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Questions",
    description: "Gemini AI generates tailored interview questions based on your job description.",
  },
  {
    icon: Mic,
    title: "Voice Interaction",
    description: "Natural voice-based interviews with real-time speech recognition.",
  },
  {
    icon: Target,
    title: "Smart Evaluation",
    description: "Each answer scored on correctness, relevance, clarity, and communication.",
  },
  {
    icon: BarChart3,
    title: "Detailed Reports",
    description: "Visual performance reports with strengths, weaknesses, and study recommendations.",
  },
];

const steps = [
  { step: "01", title: "Paste Job Description", description: "Enter the JD for the role you're preparing for." },
  { step: "02", title: "AI Generates Questions", description: "Gemini creates 5 targeted interview questions." },
  { step: "03", title: "Voice Interview", description: "Answer questions using your microphone with AI interviewer." },
  { step: "04", title: "Get Your Report", description: "Receive detailed feedback and improvement suggestions." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Mic className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold">MockMaster</span>
          </div>
          <Link to="/setup">
            <Button variant="hero" size="sm">
              Start Interview <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 gradient-hero overflow-hidden">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-6">
              <Zap className="h-3.5 w-3.5 text-accent" />
              AI-Powered Interview Practice
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6">
              Ace Your Next
              <br />
              <span className="text-gradient">Tech Interview</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10">
              Practice with an AI interviewer that generates real questions from any job description.
              Get instant voice-based feedback and detailed performance reports.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/setup">
                <Button variant="hero" size="lg" className="text-base px-8 py-6">
                  Start Mock Interview <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="text-base px-8 py-6">
                  Learn More
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Demo preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 mx-auto max-w-4xl"
          >
            <div className="rounded-2xl border border-border bg-card shadow-elevated p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-warning/60" />
                  <div className="h-3 w-3 rounded-full bg-success/60" />
                </div>
                <span className="text-sm text-muted-foreground">MockMaster Interview Session</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="rounded-xl bg-secondary p-4 text-sm">
                    "Can you explain the difference between REST and GraphQL APIs, and when would you choose one over the other?"
                  </div>
                </div>
                <div className="flex items-start gap-3 flex-row-reverse">
                  <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <Mic className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div className="rounded-xl bg-primary/10 p-4 text-sm max-w-md">
                    "REST uses resource-based endpoints while GraphQL uses a single endpoint with queries..."
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Everything You Need to Prepare
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete AI interview practice platform with voice interaction and detailed analytics.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elevated transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Four simple steps to improve your interview skills.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-5xl font-display font-bold text-gradient mb-4">{step.step}</div>
                <h3 className="text-lg font-display font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Ready to Practice?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Start your AI-powered mock interview now and get actionable feedback in minutes.
            </p>
            <Link to="/setup">
              <Button variant="hero" size="lg" className="text-base px-10 py-6">
                Start Mock Interview <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md gradient-primary flex items-center justify-center">
              <Mic className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-display font-semibold">MockMaster</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MockMaster. AI-powered interview preparation.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
