import { useCallback, useEffect, useRef, useState } from 'react';
import { useBlocker, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Job, PASSING_SCORE, Question } from '@/lib/mockData';
import { fetchJobById } from '@/lib/jobsApi';
import { fetchExamQuestions } from '@/lib/examApi';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { submitApplicationExam } from '@/lib/applicationsApi';

const TEST_DURATION = 180; // seconds

const Exam = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const applicationId = params.get('applicationId');
  const nav = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(TEST_DURATION);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState<{ score: number; pass: boolean } | null>(null);

  const submittedRef = useRef(false);
  const doneRef = useRef(false);
  const jobRef = useRef<Job | null>(null);
  const applicationIdRef = useRef<string | null>(null);
  const questionsRef = useRef<Question[]>([]);

  useEffect(() => {
    doneRef.current = !!done;
  }, [done]);

  useEffect(() => {
    jobRef.current = job;
  }, [job]);

  useEffect(() => {
    applicationIdRef.current = applicationId;
  }, [applicationId]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const foundJob = await fetchJobById(id);
        if (!foundJob) {
          setJob(null);
          setLoading(false);
          return;
        }
        setJob(foundJob);
        const skill = foundJob.skills?.[0] || foundJob.category || 'general';
        const q = await fetchExamQuestions({
          skill,
          jobCategory: foundJob.category,
          jobSkills: foundJob.skills || [],
        });
        setQuestions(q);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load exam');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const abandonExam = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const j = jobRef.current;
    const appId = applicationIdRef.current;
    const result = { job: j?.title, score: 0, status: 'Fail' };
    localStorage.setItem('rozgar_last_result', JSON.stringify(result));
    setDone({ score: 0, pass: false });
    if (appId) {
      try {
        await submitApplicationExam(appId, 0, false);
      } catch {
        // best-effort
      }
    }
    toast.error('Exam ended — auto-failed (left or navigated away).');
  }, []);

  const submitSuccess = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const j = jobRef.current;
    const appId = applicationIdRef.current;
    const qs = questionsRef.current;
    if (!j || qs.length === 0) return;

    let correct = 0;
    qs.forEach((q) => {
      if (answers[q.id] === q.correct) correct++;
    });
    const score = Math.round((correct / qs.length) * 100);
    const pass = score >= PASSING_SCORE;
    localStorage.setItem('rozgar_last_result', JSON.stringify({ job: j.title, score, status: pass ? 'Pass' : 'Fail' }));
    if (appId) {
      try {
        await submitApplicationExam(appId, score, pass);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to sync exam result');
      }
    }
    setDone({ score, pass });
  }, [answers]);

  // Block in-app navigation (another page) until exam is finished
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !doneRef.current &&
      !submittedRef.current &&
      currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    if (submittedRef.current) {
      blocker.proceed?.();
      return;
    }
    void (async () => {
      await abandonExam();
      blocker.proceed?.();
    })();
  }, [blocker, blocker.state, abandonExam]);

  // Tab switch / close / refresh
  useEffect(() => {
    const onHide = () => {
      if (submittedRef.current || doneRef.current) return;
      void abandonExam();
    };
    const onVis = () => {
      if (document.visibilityState === 'hidden') onHide();
    };
    window.addEventListener('beforeunload', onHide);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('beforeunload', onHide);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [abandonExam]);

  // Countdown
  useEffect(() => {
    if (done) return;
    if (time <= 0) {
      void submitSuccess();
      return;
    }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, done, submitSuccess]);

  if (loading) return <DashboardLayout><div>Loading exam...</div></DashboardLayout>;
  if (!job) return <DashboardLayout><div>Job not found.</div></DashboardLayout>;
  if (questions.length === 0) return <DashboardLayout><div>No questions found for this skill.</div></DashboardLayout>;

  const mm = String(Math.floor(time / 60)).padStart(2, '0');
  const ss = String(time % 60).padStart(2, '0');

  if (done) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto text-center py-8">
          <div className={`w-20 h-20 mx-auto rounded-full grid place-items-center mb-6 ${done.pass ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'}`}>
            {done.pass ? <CheckCircle className="w-10 h-10"/> : <XCircle className="w-10 h-10"/>}
          </div>
          <h1 className="text-4xl font-bold mb-2">{done.pass ? 'Mubarak ho! 🎉' : 'Better luck next time'}</h1>
          <p className="text-muted-foreground mb-6">Your score for <b>{job.title}</b></p>
          <div className="text-7xl font-bold mb-2 tabular-nums">{done.score}%</div>
          <p className="text-sm text-muted-foreground mb-8">Passing score: {PASSING_SCORE}% · {questions.length} questions</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => nav('/dashboard/result')} className="bg-primary hover:bg-primary/90">View Results</Button>
            <Button variant="outline" onClick={() => nav('/dashboard/jobs')}>More Jobs</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <span className="text-xs font-semibold text-accent uppercase">{job.category}</span>
            <h1 className="text-2xl font-bold">{job.title} — Skill Test</h1>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold tabular-nums ${time < 30 ? 'bg-destructive text-destructive-foreground animate-pulse' : 'bg-primary text-primary-foreground'}`}>
            <Clock className="w-4 h-4"/> {mm}:{ss}
          </div>
        </div>
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mb-6 text-sm flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5"/>
          <span>
            Do not switch tabs, refresh, or leave this page — you will be auto-failed and rejected. Pass score: {PASSING_SCORE}%. This test has {questions.length} questions.
          </span>
        </div>
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-card border border-border rounded-2xl p-5">
              <div className="text-xs text-muted-foreground mb-1">Question {i + 1} • {q.category}</div>
              <h3 className="font-semibold mb-4">{q.question}</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {q.options.map((opt, j) => (
                  <button key={j} type="button" onClick={() => setAnswers((a) => ({ ...a, [q.id]: j }))}
                    className={`text-left px-4 py-3 rounded-lg border text-sm transition ${answers[q.id] === j ? 'border-primary bg-primary/10 font-semibold' : 'border-border hover:border-primary/40'}`}>
                    {String.fromCharCode(65 + j)}. {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button type="button" onClick={() => void submitSuccess()} className="w-full mt-6 h-12 bg-accent hover:bg-accent/90 text-accent-foreground text-base">Submit Test</Button>
      </div>
    </DashboardLayout>
  );
};
export default Exam;
