import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory data persistence
let projects = [
  {
    id: 'proj-1',
    name: 'E-Commerce Platform Rebuild',
    clientName: 'Ashish (ashisher579@gmail.com)',
    status: 'Development',
    progress: 75,
    startDate: '2026-05-10',
    targetDate: '2026-07-15',
    milestones: [
      { id: 'm1', title: 'UX Research & Wireframing', completed: true, date: '2026-05-18' },
      { id: 'm2', title: 'Database Schema Design', completed: true, date: '2026-05-25' },
      { id: 'm3', title: 'Core Payment & Checkout APIs', completed: false, date: '2026-06-20' },
      { id: 'm4', title: 'Client Feedback Integration', completed: false, date: '2026-07-01' }
    ],
    paymentStatus: 'partial',
    amount: 1999
  },
  {
    id: 'proj-2',
    name: 'AI Agent Call Assistant',
    clientName: 'Ashish (ashisher579@gmail.com)',
    status: 'Completed',
    progress: 100,
    startDate: '2026-04-01',
    targetDate: '2026-05-15',
    milestones: [
      { id: 'm5', title: 'LLM Fine-Tuning Sandbox', completed: true, date: '2026-04-10' },
      { id: 'm6', title: 'WhatsApp Webhook Integrations', completed: true, date: '2026-04-28' },
      { id: 'm7', title: 'Live Admin Control Panel', completed: true, date: '2026-05-12' }
    ],
    paymentStatus: 'paid',
    amount: 1299
  }
];

let bookings = [
  {
    id: 'book-1',
    name: 'Ashish Roy',
    email: 'ashisher579@gmail.com',
    phone: '+1 415 555 2673',
    serviceId: 'ai-agents',
    serviceName: 'AI Agent & Automation',
    date: '2026-06-18',
    time: '14:30',
    notes: 'Looking to set up a custom RAG agent for customer service sync.',
    status: 'confirmed',
    createdAt: '2026-06-11T14:45:00Z'
  }
];

let tickets = [
  {
    id: 'tick-101',
    subject: 'Stripe API Authentication Token Failure',
    category: 'Development Support',
    priority: 'high',
    status: 'open',
    createdAt: '2026-06-11T10:30:10-07:00',
    messages: [
      {
        sender: 'client',
        text: 'Hello Team, when checking out in the sandbox environment, I keep seeing a token authentication failure. Please advise.',
        timestamp: '2026-06-11T10:30:10-07:00'
      },
      {
        sender: 'agent',
        text: 'Hi Ashish, the technical team has identified the sandbox endpoint has changed, we are updating the environment parameters. Could you test again in 5 minutes?',
        timestamp: '2026-06-11T10:45:00-07:00'
      }
    ]
  }
];

