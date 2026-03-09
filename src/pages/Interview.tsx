import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SkipForward, Loader2, Volume2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Label } from "recharts";

interface InterviewData {
  id: string;
  questions: string[];
  answers: string[];
  scores: any[];
  status: string;
}

const Interview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load interview data
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await apiClient.getInterview(id);

        const questions = Array.isArray(data.questions) ? data.questions as string[] : [];
        const answers = Array.isArray(data.answers) ? data.answers as string[] : [];
        const scores = Array.isArray(data.scores) ? data.scores as any[] : [];

        setInterview({ id: data.id, questions, answers, scores, status: data.status });
        setLoading(false);

        // Speak the first question
        if (questions.length > 0) {
          speakText(questions[0]);
        }
      } catch (error: any) {
        toast({ title: "Interview not found", variant: "destructive" });
        navigate("/setup");
      }
    };
    load();
  }, [id]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const submitAnswer = async () => {
    if (!interview || !answer.trim()) {
      toast({ title: "Please provide an answer", variant: "destructive" });
      return;
    }

    setIsEvaluating(true);

    try {
      const { evaluation } = await apiClient.evaluateAnswer(
        interview.id,
        currentQ,
        answer.trim()
      );

      // Update local state
      const newAnswers = [...interview.answers];
      newAnswers[currentQ] = answer.trim();
      const newScores = [...interview.scores];
      newScores[currentQ] = evaluation;

      setInterview({ ...interview, answers: newAnswers, scores: newScores });

      // Move to next question or finish
      if (currentQ + 1 < interview.questions.length) {
        setCurrentQ(currentQ + 1);
        setAnswer("");
        speakText(interview.questions[currentQ + 1]);
      } else {
        // Interview complete
        toast({ title: "Interview Complete!", description: "Generating your report..." });
        navigate(`/report/${interview.id}`);
      }
    } catch (err: any) {
      toast({ title: "Evaluation failed", description: err.message, variant: "destructive" });
    } finally {
      setIsEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!interview || interview.questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No questions found. Please set up your interview again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-secondary">
        <motion.div
          className="h-full gradient-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQ + 1) / interview.questions.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex-1 container max-w-3xl py-12 flex flex-col">
        {/* Question counter */}
        <div className="text-center mb-8">
          <span className="text-sm text-muted-foreground font-display">
            Question {currentQ + 1} of {interview.questions.length}
          </span>
        </div>

        {/* Question display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="rounded-2xl border border-border bg-card p-8 shadow-card mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                {isSpeaking ? (
                  <Volume2 className="h-5 w-5 text-primary-foreground animate-pulse" />
                ) : (
                  <span className="text-sm font-bold text-primary-foreground">AI</span>
                )}
              </div>
              <div>
                <p className="text-lg font-display leading-relaxed pt-1">
                  {interview.questions[currentQ]}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-muted-foreground hover:text-primary"
                  onClick={() => speakText(interview.questions[currentQ])}
                >
                  <Volume2 className="h-4 w-4 mr-2" /> Replay Question
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Answer area */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm text-muted-foreground font-display">Your Answer</Label>
              <span className="text-xs text-muted-foreground">
                {answer.length} characters
              </span>
            </div>
            <Textarea
              placeholder="Type your response here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="flex-1 resize-none border-none focus-visible:ring-0 p-0 text-base leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="hero"
              size="lg"
              onClick={submitAnswer}
              disabled={!answer.trim() || isEvaluating}
              className="min-w-[150px]"
            >
              {isEvaluating ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Evaluating...</>
              ) : currentQ + 1 === interview.questions.length ? (
                <><Send className="h-4 w-4 mr-2" /> Finish Interview</>
              ) : (
                <><SkipForward className="h-4 w-4 mr-2" /> Submit & Next</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
