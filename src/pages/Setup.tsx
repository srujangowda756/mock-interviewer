import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Loader2, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

const difficulties = [
  { value: "beginner", label: "Beginner", description: "Foundational concepts and basic problem solving" },
  { value: "intermediate", label: "Intermediate", description: "Applied knowledge and system design basics" },
  { value: "advanced", label: "Advanced", description: "Complex architecture and deep technical expertise" },
];

const Setup = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStart = async () => {
    if (!jobDescription.trim()) {
      toast({ title: "Job description required", description: "Please paste a job description to continue.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      // Create interview and generate questions via our custom API
      const interview = await apiClient.createInterview(jobDescription, difficulty);

      if (!interview || !interview.id) throw new Error("Failed to create interview");

      navigate(`/interview/${interview.id}`);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </nav>

      <div className="container max-w-2xl py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary mb-4">
              <FileText className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-display mb-2">Set Up Your Interview</h1>
            <p className="text-muted-foreground">Configure your mock interview session</p>
          </div>

          <div className="space-y-8">
            {/* Job Description */}
            <div className="space-y-3">
              <Label className="text-base font-display font-medium">Job Description</Label>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="resize-none text-sm"
              />
              <p className="text-xs text-muted-foreground">
                The AI will extract key skills and generate relevant interview questions.
              </p>
            </div>

            {/* Difficulty */}
            <div className="space-y-3">
              <Label className="text-base font-display font-medium">Interview Difficulty</Label>
              <RadioGroup value={difficulty} onValueChange={setDifficulty} className="grid gap-3">
                {difficulties.map((d) => (
                  <label
                    key={d.value}
                    className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all ${difficulty === d.value
                        ? "border-primary bg-primary/5 shadow-card"
                        : "border-border hover:border-primary/30"
                      }`}
                  >
                    <RadioGroupItem value={d.value} />
                    <div>
                      <div className="font-medium font-display">{d.label}</div>
                      <div className="text-sm text-muted-foreground">{d.description}</div>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Start Button */}
            <Button
              variant="hero"
              size="lg"
              className="w-full py-6 text-base"
              onClick={handleStart}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Generating Questions...
                </>
              ) : (
                <>
                  Start Interview <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Setup;
