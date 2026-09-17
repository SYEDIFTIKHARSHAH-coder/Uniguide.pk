import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, DatabaseZap } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { triggerIftiAiScan } from '../../api/adminApi';

export default function IftiAiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am IFTI AI, your personal admission and career counselor. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const messagesEndRef = useRef(null);

  const isAdminPage = window.location.pathname.startsWith('/admin');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e, retryCount = 0) => {
    if (e) e.preventDefault();
    if (!input.trim() && !retryCount) return;

    const userMessage = input.trim();
    if (retryCount === 0) {
      setInput('');
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    }
    
    setIsLoading(true);

    try {
      const response = await axios.post('/api/utilities/ai-tiger/chat', { prompt: userMessage });
      if (response.data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.data }]);
      } else {
        toast.error(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error("[IFTI AI Chat Error]:", error);
      
      if (error.response?.status === 429) {
        toast.error('IFTI AI is receiving too many questions. Try again in a moment.');
      } else if (error.response?.status === 500 && error.response?.data?.message?.includes('misconfigured')) {
        // Groq API key is broken
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: '⚠️ **Configuration Error**\nMy Groq API key is invalid or revoked. The admin needs to generate a new key at console.groq.com and update the GROQ_API_KEY environment variable.' 
        }]);
        toast.error('IFTI AI is misconfigured.');
      } else if (retryCount < 1) {
        // Automatic frontend retry once on network errors
        toast.error('Connection issue. Retrying...', { id: 'retry-toast', duration: 2000 });
        await new Promise(res => setTimeout(res, 2000));
        return handleSubmit(null, retryCount + 1);
      } else {
        const errorDetail = error.response?.data?.detail || error.response?.data?.message || 'Failed to connect.';
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Sorry, I ran into an error: ${errorDetail}` 
        }]);
        toast.error('Failed to connect to IFTI AI.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminScan = async () => {
    if (!window.confirm("Run AI Data Scan? This will use Groq to check for updated admission statuses for all universities.")) return;
    
    setIsScanning(true);
    setMessages(prev => [...prev, { role: 'assistant', content: '⏳ Starting AI Data Scan across all universities... This may take a minute.' }]);
    
    try {
      const res = await triggerIftiAiScan();
      const rep = res.report;
      
      const reportText = `✅ **FINAL QA REPORT: AI DATA SCAN COMPLETE**\n\n` +
        `Universities Checked: ${rep.universitiesChecked}\n` +
        `Admissions Updated: ${rep.admissionsUpdated}\n` +
        `Scholarships Added: ${rep.scholarshipsAdded}\n` +
        `Deadlines Updated: ${rep.deadlinesUpdated}\n` +
        `Duplicates Skipped: ${rep.duplicatesSkipped}\n` +
        `Errors: ${rep.errors}\n` +
        `Duration: ${rep.duration} seconds`;

      setMessages(prev => [...prev, { role: 'assistant', content: reportText }]);
      toast.success('AI Scan completed successfully!');
    } catch (error) {
      console.error("[AI Scan Error]:", error);
      toast.error('AI Scan failed or partially completed. Check console.');
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ AI Data Scan failed. Please check the server logs.' }]);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
        style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}
      >
        {/* Header */}
        <div className="bg-blue-600 p-4 rounded-t-2xl flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <span className="font-bold">IFTI AI</span>
          </div>
          <div className="flex items-center gap-2">
            {isAdminPage && (
              <button 
                onClick={handleAdminScan} 
                disabled={isScanning || isLoading}
                title="Run AI University Data Scan"
                className="p-1.5 bg-blue-700 hover:bg-blue-800 rounded-lg disabled:opacity-50 transition-colors"
              >
                {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <DatabaseZap className="w-4 h-4" />}
              </button>
            )}
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-blue-200 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {(isLoading || isScanning) && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-xs text-slate-500 font-medium">
                  {isScanning ? 'Scanning data...' : 'Thinking...'}
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-white rounded-b-2xl flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask IFTI AI..."
            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
            disabled={isLoading || isScanning}
          />
          <button
            type="submit"
            disabled={isLoading || isScanning || !input.trim()}
            className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </>
  );
}
