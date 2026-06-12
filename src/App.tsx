import React, { useState, useEffect, FormEvent } from 'react';
import { 
  Bot, Smartphone, Globe, Megaphone, Search, Share2, Video, Palette, 
  ShoppingBag, Code, User, Calendar, Check, X, Menu, ChevronRight, 
  MessageSquare, Send, CreditCard, Play, FileText, CheckCircle, 
  MapPin, Phone, Mail, Award, Clock, Sparkles, Building, Briefcase, Plus, AlertCircle, RefreshCw
} from 'lucide-react';
import { SERVICES, PROJECTS, PRICING_PLANS, TEAM, BLOGS, FAQS } from './data';
import { Service, Project, PricingPlan, BlogPost, Booking, ProjectTrack, SupportTicket } from './types';

// Map icon names to Lucide icon components
const iconMap: Record<string, any> = {
  Globe, Smartphone, Bot, Megaphone, Search, Share2, Video, Palette, ShoppingBag, Code
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'portfolio' | 'pricing' | 'blog' | 'career' | 'contact' | 'dashboard' | 'admin'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Services dynamic filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('All'); // Service Types: All, Development, AI Services, Marketing, Creative
  const [selectedTech, setSelectedTech] = useState<string>('All'); // Technologies: All, React, WordPress, Android, iOS, AI

  // Dashboard / State states from Express API
  const [userProjects, setUserProjects] = useState<ProjectTrack[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [userTickets, setUserTickets] = useState<SupportTicket[]>([]);
  const [loadingStates, setLoadingStates] = useState({
    projects: false,
    bookings: false,
    tickets: false
  });

  // Modals / Triggers
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);
  const [activeBlogModal, setActiveBlogModal] = useState<BlogPost | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: 'Ashish Roy',
    email: 'ashisher579@gmail.com',
    phone: '+1 415 555 2673',
    serviceId: 'web-dev',
    date: '2026-06-18',
    time: '14:30',
    notes: 'Need standard Next.js ecommerce landing structure setup.'
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Payments Simulation Modal
  const [activePaymentProject, setActivePaymentProject] = useState<ProjectTrack | null>(null);
  const [paymentCard, setPaymentCard] = useState({ number: '4111 2222 3333 4444', expiry: '12/28', cvc: '123' });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  // Support Ticket Form
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Development Support',
    priority: 'medium',
    message: ''
  });
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  // Floating Support Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'client' | 'agent'; text: string; timestamp: Date }[]>([
    { sender: 'agent', text: 'Hi! Let us help you scale. Looking to integrate next-gen React hubs, mobile workflows, or Gemini AI agents? Ask away!', timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);

  // Careers Submission State
  const [careerForm, setCareerForm] = useState({
    name: '',
    email: '',
    position: 'AI Workflow Specialist',
    experience: '3 Years',
    portfolioUrl: '',
    coverLetter: ''
  });
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [careerSuccess, setCareerSuccess] = useState(false);

  // Brand Contacts state
  const [contactForm, setContactForm] = useState({ name: '', email: '', budget: '$2,000 - $5,000', notes: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Fetch API state engines on initial load and intervals
  const fetchDashboardData = async () => {
    setLoadingStates({ projects: true, bookings: true, tickets: true });
    try {
      const [resProj, resBook, resTick] = await Promise.all([
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/bookings').then(r => r.json()),
        fetch('/api/tickets').then(r => r.json())
      ]);
      setUserProjects(resProj);
      setUserBookings(resBook);
      setUserTickets(resTick);
    } catch (err) {
      console.warn('Backend API connection offline, utilizing standard mock data stores.', err);
    } finally {
      setLoadingStates({ projects: false, bookings: false, tickets: false });
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(fetchDashboardData, 10000); // Poll state updates
    return () => clearInterval(timer);
  }, []);

  // Filter logic for services
  const filteredServices = SERVICES.filter(service => {
    // 1. Filter by category (Service Type)
    if (selectedCategory !== 'All' && service.category !== selectedCategory) {
      return false;
    }

    // 2. Filter by technology keywords
    if (selectedTech !== 'All') {
      const techLower = selectedTech.toLowerCase();
      const stringToSearch = `${service.title} ${service.description} ${service.details.join(' ')} ${service.features.join(' ')}`.toLowerCase();
      
      if (techLower === 'ai') {
        return stringToSearch.includes('ai') || stringToSearch.includes('gemini') || stringToSearch.includes('chatbot');
      }
      if (techLower === 'react') {
        return stringToSearch.includes('react') || stringToSearch.includes('next.js') || stringToSearch.includes('headless');
      }
      if (techLower === 'wordpress') {
        return stringToSearch.includes('wordpress') || stringToSearch.includes('cms');
      }
      if (techLower === 'android' || techLower === 'ios') {
        return stringToSearch.includes('android') || stringToSearch.includes('ios') || stringToSearch.includes('mobile') || stringToSearch.includes('flutter');
      }
      return stringToSearch.includes(techLower);
    }

    return true;
  });

  // Handle support ticket message send
  const handleSendTicketMessage = async (ticketId: string) => {
    const textStr = replyText[ticketId];
    if (!textStr || !textStr.trim()) return;

    try {
      const res = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'client', text: textStr })
      });
      const data = await res.json();
      if (data.success) {
        setReplyText(prev => ({ ...prev, [ticketId]: '' }));
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit appointment query form
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceObj = SERVICES.find(s => s.id === bookingForm.serviceId);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingForm,
          serviceName: serviceObj?.title || 'Custom Growth Support'
        })
      });
      if (res.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingSuccess(false);
          setIsBookingModalOpen(false);
          fetchDashboardData();
        }, 1800);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit client ticket creation
  const handleTicketCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketForm)
      });
      if (res.ok) {
        setIsTicketModalOpen(false);
        setTicketForm({ subject: '', category: 'Development Support', priority: 'medium', message: '' });
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Process visual payout sequence
  const executeProjectPayment = async () => {
    if (!activePaymentProject) return;
    setPaymentProcessing(true);
    setPaymentSuccessMsg('');
    try {
      const res = await fetch(`/api/projects/${activePaymentProject.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: activePaymentProject.amount,
          method: 'Visa Ending 4444'
        })
      });
      const data = await res.json();
      if (data.success) {
        setPaymentSuccessMsg(data.message);
        setTimeout(() => {
          setActivePaymentProject(null);
          setPaymentSuccessMsg('');
          fetchDashboardData();
        }, 2200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Chat interface dispatch toward Gemini server route
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsgText = chatInput;
    setChatInput('');

    const newMsgs = [...chatMessages, { sender: 'client' as const, text: userMsgText, timestamp: new Date() }];
    setChatMessages(newMsgs);
    setIsChatTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs,
          currentCategory: activeTab
        })
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, {
        sender: 'agent',
        text: data.text || 'Operational node returned empty response format.',
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error('Chat API Error:', err);
      setChatMessages(prev => [...prev, {
        sender: 'agent',
        text: 'The connection timed out. Shankar and Aman will solve internal routing parameters shortly. Let me know if you want basic plans parameters!',
        timestamp: new Date()
      }]);
    } finally {
      setIsChatTyping(false);
    }
  };

  // Admin Controls (Allows updating simulation states)
  const handleAdminUpdateStatus = async (projectId: string, field: 'status' | 'progress', val: any) => {
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: val })
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminApproveBooking = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    try {
      await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white font-sans overflow-x-hidden relative">
      
      {/* Dynamic Glowing Bubbles (Orbs of Glass background layout) */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[110px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none z-0"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Primary Top Header Navigation Bar */}
      <nav id="navbar" className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/40 border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div id="btn-logo" className="w-11 h-11 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-xl font-black italic tracking-wider">M</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight leading-none">Margdarshak</span>
                <span className="text-xs text-indigo-400 font-semibold uppercase tracking-widest mt-0.5">IT SOLUTIONS</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {(['home', 'services', 'portfolio', 'pricing', 'blog', 'career', 'contact'] as const).map((tab) => (
                <button
                  key={tab}
                  id={`nav-link-${tab}`}
                  onClick={() => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all uppercase tracking-wider ${
                    activeTab === tab 
                      ? 'text-white bg-white/10 shadow-sm border border-white/10' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab === 'home' ? 'Home' : tab === 'career' ? 'Career' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Desktop Quick Triggers: Dashboard & Scheduler Link */}
            <div className="hidden lg:flex items-center space-x-3">
              <button
                id="btn-nav-dashboard"
                onClick={() => { setActiveTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`flex items-center space-x-1.5 px-4   py-2 rounded-full text-xs font-bold transition-all border uppercase tracking-wider ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 border-transparent text-white'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-indigo-300'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Client Dashboard</span>
              </button>

              <button
                id="btn-nav-quote"
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-full border border-indigo-400/30 transition-all uppercase tracking-wider shadow-lg shadow-indigo-500/20"
              >
                Book Consultation
              </button>
              
              <button 
                id="btn-nav-admin"
                onClick={() => setActiveTab('admin')} 
                className={`p-2 rounded-full border text-xs font-bold transition-all ${activeTab === 'admin' ? 'bg-purple-600 text-white' : 'text-purple-400 border-purple-500/30 hover:bg-purple-500/10'}`}
                title="Simulation Admin Console"
              >
                Admin
              </button>
            </div>

            {/* Mobile hamburger menu toggle */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                id="btn-mob-admin"
                onClick={() => setActiveTab('admin')}
                className="p-1 px-2 border border-purple-500/20 rounded text-xs text-purple-400"
              >
                Admin
              </button>
              <button
                id="btn-mobile-hamburger"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div id="mobile-menu-drawer" className="lg:hidden backdrop-blur-xl bg-slate-900/95 border-b border-white/15 px-4 pt-4 pb-6 space-y-2 relative z-50">
            {(['home', 'services', 'portfolio', 'pricing', 'blog', 'career', 'contact', 'dashboard'] as const).map((tab) => (
              <button
                key={tab}
                id={`mob-nav-${tab}`}
                onClick={() => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left px-5 py-3 rounded-xl text-base font-bold transition-all flex items-center justify-between ${
                  activeTab === tab 
                    ? 'text-white bg-indigo-600/35 border border-indigo-500/30' 
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span className="capitalize">{tab === 'home' ? 'Home' : tab === 'career' ? 'Career Opening' : tab === 'dashboard' ? '🔒 Client Portal' : tab}</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            ))}
            <div className="pt-4 grid grid-cols-2 gap-3">
              <button
                id="btn-mob-book"
                onClick={() => { setMobileMenuOpen(false); setIsBookingModalOpen(true); }}
                className="w-full bg-indigo-600 px-4 py-3 rounded-full text-xs font-bold text-center border border-indigo-500/30 uppercase tracking-widest"
              >
                Book Now
              </button>
              <button
                id="btn-mob-close"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-slate-800 px-4 py-3 rounded-full text-xs font-bold text-center text-slate-300 uppercase tracking-widest"
              >
                Close Menu
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* ==================== PAGE: HOME ==================== */}
        {activeTab === 'home' && (
          <div id="page-home" className="space-y-24 animate-fadeIn">
            
            {/* HER0 GLASS PANEL */}
            <section id="hero-section" className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-bold text-indigo-300 uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-300" />
                    <span>Next-Gen Enterprise Solutions</span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-purple-300">
                    Empowering Growth with <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Intelligent IT Innovation
                    </span>
                  </h1>

                  <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                    Whether you are scale-matching premium web applications, native cross-platform smartphone software, technical local search matrix setups, or fine-tuned Gemini AI process assistants, Margdarshak IT Solutions drives complete technical architecture from blueprint to live production.
                  </p>

                  {/* Trusted Badges */}
                  <div className="flex flex-wrap items-center gap-6 pt-4">
                    <div className="flex -space-x-3">
                      <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center font-bold text-xs">AS</div>
                      <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-purple-600 flex items-center justify-center font-bold text-xs">PR</div>
                      <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center font-bold text-xs">NL</div>
                      <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-bold">+250</div>
                    </div>
                    <div className="text-sm text-slate-400">
                      <span className="text-white font-bold text-base block">250+ Successful Deployments</span>
                      <span>Serving startups & enterprise globally</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <button 
                      id="btn-hero-services"
                      onClick={() => setActiveTab('services')}
                      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all border border-indigo-400/30 shadow-lg shadow-indigo-500/20"
                    >
                      Explore Our Services
                    </button>
                    <button 
                      id="btn-hero-dashboard"
                      onClick={() => setActiveTab('dashboard')}
                      className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-bold transition-all text-white flex items-center gap-2"
                    >
                      <span>Launch Client Portal</span>
                      <ChevronRight className="w-4 h-4 text-indigo-400" />
                    </button>
                  </div>
                </div>

                {/* Hero Right Visual Glass Board */}
                <div className="lg:col-span-5 relative">
                  <div className="backdrop-blur-xl bg-white/5 border border-white/15 rounded-3xl p-6 shadow-3xl space-y-6 relative z-10">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">REALTIME OPERATIONS MATRIX</span>
                      </div>
                      <span className="text-xs text-indigo-400 font-bold">ACTIVE CLOUD RUN</span>
                    </div>

                    <div className="space-y-4">
                      {/* Interactive Milestone Indicator */}
                      <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-slate-300">Margdarshak QA Testing</span>
                          <span className="text-indigo-400 font-bold">100% Secure</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-full"></div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Standard Growth Plan</p>
                          <p className="text-2xl font-black text-indigo-300">$1,999</p>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] bg-indigo-600 rounded text-indigo-100 font-bold uppercase tracking-wider">Most Popular</span>
                      </div>

                      <div className="bg-slate-950/20 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">AI Agent Integrator</p>
                            <p className="text-[10px] text-slate-400">Server-side Gemini proxy online</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsChatOpen(true)}
                          className="px-3 py-1.5 bg-purple-600/30 text-[10px] hover:bg-purple-600/50 rounded-lg text-purple-200 uppercase font-bold tracking-wider"
                        >
                          Ping Bot
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Decorative element behind list */}
                  <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-purple-600/20 rounded-full blur-[60px] pointer-events-none"></div>
                </div>
              </div>
            </section>

            {/* QUICK LINK TECHNOLOGY HIGHLIGHTS */}
            <section className="text-center space-y-8">
              <div className="space-y-2">
                <h2 className="text-lg font-bold uppercase tracking-widest text-indigo-400">TECHNOLOGY DECK</h2>
                <p className="text-slate-400 text-sm max-w-xl mx-auto">We deploy state-of-the-art server and responsive layout environments ensuring ultra-low lag.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
                {['React.js', 'Next.js', 'Tailwind CSS', 'Node.js', 'MongoDB', 'Firebase', 'Gemini AI API', 'Shopify', 'WordPress', 'React Native', 'Flutter'].map(tech => (
                  <span key={tech} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-slate-300 hover:border-indigo-400/30 transition-all cursor-pointer">
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* SERVICES PREVIEW GRID */}
            <section className="space-y-12">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <div className="space-y-3">
                  <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Our Core Scope</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Custom Built Solutions Designed for Scale
                  </h2>
                </div>
                <button 
                  id="btn-all-services"
                  onClick={() => setActiveTab('services')}
                  className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold transition-all text-indigo-300 uppercase tracking-widest inline-flex items-center gap-1"
                >
                  <span>See Filtered Catalog</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SERVICES.slice(0, 3).map(service => {
                  const IconComp = iconMap[service.icon] || Globe;
                  return (
                    <div 
                      key={service.id} 
                      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 group"
                    >
                      <div>
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/30 transition-all">
                          <IconComp className="w-6 h-6 text-indigo-300" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">{service.description}</p>
                      </div>
                      <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                        <span className="text-xs text-indigo-400 font-bold uppercase">{service.category}</span>
                        <button 
                          onClick={() => {
                            setSelectedCategory(service.category);
                            setActiveTab('services');
                          }}
                          className="text-xs hover:text-white text-slate-400 font-bold inline-flex items-center gap-1"
                        >
                          <span>Explore Details</span>
                          <ChevronRight className="w-3 h-3 text-indigo-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* PORTFOLIO SNAPSHOT GALLERY */}
            <section className="space-y-12">
              <div className="text-center space-y-3">
                <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Case Studies</span>
                <h2 className="text-3xl font-extrabold tracking-tight">Recent Corporate Ventures</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {PROJECTS.slice(0, 2).map(project => (
                  <div key={project.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:border-white/20 transition-all group">
                    <div className="h-64 relative overflow-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur rounded text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                        {project.category}
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="px-2.5 py-1 bg-white/5 rounded text-[10px] font-bold text-slate-300">{tag}</span>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Client: <strong className="text-white">{project.client}</strong></span>
                        <button 
                          id={`btn-read-case-${project.id}`}
                          onClick={() => setActiveProjectModal(project)}
                          className="px-4 py-1.5 bg-indigo-500/20 text-xs font-bold text-indigo-300 rounded-full hover:bg-indigo-500/30 transition-all"
                        >
                          View Case Study
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* ==================== PAGE: SERVICES (WITH DYNAMIC FILTERING) ==================== */}
        {activeTab === 'services' && (
          <div id="page-services" className="space-y-12 animate-fadeIn">
            
            {/* Page Header text */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-bold text-indigo-300 uppercase tracking-widest">
                Our Capabilities
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight">Our Premium IT Services Catalog</h1>
              <p className="text-slate-400 text-base">
                Discover future-proof IT delivery matching enterprise performance standards. Use the dynamic filter tools below to filter our service catalogue by business types or technical frameworks instantly.
              </p>
            </div>

            {/* DYNAMIC SERVICE FILTER CONTROLS */}
            <div id="services-filter-box" className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              
              {/* Category selector (Service Types) */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">1. Filter By Service Category:</span>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Development', 'AI Services', 'Marketing', 'Creative'].map(cat => (
                    <button
                      key={cat}
                      id={`filter-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === cat 
                          ? 'bg-indigo-600 text-white shadow-md border border-indigo-400/40' 
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technology tag filter (Tech Stack) */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">2. Filter By Technology Framework:</span>
                <div className="flex flex-wrap gap-2">
                  {['All', 'React', 'WordPress', 'Android', 'iOS', 'AI'].map(tech => (
                    <button
                      key={tech}
                      id={`filter-tech-${tech.toLowerCase()}`}
                      onClick={() => setSelectedTech(tech)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedTech === tech 
                          ? 'bg-purple-600 text-white shadow-md border border-purple-400/40' 
                          : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status/Summary note */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/5 pt-4">
                <span>
                  Showing <strong className="text-white">{filteredServices.length}</strong> of <strong className="text-white">{SERVICES.length}</strong> premium offerings
                </span>
                {(selectedCategory !== 'All' || selectedTech !== 'All') && (
                  <button 
                    onClick={() => { setSelectedCategory('All'); setSelectedTech('All'); }}
                    className="text-indigo-400 hover:text-indigo-300 font-bold uppercase transition-all"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

            </div>

            {/* DYNAMIC FILTERED LIST RENDER */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredServices.length > 0 ? (
                filteredServices.map(service => {
                  const IconComp = iconMap[service.icon] || Globe;
                  return (
                    <div 
                      key={service.id}
                      id={`service-card-${service.id}`}
                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-white/20 transition-all duration-300 group"
                    >
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center">
                            <IconComp className="w-7 h-7 text-indigo-300" />
                          </div>
                          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                            {service.category}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold tracking-tight">{service.title}</h3>
                          <p className="text-slate-300 text-sm leading-relaxed">{service.description}</p>
                        </div>

                        {/* List items details */}
                        <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-white/5">
                          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Functional Elements:</p>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                            {service.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start space-x-1.5">
                                <span className="text-indigo-400 font-bold">✓</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                          {service.features.map(feat => (
                            <span key={feat} className="px-2 py-0.5 bg-indigo-400/10 text-indigo-300 border border-indigo-500/10 rounded text-[9px] font-bold uppercase">
                              {feat}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            setBookingForm(prev => ({ ...prev, serviceId: service.id }));
                            setIsBookingModalOpen(true);
                          }}
                          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-bold transition-all uppercase tracking-wider"
                        >
                          Book consultation
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-full backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-12 text-center space-y-4">
                  <AlertCircle className="w-12 h-12 text-purple-400 mx-auto" />
                  <h3 className="text-xl font-bold">No matching services found</h3>
                  <p className="text-slate-400 text-sm">No services matched category "{selectedCategory}" with tech tag "{selectedTech}". Try clearing the filters.</p>
                  <button 
                    onClick={() => { setSelectedCategory('All'); setSelectedTech('All'); }}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-slate-700 text-white rounded-full text-xs font-bold uppercase tracking-widest"
                  >
                    Reset Filter View
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================== PAGE: PORTFOLIO ==================== */}
        {activeTab === 'portfolio' && (
          <div id="page-portfolio" className="space-y-12 animate-fadeIn">
            
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-bold text-purple-300 uppercase tracking-widest">
                Our Proof
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight">Operational Masterpieces</h1>
              <p className="text-slate-400 text-base">Explore custom-engineered deployments resolving mission critical business vectors, complete with precise performance summaries.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PROJECTS.map(project => (
                <div key={project.id} className="backdrop-blur-xl bg-white/5 border border-white/15 rounded-3xl overflow-hidden shadow-xl hover:-translate-y-1 transition-all group">
                  <div className="h-56 relative overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur rounded text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                      {project.category}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold tracking-tight">{project.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-medium text-slate-300">{tag}</span>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Date: <strong className="text-white">{project.completionDate}</strong></span>
                      <button 
                        onClick={() => setActiveProjectModal(project)}
                        className="px-3.5 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/35 text-xs font-bold text-indigo-300 rounded-lg transition-all"
                      >
                        Read Cases
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================== PAGE: PRICING ==================== */}
        {activeTab === 'pricing' && (
          <div id="page-pricing" className="space-y-12 animate-fadeIn">
            
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-bold text-indigo-300 uppercase tracking-widest">
                Our Pricing
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight">Transparent Enterprise Packages</h1>
              <p className="text-slate-400 text-sm">Formulate structured IT allocations. Transparent scopes matching all sizes from startup concepts to distributed groups.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {PRICING_PLANS.map(plan => (
                <div 
                  key={plan.id}
                  className={`backdrop-blur-xl bg-white/5 rounded-3xl p-8 flex flex-col justify-between border relative ${
                    plan.popular 
                      ? 'border-indigo-500 shadow-indigo-500/10 shadow-2xl scale-102 lg:-translate-y-2' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-400/40 text-indigo-100 shadow-lg">
                      Recommended tier
                    </span>
                  )}
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold">{plan.name}</p>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-4xl font-black">{plan.price}</span>
                        <span className="text-xs text-slate-400">/ {plan.billing}</span>
                      </div>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed">{plan.description}</p>
                    
                    <div className="h-px bg-white/10" />

                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Features Included:</p>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-indigo-400 text-xs">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={() => {
                        setBookingForm(prev => ({ ...prev, notes: `Interested in selecting ${plan.name}. Please follow up for scheduling.` }));
                        setIsBookingModalOpen(true);
                      }}
                      className={`w-full py-3 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                        plan.popular 
                          ? 'bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/40 text-white shadow-lg' 
                          : 'bg-white/5 border border-white/10 hover:bg-white/10 text-indigo-300'
                      }`}
                    >
                      Select {plan.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* QUICK TESTIMONIAL SECTION */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto space-y-6">
              <p className="text-center italic text-slate-300 text-base leading-relaxed">
                "Margdarshak redesigned our entire e-commerce portal in React under 3 weeks. Their localized tracking panel allowed us to coordinate with Shankar and Nisha transparently. A spectacular, sub-second checkout speed resulted in instant client feedback!"
              </p>
              <div className="text-center">
                <p className="font-extrabold text-sm text-indigo-300">Devansh Sharma</p>
                <p className="text-xs text-slate-400">Head of Tech Operations, RetailNext Global</p>
              </div>
            </div>

          </div>
        )}

        {/* ==================== PAGE: BLOG ==================== */}
        {activeTab === 'blog' && (
          <div id="page-blog" className="space-y-12 animate-fadeIn">
            
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-bold text-indigo-300 uppercase tracking-widest">
                Our Blog
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight">Margdarshak Technical Digest</h1>
              <p className="text-slate-400 text-sm">Deep research documentation, guidelines, latency benchmarks, and operational optimizations published by our engineering leads.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {BLOGS.map(blog => (
                <div key={blog.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-white/20 transition-all group">
                  <div className="space-y-4">
                    <span className="px-3 py-1 bg-white/5 text-xs font-bold rounded text-indigo-300 uppercase tracking-wider">{blog.category}</span>
                    <h2 className="text-xl font-bold tracking-tight">{blog.title}</h2>
                    <p className="text-slate-300 text-sm leading-relaxed">{blog.excerpt}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={blog.author.avatar} alt={blog.author.name} className="w-8 h-8 rounded-full object-cover border border-white/15" />
                      <div>
                        <p className="text-xs font-extrabold text-white">{blog.author.name}</p>
                        <p className="text-[10px] text-slate-400">{blog.author.role}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveBlogModal(blog)}
                      className="px-4 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/35 text-xs text-indigo-300 font-bold rounded-lg transition-all"
                    >
                      Read full article
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================== PAGE: CAREER ==================== */}
        {activeTab === 'career' && (
          <div id="page-career" className="space-y-12 animate-fadeIn">
            
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-bold text-purple-300 uppercase tracking-widest">
                Join our Crew
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight">Digital Openings at Margdarshak</h1>
              <p className="text-slate-400 text-sm">We are on the hunt for high-velocity software engineers, machine learning engineers, and visual architects. Join our structured delivery operations!</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Positions List */}
              <div className="lg:col-span-6 space-y-4">
                <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Available Roles:</p>
                
                {[
                  { title: 'AI Workflow Integration Specialist', type: 'Full-time', loc: 'Hybrid (Remote + Mumbai)', salary: '$75k - $95k' },
                  { title: 'Lead Systems React/Next.js Engineer', type: 'Full-time', loc: 'On-site (Bangalore)', salary: '$80k - $110k' },
                  { title: 'SaaS Creative Brand Identity Designer', type: 'Contract', loc: 'Full Remote', salary: '$45/hr' }
                ].map((job, idx) => (
                  <div key={idx} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-extrabold text-white">{job.title}</h3>
                      <span className="px-2 py-0.5 bg-indigo-500/25 rounded text-[10px] font-bold text-indigo-200">{job.type}</span>
                    </div>
                    <p className="text-xs text-slate-400">📍 {job.loc} | Compensation: {job.salary}</p>
                    <div className="mt-3">
                      <button 
                        onClick={() => setCareerForm(prev => ({ ...prev, position: job.title }))}
                        className="text-xs text-indigo-300 hover:text-indigo-200 font-bold italic inline-flex items-center gap-1"
                      >
                        Apply for this position <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recruitment Mock Form with resume upload */}
              <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  Application Pipeline
                </h3>

                {careerSuccess ? (
                  <div className="p-6 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-center space-y-3">
                    <CheckCircle className="w-10 h-10 text-green-400 mx-auto" />
                    <h4 className="font-bold text-white">Application Recorded!</h4>
                    <p className="text-xs text-slate-300">Shankar and our development teams will assess your CV portfolio structure and follow up in 24 business hours.</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setCareerSuccess(true); }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Full Name</label>
                        <input 
                          type="text" 
                          required 
                          value={careerForm.name} 
                          onChange={e => setCareerForm({...careerForm, name: e.target.value})} 
                          className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-indigo-400 focus:outline-none" 
                          placeholder="Your Name" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Email ID</label>
                        <input 
                          type="email" 
                          required 
                          value={careerForm.email} 
                          onChange={e => setCareerForm({...careerForm, email: e.target.value})}
                          className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-indigo-400 focus:outline-none" 
                          placeholder="Email" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Position of Interest</label>
                      <select 
                        value={careerForm.position} 
                        onChange={e => setCareerForm({...careerForm, position: e.target.value})}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-indigo-400 focus:outline-none"
                      >
                        <option>AI Workflow Specialist</option>
                        <option>Lead Systems React/Next.js Engineer</option>
                        <option>SaaS Creative Brand Identity Designer</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Resume File Upload</label>
                      
                      {/* Flex touch area matching manual & drag actions */}
                      <div className="border border-dashed border-white/20 rounded-xl p-4 bg-slate-950/40 hover:bg-slate-950/70 transition-all text-center">
                        <input 
                          type="file" 
                          id="resume-file" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files) setUploadedResume(e.target.files[0]);
                          }} 
                        />
                        <label htmlFor="resume-file" className="cursor-pointer block space-y-1">
                          <span className="text-xs text-indigo-400 hover:underline font-bold block">
                            {uploadedResume ? uploadedResume.name : 'Choose File / Drop PDF here'}
                          </span>
                          <span className="text-[10px] text-slate-400 block">Accepted formats: PDF, DOCX (Max 8MB)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Brief Description / Cover Letter</label>
                      <textarea 
                        rows={3} 
                        value={careerForm.coverLetter} 
                        onChange={e => setCareerForm({...careerForm, coverLetter: e.target.value})}
                        className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-indigo-400 focus:outline-none" 
                        placeholder="Detail your highlights in React, Gemini, or Figma..."
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
                    >
                      Submit Application
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ==================== PAGE: CONTACT ==================== */}
        {activeTab === 'contact' && (
          <div id="page-contact" className="space-y-12 animate-fadeIn font-sans">
            
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-bold text-indigo-300 uppercase tracking-widest">
                Contact Us
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight">Start Your Transformation</h1>
              <p className="text-slate-400 text-sm">Have an ambitious project idea, custom SDK integration, or database RAG chatbot concept? Push queries to our team.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Contact Information & Map placeholder */}
              <div className="lg:col-span-5 space-y-6">
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                  <h3 className="text-base font-extrabold uppercase tracking-widest text-indigo-400">Headquarters</h3>
                  
                  <div className="space-y-4 text-xs text-slate-300">
                    <p className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />
                      <span>702 Spectrum Tech Towers, Bandra Kurla Complex, Mumbai, India</span>
                    </p>
                    <p className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
                      <span>+91 22 5557 2673</span>
                    </p>
                    <p className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
                      <span>ashisher579@gmail.com</span>
                    </p>
                  </div>

                  {/* Google maps placeholder illustration */}
                  <div className="h-44 bg-slate-900 border border-white/10 rounded-2xl relative overflow-hidden flex items-center justify-center text-center">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl"></div>
                    <div className="space-y-1 relative z-10 p-4">
                      <p className="text-xs text-white font-black uppercase">MAP EMBED PREVIEW</p>
                      <p className="text-[10px] text-slate-400">Spectrum Tech Towers, BKC, Mumbai</p>
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping mx-auto mt-2"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation Input Form */}
              <div className="lg:col-span-7 backdrop-blur-xl bg-white/5 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6">
                <h3 className="text-lg font-black text-white">Share Your Requirements</h3>
                
                {contactSuccess ? (
                  <div className="p-8 bg-green-950/30 border border-green-500/20 text-center rounded-2xl space-y-3">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                    <h4 className="font-bold text-white">Requirements Forwarded!</h4>
                    <p className="text-xs text-slate-300">Shankar Sharma and technical directors are processing the specifications. Check your email or try logging into the Client dashboard!</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setContactSuccess(true); }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Company / Name</label>
                        <input 
                          type="text" 
                          required 
                          value={contactForm.name} 
                          onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-400 focus:outline-none" 
                          placeholder="Your Name" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Business Email</label>
                        <input 
                          type="email" 
                          required 
                          value={contactForm.email} 
                          onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-400 focus:outline-none" 
                          placeholder="email@company.com" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Project Budget Scale (Estimated)</label>
                      <select 
                        value={contactForm.budget} 
                        onChange={e => setContactForm({ ...contactForm, budget: e.target.value })}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-400 focus:outline-none"
                      >
                        <option>$799 - $1,999 (Basic / Single Solution)</option>
                        <option>$2,000 - $5,000 (Standard Corporate Growth)</option>
                        <option>$5k - $15K+ (Enterprise Matrix Architecture)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Project Details / Message</label>
                      <textarea 
                        rows={4} 
                        required 
                        value={contactForm.notes} 
                        onChange={e => setContactForm({ ...contactForm, notes: e.target.value })}
                        className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-400 focus:outline-none" 
                        placeholder="Detail your goals (e.g. Next.js backend, mobile Flutter app or AI-assistant chatbot)..."
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-md"
                    >
                      Dispatch Requirements File
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ==================== PAGE: CLIENT DASHBOARD ==================== */}
        {activeTab === 'dashboard' && (
          <div id="page-dashboard" className="space-y-8 animate-fadeIn">
            
            {/* Header / Client Greetings info */}
            <div className="backdrop-blur-xl bg-indigo-950/20 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="inline-flex space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-bold text-green-300 uppercase tracking-widest mb-1">
                  🔒 Secure Client Portal
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">Welcome, Ashish</h1>
                <p className="text-xs text-indigo-300">Registered Account: <strong className="text-white">ashisher579@gmail.com</strong></p>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={fetchDashboardData}
                  className="p-2.5 bg-slate-950/40 border border-white/10 rounded-xl hover:bg-slate-950 transition-all text-indigo-300 flex items-center gap-1 text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Sync Server</span>
                </button>
                <button
                  onClick={() => setIsTicketModalOpen(true)}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider"
                >
                  Create Support Ticket
                </button>
              </div>
            </div>

            {/* TWO COLUMN GRID: PROJECTS & BOOKINGS / TICKETS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Projects monitoring (Project Tracking System) */}
              <div className="lg:col-span-7 space-y-6">
                <h3 className="text-base font-black uppercase tracking-widest text-indigo-400">Project Tracking System</h3>
                
                {userProjects.length > 0 ? (
                  userProjects.map(proj => (
                    <div key={proj.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                      
                      {/* Name & Progress bar view */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-extrabold text-white">{proj.name}</h4>
                            <p className="text-[10px] text-slate-400">Launch Timeline: {proj.startDate} to {proj.targetDate}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                            proj.status === 'Completed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}>
                            {proj.status}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-300">
                            <span>Milestone Complete Velocity</span>
                            <span className="font-bold">{proj.progress}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500" style={{ width: `${proj.progress}%` }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Milestones Checklist list layout */}
                      <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-white/5">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Milestones Checklist</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {proj.milestones.map((ms, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded bg-white/5">
                              <span className="text-slate-300">{ms.title}</span>
                              <span className={ms.completed ? 'text-green-400 font-bold' : 'text-orange-400 font-bold'}>
                                {ms.completed ? '✓' : 'Pending'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Invoices & actions */}
                      <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">Invoice: <strong className="text-white">${proj.amount}</strong></span>
                          {proj.paymentStatus === 'paid' ? (
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-300 border border-green-500/20 rounded">Paid</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-orange-500/10 text-orange-300 border border-orange-500/20 rounded">Unpaid</span>
                          )}
                        </div>
                        {proj.paymentStatus !== 'paid' && (
                          <button 
                            id={`btn-pay-project-${proj.id}`}
                            onClick={() => setActivePaymentProject(proj)}
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all text-xs"
                          >
                            Pay Invoice
                          </button>
                        )}
                      </div>

                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No active tracking structures resolved inside account.</p>
                )}
              </div>

              {/* Right panel: Bookings & Active Support Tickets */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Bookings panel */}
                <div className="space-y-4">
                  <h3 className="text-base font-black uppercase tracking-widest text-slate-400">Consultations Scheduler</h3>
                  
                  {userBookings.length > 0 ? (
                    userBookings.map(b => (
                      <div key={b.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white">{b.serviceName}</p>
                          <p className="text-[10px] text-slate-400">📅 {b.date} | Time Slot: {b.time}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.status === 'confirmed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-orange-500/20 text-orange-300'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-400">No appointments scheduled.</p>
                  )}
                </div>

                {/* Support Tickets feed */}
                <div className="space-y-4">
                  <h3 className="text-base font-black uppercase tracking-widest text-slate-400">Resolving Support Tickets</h3>

                  {userTickets.map(ticket => (
                    <div key={ticket.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] text-indigo-400 font-bold uppercase">{ticket.category}</span>
                          <h4 className="text-xs font-bold text-white">{ticket.subject}</h4>
                        </div>
                        <span className="px-2 py-0.5 bg-purple-500/25 rounded text-[9px] font-bold uppercase">{ticket.status}</span>
                      </div>

                      {/* Chat thread display */}
                      <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-slate-950/40 rounded-lg">
                        {ticket.messages.map((m, mIdx) => (
                          <div key={mIdx} className={`text-[11px] p-2 rounded-xl text-xs max-w-[85%] ${
                            m.sender === 'client' ? 'bg-indigo-600/30 text-white ml-auto' : 'bg-white/10 text-slate-200'
                          }`}>
                            <p>{m.text}</p>
                            <span className="text-[9px] text-slate-400 block text-right mt-1">
                              {m.sender === 'client' ? 'You' : 'Margdarshak AI'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Ticket sending input */}
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={replyText[ticket.id] || ''} 
                          onChange={e => setReplyText({ ...replyText, [ticket.id]: e.target.value })}
                          placeholder="Type customer ticket dispatch..." 
                          className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-400 text-white" 
                        />
                        <button 
                          onClick={() => handleSendTicketMessage(ticket.id)}
                          className="p-1.5 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ==================== PAGE: ABOUT US ==================== */}
        {activeTab === 'about' && (
          <div id="page-about" className="space-y-16 animate-fadeIn">
            
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs font-bold text-indigo-300 uppercase tracking-widest">
                Our Genesis
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight">The Team behind Margdarshak</h1>
              <p className="text-slate-400 text-sm">We orchestrate clean digital strategies, robust server pipelines, and intelligent AI frameworks.</p>
            </div>

            {/* Interactive Timeline elements */}
            <section className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 max-w-4xl mx-auto">
              <h3 className="text-xl font-extrabold text-indigo-300 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-300" />
                Evolution History
              </h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="text-indigo-400 font-extrabold text-base min-w-[70px]">2012</div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Inception</strong>: First corporate setups formulated in Mumbai by Shankar Sharma, delivering responsive browser nodes.
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-indigo-400 font-extrabold text-base min-w-[70px]">2020</div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">React & Next.js Onboarding</strong>: Nisha Patil leads web development workflows, launching custom Shopify and corporate checkouts.
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-purple-400 font-extrabold text-base min-w-[70px]">2025</div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">AI Revolution Suite</strong>: Aman Roy joins, designing fine-tuned LLM grounding tools via Gemini API.
                  </div>
                </div>
              </div>
            </section>

            {/* Profiles grid view */}
            <section className="space-y-8">
              <h3 className="text-xl font-bold text-center uppercase tracking-widest">Leadership Crew</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TEAM.map(member => (
                  <div key={member.name} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 text-center space-y-4 hover:border-white/25 transition-all">
                    <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-indigo-400/30" />
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-white text-base leading-none">{member.name}</h4>
                      <p className="text-xs text-indigo-400 font-bold">{member.role}</p>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed h-16 overflow-y-auto">{member.bio}</p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {member.specialty.map(spec => (
                        <span key={spec} className="px-2 py-0.5 bg-indigo-500/10 text-[9px] font-bold text-indigo-300 rounded uppercase">{spec}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}

        {/* ==================== PAGE: SIMULATION ADMIN PANEL ==================== */}
        {activeTab === 'admin' && (
          <div id="page-admin-panel" className="space-y-8 animate-fadeIn">
            
            <div className="p-6 bg-purple-950/20 border border-purple-500/20 rounded-3xl space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <Building className="w-8 h-8 text-purple-400" />
                Margdarshak Sandbox Operations
              </h1>
              <p className="text-xs text-slate-300">
                You are currently in developer simulation mode. Use these controls to manipulate active DB parameters, approve candidate bookings, simulate client progress updates, or debug tickets.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Project monitoring controls */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-base font-black uppercase tracking-widest text-slate-400">Admin Project Matrix</h3>

                {userProjects.map(p => (
                  <div key={p.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <strong className="text-white text-sm">{p.name}</strong>
                      <span className="text-[10px] text-indigo-300">Invoice Sum: ${p.amount}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold mb-1">Update Client Status</label>
                        <select 
                          value={p.status} 
                          onChange={e => handleAdminUpdateStatus(p.id, 'status', e.target.value)}
                          className="w-full bg-slate-950 text-white rounded px-2.5 py-1.5 text-xs focus:outline-none"
                        >
                          <option>In Planning</option>
                          <option>Design Phase</option>
                          <option>Development</option>
                          <option>Testing</option>
                          <option>Completed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold mb-1">Set Progress Bar %</label>
                        <input 
                          type="number"
                          value={p.progress}
                          onChange={e => handleAdminUpdateStatus(p.id, 'progress', e.target.value)}
                          className="w-full bg-slate-950 text-white rounded px-2.5 py-1.5 text-xs focus:outline-none" 
                          min={0} max={100} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bookings approval monitoring */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-base font-black uppercase tracking-widest text-slate-400">Admin Consultations Deck</h3>

                {userBookings.map(b => (
                  <div key={b.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white leading-none">{b.name}</p>
                        <p className="text-[10px] text-slate-400">{b.email}</p>
                      </div>
                      <span className="text-[9px] text-indigo-300 font-bold uppercase">{b.serviceName}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <span className="text-[10px] text-slate-400">{b.date} at {b.time}</span>
                      <div className="flex gap-2">
                        {b.status === 'pending' ? (
                          <>
                            <button 
                              onClick={() => handleAdminApproveBooking(b.id, 'confirmed')}
                              className="px-2.5 py-1 bg-green-500/20 text-green-300 hover:bg-green-500/40 rounded text-[10px] font-bold uppercase transition-all"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleAdminApproveBooking(b.id, 'cancelled')}
                              className="px-2.5 py-1 bg-red-500/20 text-red-300 hover:bg-red-500/40 rounded text-[10px] font-bold uppercase transition-all"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-indigo-400 font-extrabold uppercase">Resolved ({b.status})</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="mt-20 border-t border-white/10 backdrop-blur-md bg-slate-950/40 py-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold">M</div>
            <p className="text-xs text-slate-400">© 2026 Margdarshak IT Solutions, BKC, Mumbai. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            {['Facebook', 'Twitter', 'LinkedIn', 'Github'].map(plat => (
              <span key={plat} className="text-xs text-slate-400 hover:text-white cursor-pointer transition-all">{plat}</span>
            ))}
          </div>
        </div>
      </footer>

      {/* ==================== COMPONENT: WHATSAPP FLOAT BUTTON ==================== */}
      <button 
        id="btn-whatsapp-float"
        onClick={() => {
          // Open standard mock modal or action without window.open restrictions
          setIsChatOpen(true);
          setChatMessages(prev => [...prev, {
            sender: 'agent',
            text: 'Redirecting you to our digital operations help desk... Ask anything here!',
            timestamp: new Date()
          }]);
        }}
        className="fixed bottom-6 left-6 z-40 bg-green-600 hover:bg-green-500 p-3.5 rounded-full shadow-2xl border border-white/20 flex items-center justify-center cursor-pointer transition-all hover:scale-105"
        title="Connect via WhatsApp"
      >
        <span className="text-xs font-bold px-2 text-white">Chat on WhatsApp</span>
        <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></div>
      </button>

      {/* ==================== COMPONENT: AI CHAT SUPPORT PANEL ==================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* Support bubble trigger with animated rings */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-500 rounded-full blur opacity-75 animate-pulse"></div>
          <button
            id="btn-support-chat-toggle"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="relative bg-indigo-600 p-4 rounded-full shadow-2xl border border-white/20 text-white flex items-center justify-center hover:bg-indigo-500 transition-all cursor-pointer"
          >
            {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-bounce" />}
          </button>
        </div>

        {/* Chat Drawer */}
        {isChatOpen && (
          <div id="ai-chat-drawer" className="mt-4 w-80 sm:w-96 h-[450px] rounded-3xl backdrop-blur-xl bg-slate-900/90 border border-white/10 shadow-3xl overflow-hidden flex flex-col z-50">
            
            {/* Header info */}
            <div className="p-4 bg-indigo-600/20 border-b border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-indigo-300 uppercase tracking-widest leading-none">Margdarshak AI Desk</p>
                <p className="text-[10px] text-slate-400">Powered by Gemini AI (Server-Grounded)</p>
              </div>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            </div>

            {/* Chat list viewport */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`p-3 rounded-2xl text-xs max-w-[85%] ${
                  m.sender === 'client' 
                    ? 'bg-indigo-600 text-white ml-auto rounded-tr-none' 
                    : 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                </div>
              ))}
              {isChatTyping && (
                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none text-xs text-slate-400 max-w-[50%] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                </div>
              )}
            </div>

            {/* Input triggers */}
            <div className="p-3 border-t border-white/10 flex gap-2">
              <input
                type="text"
                id="support-chat-input"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendChatMessage(); }}
                placeholder="Ask about pricing plans or custom react hubs..."
                className="flex-1 bg-slate-950 border border-white/15 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-400 text-white"
              />
              <button
                id="btn-send-support-chat"
                onClick={handleSendChatMessage}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ==================== MODAL: PROJECT DETAILS PORTFOLIO ==================== */}
      {activeProjectModal && (
        <div id="project-details-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/80">
          <div className="backdrop-blur-xl bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative animate-fadeIn">
            
            <button 
              id="btn-close-project-modal"
              onClick={() => setActiveProjectModal(null)} 
              className="absolute top-4 right-4 p-1.5 bg-white/5 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="space-y-4">
              <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded text-xs font-bold text-indigo-300 uppercase">
                {activeProjectModal.category}
              </span>
              <h3 className="text-2xl font-black text-white">{activeProjectModal.title}</h3>
              <p className="text-xs text-slate-400">Completed in {activeProjectModal.completionDate}</p>
            </div>

            <img src={activeProjectModal.image} alt={activeProjectModal.title} className="w-full h-44 object-cover rounded-xl" />

            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeProjectModal.longDescription || activeProjectModal.description}</p>
              
              <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-2">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest text-indigo-400">Achievements Metric Summary:</p>
                <ul className="space-y-1 text-xs text-slate-300">
                  {activeProjectModal.results.map((r, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-indigo-400">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================== MODAL: BLOG VIEWER ==================== */}
      {activeBlogModal && (
        <div id="blog-viewer-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/80">
          <div className="backdrop-blur-xl bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto relative animate-fadeIn">
            <button 
              id="btn-close-blog-modal"
              onClick={() => setActiveBlogModal(null)} 
              className="absolute top-4 right-4 p-1.5 bg-white/5 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="space-y-3">
              <span className="text-[10px] bg-indigo-500/25 px-2.5 py-1 text-indigo-200 rounded uppercase font-bold">{activeBlogModal.category}</span>
              <h3 className="text-2xl font-black text-white">{activeBlogModal.title}</h3>
              <p className="text-[10px] text-slate-400">Published by {activeBlogModal.author.name} on {activeBlogModal.date} | {activeBlogModal.readTime}</p>
            </div>

            <div className="text-xs text-slate-300 space-y-4 leading-relaxed font-sans whitespace-pre-line border-t border-white/10 pt-4">
              {activeBlogModal.content}
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: APPOINTMENT CONSULTATIONS SCHEDULER ==================== */}
      {isBookingModalOpen && (
        <div id="scheduler-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/80">
          <div className="backdrop-blur-xl bg-slate-900 border border-white/15 rounded-3xl max-w-md w-full p-6 relative animate-fadeIn">
            
            <button 
              id="btn-close-scheduler-modal"
              onClick={() => setIsBookingModalOpen(false)} 
              className="absolute top-4 right-4 p-1 bg-white/5 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Schedule Consultations Slot
            </h3>

            {bookingSuccess ? (
              <div className="p-6 bg-green-950/20 border border-green-500/20 rounded-2xl text-center space-y-2">
                <Check className="w-10 h-10 text-green-400 mx-auto" />
                <h4 className="font-bold text-white">Consultation Requested!</h4>
                <p className="text-xs text-slate-300">Shankar and Nisha Patil have registered your target hour slot. We will update the status inside client portal.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-black">Associated Service Category</label>
                  <select 
                    value={bookingForm.serviceId} 
                    onChange={e => setBookingForm({ ...bookingForm, serviceId: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    {SERVICES.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black">Reserved Date</label>
                    <input 
                      type="date" 
                      required 
                      value={bookingForm.date} 
                      onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black">Preferred Slot Hour Time</label>
                    <input 
                      type="text" 
                      required 
                      value={bookingForm.time} 
                      onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })}
                      placeholder="14:30"
                      className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-black">Consultation Notes</label>
                  <textarea 
                    rows={3} 
                    value={bookingForm.notes} 
                    onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none" 
                    placeholder="Describe your technical scope challenges..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Confirm Scheduled Reservation
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ==================== MODAL: CREATE SUPPORT TICKET ==================== */}
      {isTicketModalOpen && (
        <div id="ticket-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/80">
          <div className="backdrop-blur-xl bg-slate-900 border border-white/15 rounded-3xl max-w-md w-full p-6 relative animate-fadeIn">
            
            <button 
              id="btn-close-ticket-modal"
              onClick={() => setIsTicketModalOpen(false)} 
              className="absolute top-4 right-4 p-1 bg-white/5 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              File Corporate Support Ticket
            </h3>

            <form onSubmit={handleTicketCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-black">Subject Heading</label>
                <input 
                  type="text" 
                  required 
                  value={ticketForm.subject} 
                  onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="e.g. Firebase SDK Auth failure in console"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-400 text-white" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-black">Category Type</label>
                  <select 
                    value={ticketForm.category} 
                    onChange={e => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-2 py-1.5 text-xs focus:outline-none"
                  >
                    <option>Development Support</option>
                    <option>Billing / Invoice Ledger</option>
                    <option>Digital Strategy Consultation</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-black">Priority Tier</label>
                  <select 
                    value={ticketForm.priority} 
                    onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-2 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (!)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-black">Detailed Operational Message</label>
                <textarea 
                  rows={4} 
                  required
                  value={ticketForm.message} 
                  onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })}
                  placeholder="Detail the error lines or API failures. Margdarshak AI will evaluate instantly on server logs."
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-white" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 bg-indigo-600 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all"
              >
                Submit Incident Ticket
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ==================== MODAL: OUTSIDE PAYMENTS MOCK INVOICER TOOL ==================== */}
      {activePaymentProject && (
        <div id="payment-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/80">
          <div className="backdrop-blur-xl bg-slate-900 border border-white/15 rounded-3xl max-w-sm w-full p-6 relative animate-fadeIn">
            
            <button 
              id="btn-close-payment-modal"
              onClick={() => setActivePaymentProject(null)} 
              className="absolute top-4 right-4 p-1 bg-white/5 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              Secure Payout Terminal
            </h3>

            <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 mb-4 text-xs space-y-1.5">
              <p className="text-slate-400 uppercase">Settling Bill For:</p>
              <p className="font-extrabold text-white">{activePaymentProject.name}</p>
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-slate-400">Onboarding Sum:</span>
                <span className="text-base font-black text-indigo-300">${activePaymentProject.amount}</span>
              </div>
            </div>

            {paymentSuccessMsg ? (
              <div className="p-4 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto" />
                <p className="text-xs text-white uppercase font-bold">Transaction Confirmed</p>
                <p className="text-[10px] text-slate-300">{paymentSuccessMsg}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Card Number (Mock Integration)</label>
                  <input 
                    type="text" 
                    value={paymentCard.number} 
                    onChange={e => setPaymentCard({ ...paymentCard, number: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-400">Expiry (MM/YY)</label>
                    <input 
                      type="text" 
                      value={paymentCard.expiry} 
                      onChange={e => setPaymentCard({ ...paymentCard, expiry: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-400">CVC CVV</label>
                    <input 
                      type="text" 
                      value={paymentCard.cvc} 
                      onChange={e => setPaymentCard({ ...paymentCard, cvc: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none" 
                    />
                  </div>
                </div>

                <button 
                  onClick={executeProjectPayment}
                  disabled={paymentProcessing}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                >
                  {paymentProcessing ? 'Authorizing Sandbox ledger...' : `Pay Invoice $${activePaymentProject.amount}`}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