// Lazy Gemini helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey !== '') {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
      console.log('Gemini client initialized with API key.');
    } else {
      console.warn('GEMINI_API_KEY environment variable is not configured. Running AI in fallback mock mode.');
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';
  const port = 3000;

  app.use(express.json());

  // Log API requests
  app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
  });

  // Client Dashboard REST APIs
  app.get('/api/projects', (req, res) => {
    res.json(projects);
  });

  app.put('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const { status, progress, milestones, paymentStatus } = req.body;
    
    projects = projects.map(proj => {
      if (proj.id === id) {
        return {
          ...proj,
          status: status !== undefined ? status : proj.status,
          progress: progress !== undefined ? Number(progress) : proj.progress,
          milestones: milestones !== undefined ? milestones : proj.milestones,
          paymentStatus: paymentStatus !== undefined ? paymentStatus : proj.paymentStatus
        };
      }
      return proj;
    });

    const updated = projects.find(p => p.id === id);
    res.json({ success: true, project: updated });
  });

  // Simulated Payment Integration
  app.post('/api/projects/:id/pay', (req, res) => {
    const { id } = req.params;
    const { amount, method } = req.body;

    let targetProject = projects.find(p => p.id === id);
    if (!targetProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    projects = projects.map(p => {
      if (p.id === id) {
        return { ...p, paymentStatus: 'paid' };
      }
      return p;
    });

    res.json({
      success: true,
      transactionId: 'TXN-' + Math.floor(Math.random() * 10000000),
      message: `Successfully processed mock payment of $${amount} via ${method || 'Card'}.`,
      project: projects.find(p => p.id === id)
    });
  });

  // Appointment Bookings
  app.get('/api/bookings', (req, res) => {
    res.json(bookings);
  });

  app.post('/api/bookings', (req, res) => {
    const { name, email, phone, serviceId, serviceName, date, time, notes } = req.body;
    if (!name || !email || !serviceId) {
      return res.status(400).json({ error: 'Name, Email, and Service are required' });
    }

    const newBooking = {
      id: 'book-' + Math.floor(Math.random() * 10000),
      name,
      email,
      phone: phone || '',
      serviceId,
      serviceName: serviceName || 'Consultation Support',
      date: date || '2026-06-15',
      time: time || '10:00',
      notes: notes || '',
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    res.json({ success: true, booking: newBooking });
  });

  app.put('/api/bookings/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'confirmed' | 'cancelled' | 'pending'
    
    bookings = bookings.map(b => {
      if (b.id === id) {
        return { ...b, status };
      }
      return b;
    });

    res.json({ success: true, booking: bookings.find(b => b.id === id) });
  });

  // Support Tickets
  app.get('/api/tickets', (req, res) => {
    res.json(tickets);
  });

  app.post('/api/tickets', (req, res) => {
    const { subject, category, priority, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    const newTicket = {
      id: 'tick-' + Math.floor(Math.random() * 1000),
      subject,
      category: category || 'General Questions',
      priority: priority || 'medium',
      status: 'open' as const,
      createdAt: new Date().toISOString(),
      messages: [
        {
          sender: 'client' as const,
          text: message,
          timestamp: new Date().toISOString()
        }
      ]
    };

    tickets.push(newTicket);
    res.json({ success: true, ticket: newTicket });
  });

  // Reply to support tickets (supports both user and support agent simulation)
  app.post('/api/tickets/:id/messages', async (req, res) => {
    const { id } = req.params;
    const { sender, text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const ticket = tickets.find(t => t.id === id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const newMessage = {
      sender: sender || 'client',
      text,
      timestamp: new Date().toISOString()
    };

    ticket.messages.push(newMessage);

    // If client sent the message, let the Support AI try to generate a helpful response!
    if (sender === 'client') {
      try {
        const client = getGeminiClient();
        let aiReply = "Thank you! Our technical operators will evaluate your ticket shortly and follow up.";
        
        if (client) {
          const systemContext = `You are "Margdarshak AI Customer Support Officer", the intelligent operations manager.
The user is contacting us regarding: ${ticket.subject} (Category: ${ticket.category}).
The conversation history:
${ticket.messages.map(m => `- ${m.sender === 'client' ? 'Client' : 'Agent'}: "${m.text}"`).join('\n')}

Based on this dialogue, provide a professional, empathetic, and technically descriptive response. Keep it clear, concise, and reassure them with actionable ideas. Inform them that the engineering lead Shankar Sharma or developer Nisha Patil will verify the patch shortly.`;

          const completion = await client.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: 'Draft the support team response.' + text,
            config: { systemInstruction: systemContext }
          });
          if (completion?.text) {
            aiReply = completion.text;
          }
        } else {
          // Mock friendly automated responses
          if (text.toLowerCase().includes('payment') || text.toLowerCase().includes('stripe')) {
            aiReply = "Hello! For payment or Stripe sandbox issues, please make sure you are clicking the 'Instant Settlement Payout' button on your billing detail panel. If the token fails, our billing server coordinates standard ACH settlements.शंकर शर्मा is reviewing your ledger profile.";
          } else {
            aiReply = "Welcome to Margdarshak Support. This message has been logged. Our developers (Nisha and Aman) have been dispatched. We will update this chat feed in real-time within 5-10 minutes with debug notes.";
          }
        }

        // Add support reply
        const agentMessage = {
          sender: 'agent' as const,
          text: aiReply,
          timestamp: new Date().toISOString()
        };
        ticket.messages.push(agentMessage);
        ticket.status = 'open'; // Keep open
      } catch (err) {
        console.error('Gemini Ticket Reply Error:', err);
      }
    }

    res.json({ success: true, ticket });
  });

  // AI Assistant customer support chatbot endpoint
  app.post('/api/chat', async (req, res) => {
    const { messages, currentCategory } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Valid messages array is required.' });
    }

    const lastMessage = messages[messages.length - 1]?.text || 'Hello';
    const client = getGeminiClient();

    const systemInstruction = `You are "Margdarshak AI Solutions Assistant", a prestigious IT consulting robot.
You represent Margdarshak IT Solutions, an elite corporate IT delivery powerhouse led by Shankar Sharma (Managing Director), Nisha Patil (Systems Lead), Aman Roy (AI Expert), and Pooja Nair (Creative Director).

Our Premium Services list to consult from:
1. Website Development: React.js, Next.js, Headless CMS, WordPress. (Lighthouse scores >90)
2. Mobile App Development: Native Swift, Native Kotlin, Flutter, React Native.
3. AI Agent Development: Gemini API integrations, Vector DBs, RAG workflows, automatic data updates.
4. Digital Marketing & SEO Optimization: Organic ranking, Meta campaigns, technical schema markup.
5. Graphic Design, Branding & Video Editing: Style guides, 4K startup explainer demos, UI/UX mockups.
6. E-commerce & Custom Software ERP: Low-latency shopping carts, Node.js REST controllers, distributed CRM.

Our Pricing Tiers:
- Basic Startup Plan ($799): Elegant landing layouts, dynamic contact forms, sitemaps.
- Standard Growth Plan ($1,999): Full portal integrations, databases, custom AI chatbot setup. (Most popular)
- Enterprise Matrix Plan ($4,499): Enterprise full-stack, mobile codes, active automated database updating, 1-year priority support.

Be helpful, concise, extremely elegant, and highly corporate-professional. Keep answers clear, use short paragraphs with beautiful bullet formatting.
If the customer asks about booking, guide them to the booking terminal in the Client Dashboard!
If the customer has no active project, mention they can pay invoices or simulate milestones instantly under Client Dashboard or book via Client Dashboard.

Current page/category user is browsing: ${currentCategory || 'Home page'}`;

    if (client) {
      try {
        // Format previous messages for context
        const contents = messages.map(m => {
          return {
            role: m.sender === 'client' ? 'user' : 'model',
            parts: [{ text: m.text }]
          };
        });

        const completion = await client.models.generateContent({
          model: 'gemini-3.5-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.8
          }
        });

        res.json({ text: completion?.text || 'I apologize, I am unable to parse the response logic.' });
      } catch (err: any) {
        console.error('Gemini Chat API Error:', err);
        res.status(500).json({ error: 'AI processing failed', details: err.message });
      }
    } else {
      // Offline fallback chatbot triggers
      let responseText = "Greetings from Margdarshak IT Solutions fallback system! Our server-side Gemini API key is not configured, but I can guide you manually. ";
      const inputStr = lastMessage.toLowerCase();
      if (inputStr.includes('price') || inputStr.includes('cost') || inputStr.includes('plan')) {
        responseText += "We offer three primary packages: Basic Startup Plan ($799), Standard Growth Plan ($1,999, most popular), and Enterprise Matrix Plan ($4,499). You can review details right inside the Pricing and FAQs panels!";
      } else if (inputStr.includes('web') || inputStr.includes('react') || inputStr.includes('wordpress')) {
        responseText += "Our developer team led by Nisha Patil creates custom React, Next.js, and WordPress environments. Reach out via our Contact or Booking widgets for a technical assessment.";
      } else if (inputStr.includes('ai') || inputStr.includes('chatbot') || inputStr.includes('agent')) {
        responseText += "AI Agent development is our absolute specialty! Aman Roy has deployed dozens of systems using Gemini and RAG frameworks. Try creating an appointment in the dashboard!";
      } else {
        responseText += "How can we help you solve your digital challenges today? We offer Website development, Mobile Apps, SEO, AI Chatbots, and custom CRM systems. Toggle the Customer Support tab or visit the Client Dashboard to launch a ticket.";
      }
      res.json({ text: responseText });
    }
  });

  // Client-Side Dev/Production Middlewares
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static compiled assets
    app.use(express.static(path.resolve(__dirname)));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server fully online and hosting on http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal initialization code failure:', err);
});
