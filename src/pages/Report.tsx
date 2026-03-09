import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Trophy, TrendingUp, AlertTriangle, BookOpen } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { apiClient } from "@/lib/api";

interface Evaluation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvement_suggestions: string[];
}

interface ReportData {
  questions: string[];
  answers: string[];
  scores: Evaluation[];
  overall_score: number | null;
  difficulty: string;
}

const Report = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeQ, setActiveQ] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await apiClient.getInterview(id);

        const questions = Array.isArray(data.questions) ? data.questions as string[] : [];
        const answers = Array.isArray(data.answers) ? data.answers as string[] : [];
        const scores = Array.isArray(data.scores) ? (data.scores as unknown as Evaluation[]) : [];

        setReport({
          questions,
          answers,
          scores,
          overall_score: data.overall_score ? Number(data.overall_score) : null,
          difficulty: data.difficulty,
        });
      } catch (error: any) {
        console.error("Failed to load report", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!report || report.scores.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Report not ready yet. Complete the interview first.</p>
        <Link to="/setup">
          <Button variant="hero">Start New Interview</Button>
        </Link>
      </div>
    );
  }

  const avgScore = report.scores.reduce((sum, s) => sum + (s?.score || 0), 0) / report.scores.length;
  const overallScore = report.overall_score ?? Math.round(avgScore * 10) / 10;

  const barData = report.scores.map((s, i) => ({
    name: `Q${i + 1}`,
    score: s?.score || 0,
  }));

  const allStrengths = report.scores.flatMap((s) => s?.strengths || []);
  const allWeaknesses = report.scores.flatMap((s) => s?.weaknesses || []);
  const allSuggestions = report.scores.flatMap((s) => s?.improvement_suggestions || []);

  // Deduplicate
  const uniqueStrengths = [...new Set(allStrengths)].slice(0, 5);
  const uniqueWeaknesses = [...new Set(allWeaknesses)].slice(0, 5);
  const uniqueSuggestions = [...new Set(allSuggestions)].slice(0, 5);

  const scoreColor = overallScore >= 7 ? "text-success" : overallScore >= 5 ? "text-warning" : "text-destructive";

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <Link to="/setup">
            <Button variant="hero" size="sm">
              New Interview <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container max-w-5xl py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary mb-4">
              <Trophy className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-display mb-2">Interview Report</h1>
            <p className="text-muted-foreground capitalize">{report.difficulty} Level</p>
          </div>

          {/* Overall Score */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card text-center mb-8">
            <div className="text-sm text-muted-foreground font-display mb-2">Overall Score</div>
            <div className={`text-6xl font-bold font-display ${scoreColor}`}>
              {overallScore.toFixed(1)}
            </div>
            <div className="text-muted-foreground">/ 10</div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display font-semibold mb-4">Score by Question</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display font-semibold mb-4">Performance Overview</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={barData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <PolarRadiusAxis domain={[0, 10]} tick={false} />
                  <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-success" />
                <h3 className="font-display font-semibold">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {uniqueStrengths.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-success mt-1">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <h3 className="font-display font-semibold">Weaknesses</h3>
              </div>
              <ul className="space-y-2">
                {uniqueWeaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-warning mt-1">⚠</span> {w}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold">Study Topics</h3>
              </div>
              <ul className="space-y-2">
                {uniqueSuggestions.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">→</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Per-question feedback */}
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold">Question-by-Question Feedback</h2>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {report.questions.map((_, i) => (
                <Button
                  key={i}
                  variant={activeQ === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveQ(i)}
                  className="flex-shrink-0"
                >
                  Q{i + 1}
                </Button>
              ))}
            </div>

            {report.scores[activeQ] && (
              <motion.div
                key={activeQ}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4"
              >
                <div>
                  <div className="text-sm text-muted-foreground font-display mb-1">Question</div>
                  <p className="font-medium">{report.questions[activeQ]}</p>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-display mb-1">Your Answer</div>
                  <p className="text-sm">{report.answers[activeQ] || "No answer provided"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground font-display">Score</div>
                  <span className={`text-2xl font-bold font-display ${report.scores[activeQ].score >= 7 ? "text-success" :
                      report.scores[activeQ].score >= 5 ? "text-warning" : "text-destructive"
                    }`}>
                    {report.scores[activeQ].score}/10
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-display font-medium text-success mb-2">Strengths</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {report.scores[activeQ].strengths?.map((s: string, i: number) => (
                        <li key={i}>✓ {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-display font-medium text-warning mb-2">Areas to Improve</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {report.scores[activeQ].weaknesses?.map((w: string, i: number) => (
                        <li key={i}>⚠ {w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Report;
