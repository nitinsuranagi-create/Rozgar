import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatWithAi } from '@/lib/aiApi';
import { useAuth } from '@/context/AuthContext';

interface Msg { role: 'user' | 'bot'; text: string; }

export default function Chatbot({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'bot', text: 'Namaste! 🙏 I\'m Saathi, your AI job assistant. Tell me your skill and I\'ll find the right work for you.' }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, open]);

  const send = async () => {
    if (!input.trim() || sending) return;
    const userMsg = input.trim();
    setMsgs(m => [...m, { role: 'user', text: userMsg }]);
    setInput('');
    setSending(true);
    try {
      const ai = await chatWithAi(userMsg, {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        location: user?.location,
        skills: user?.skills || [],
      });
      setMsgs(m => [...m, { role: 'bot', text: ai.reply }]);
    } catch {
      setMsgs(m => [...m, { role: 'bot', text: 'AI service is not ready right now. Please try again in a moment.' }]);
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full sm:w-[420px] h-[80vh] sm:h-[600px] flex flex-col shadow-warm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-field text-primary-foreground rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-card/20 grid place-items-center"><Sparkles className="w-4 h-4" /></div>
            <div>
              <div className="font-bold">Saathi AI</div>
              <div className="text-xs opacity-80">Always here to help</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-card/20 rounded"><X className="w-5 h-5"/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-secondary text-secondary-foreground rounded-bl-sm'}`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="p-3 border-t border-border flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder='e.g. "I know farming"' />
          <Button onClick={send} disabled={sending} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Send className="w-4 h-4"/>
          </Button>
        </div>
      </div>
    </div>
  );
}
