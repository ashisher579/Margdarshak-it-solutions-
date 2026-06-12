import { Service, Project, PricingPlan, BlogPost, TeamMember, FAQItem } from './types';

export const SERVICES: Service[] = [
  {
    id: 'web-dev',
    title: 'Website Development',
    icon: 'Globe',
    description: 'Expert engineering of robust, secure, and visually breathtaking web platforms tailored for heavy traffic and rich interaction.',
    details: [
      'Custom React.js / Next.js architecture',
      'Stripe / Razorpay payment gateways',
      'WordPress & Headless CMS development',
      'Responsive, mobile-optimized, fast-loading layouts',
      'Optimized Core Web Vitals (lighthouse rating > 90)'
    ],
    features: ['Custom HTML/CSS/JS', 'Next.js Jamstack', 'Robust API integrations', 'SEO optimized base'],
    images: 'web_dev_placeholder',
    category: 'Development'
  },
  {
    id: 'mobile-dev',
    title: 'Mobile App Development',
    icon: 'Smartphone',
    description: 'Native and hybrid mobile applications for iOS and Android built on cutting-edge architectures with offline support.',
    details: [
      'Cross-platform Flutter & React Native setups',
      'Swift & Kotlin native performance optimization',
      'Push notification automation & telemetry',
      'Secure local cache databases & token auth',
      'Seamless Play Store / App Store release cycles'
    ],
    features: ['React Native & Flutter', 'Native iOS/Android', 'Offline capability', 'Biometric login'],
    images: 'mobile_dev_placeholder',
    category: 'Development'
  },
  {
    id: 'ai-agents',
    title: 'AI Agent & Automation',
    icon: 'Bot',
    description: 'Transform client inquiries and operations with highly customized server-side LLMs, workflows, and automated bots.',
    details: [
      'Gemini API server-grounded chatbot designs',
      'Vector Databases & RAG (Retrieval Augmented Generation) pipelines',
      'Process automation sheets and workflow bots',
      'Natural Language customer support nodes',
      'Autonomous database updating assistant agents'
    ],
    features: ['Gemini LLM groundings', 'Vector DB & RAG', 'Workflow orchestrators', 'Customer assistance agents'],
    images: 'ai_agents_placeholder',
    category: 'AI Services'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    icon: 'Megaphone',
    description: 'Data-driven online positioning strategies that convert simple impressions into lifetime corporate clients.',
    details: [
      'Google Ads & Meta Advertising optimization',
      'PPC performance analytics dashboarding',
      'Inbound marketing campaign planning',
      'Lead generation landing page architecture',
      'Comprehensive conversion rate optimization (CRO)'
    ],
    features: ['PPC Advertising', 'Targeted Lead Generation', 'Marketing dashboards', 'CRO Planning'],
    images: 'digital_marketing_placeholder',
    category: 'Marketing'
  },
  {
    id: 'seo-optimization',
    title: 'SEO Optimization',
    icon: 'Search',
    description: 'Advanced technical schema alignments and content structures ensuring prominent placement on Google search engines.',
    details: [
      'Technical schema markups and sitemap engineering',
      'Deep competitive keyword gaps reporting',
      'Backlink profile indexing and building',
      'Core Web Vitals loading speed optimization',
      'Local SEO rankings & Citations boost'
    ],
    features: ['Technical SEO Audit', 'Keyword Tracking', 'Schema.org JSON-LD', 'PageSpeed Enhancement'],
    images: 'seo_placeholder',
    category: 'Marketing'
  },
  {
    id: 'social-media',
    title: 'Social Media Management',
    icon: 'Share2',
    description: 'Complete brand narrative orchestration and asset scheduling across LinkedIn, Twitter, and Meta networks.',
    details: [
      'Bespoke social calendar setup',
      'LinkedIn thought-leadership ghostwriting',
      'Dynamic community response systems',
      'Insightful traffic breakdown reporting',
      'High-click brand narrative assets construction'
    ],
    features: ['Post Scheduling', 'LinkedIn ghostwriting', 'Analytics reports', 'Graphic layout assets'],
    images: 'social_media_placeholder',
    category: 'Marketing'
  },
  {
    id: 'video-editing',
    title: 'Video Editing & Production',
    icon: 'Video',
    description: 'Cinematic, engaging video narratives engineered specifically for startup demos, corporate briefings, and viral marketing hooks.',
    details: [
      'SaaS explainer videos and professional tutorials',
      'Social media viral hooks editing and subtitling',
      'Color grading, motion graphics & sound mixing',
      'YouTube strategy and podcast production layouts',
      'High frame-rate 4K promotional rendering'
    ],
    features: ['Explainer Videos', 'Motion Graphics', 'Sound mixing', 'Color Grading'],
    images: 'video_editing_placeholder',
    category: 'Creative'
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design & Branding',
    icon: 'Palette',
    description: 'Harmonious brand books, modern typography setups, and high-convert visual assets defining corporate leadership.',
    details: [
      'Corporate logos & style manuals specification',
      'Print layouts & presentation templates design',
      'Intuitive custom SVG assets development',
      'Modern UI/UX prototyping and wireframes',
      'High-impact vector illustrations and icons'
    ],
    features: ['Logo Systems', 'Corporate style-guides', 'Figma Wireframing', 'Ad banners'],
    images: 'graphic_design_placeholder',
    category: 'Creative'
  },
  {
    id: 'e-commerce',
    title: 'E-commerce Development',
    icon: 'ShoppingBag',
    description: 'High-conversion, distributed online shopping terminals built with low-latency carts and localized checkouts.',
    details: [
      'Custom Shopify setups & app development',
      'WooCommerce and headless secure checkout portals',
      'Global multi-currency checkout routing',
      'Real-time automated inventory sync',
      'Custom discount code engines & customer groups'
    ],
    features: ['Shopify Systems', 'Secure checkout APIs', 'Inventory trackers', 'Localized tax workflows'],
    images: 'ecommerce_placeholder',
    category: 'Development'
  },
  {
    id: 'software-dev',
    title: 'Software Development',
    icon: 'Code',
    description: 'Architecting distributed corporate ERP, CRM systems, desktop software, and specialized operational tooling.',
    details: [
      'Microservice REST & GraphQL backends',
      'Enterprise desktop systems with Electron.js',
      'Scalable database design & migrations management',
      'Automated background jobs & scheduled queues',
      'Secure IAM role permissions setups'
    ],
    features: ['Microservices', 'Desktop Electron', 'Custom ERP/CRM systems', 'Database triggers'],
    images: 'software_dev_placeholder',
    category: 'Development'
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'retail-next',
    title: 'RetailNext E-Commerce Platform',
    description: 'A headless Next.js online megastore with a serverless payment ledger and sub-second loading states.',
    longDescription: 'Collaborating with a premier regional retail brand, we engineered a completely headless retail terminal supporting 50,000 active SKU items, integrated with a distributed stock monitoring backend.',
    client: 'RetailNext Global',
    category: 'E-commerce Development',
    tags: ['Next.js', 'Tailwind CSS', 'GraphQL', 'Stripe', 'Node.js'],
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600&auto=format&fit=crop',
    completionDate: 'March 2026',
    results: ['24% conversion rate improvement', '850ms average transactional checkout speed', '98% Lighthouse performance rating']
  },
  {
    id: 'finance-ai',
    title: 'FinSight Custom AI Analytics',
    description: 'A sovereign financial analyzer utilizing fine-tuned Gemini models to automate daily ledger anomaly scanning.',
    longDescription: 'Created a highly secure automated anomaly tracker that structures unstructured transactional receipts into a uniform report ledger, checking for corporate policy violations.',
    client: 'FinSight Insurance & Advisory',
    category: 'AI Agent Development',
    tags: ['Gemini API', 'TypeScript', 'Node.js', 'Vector DB', 'React'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    completionDate: 'May 2026',
    results: ['Eliminated 120 manual audit hours per week', '99.2% accuracy in expense anomaly scanning', 'Real-time corporate slack dispatch notifications']
  },
  {
    id: 'apex-crm',
    title: 'Apex Cloud CRM & ERP Solution',
    description: 'An enterprise workspace facilitating synchronized task handoffs, field reporting, and automated generation of PDF invoices.',
    longDescription: 'A comprehensive custom logistics enterprise hub operating on multi-user rooms, enabling coordinators to instantly dispatch tasks to field operators with bi-directional location logs.',
    client: 'Apex Industrial Logistics',
    category: 'Software Development',
    tags: ['React.js', 'Express', 'Tailwind', 'MongoDB', 'WebSockets'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
    completionDate: 'January 2026',
    results: ['18% increase in operational dispatch velocities', 'Automated PDF billing saving 3 admin days/month', '99.98% uptime guarantee achieved']
  },
  {
    id: 'fitness-tracker',
    title: 'PulseFit Interactive Mobile App',
    description: 'A beautiful Android & iOS fitness hub with real-time biometric mapping and offline workout syncing.',
    longDescription: 'PulseFit requested a premium, tactile workout application allowing runners and powerlifters to track metrics offline, complete with bluetooth heart-rate synchronizations.',
    client: 'PulseFit Industries',
    category: 'Mobile App Development',
    tags: ['React Native', 'TypeScript', 'Tailwind', 'Redux', 'Bluetooth API'],
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    completionDate: 'April 2026',
    results: ['4.8 Star app store rating on 2,500 reviews', 'Cross-platform native bluetooth sync', 'Offline SQLite secure fallback integrity']
  },
  {
    id: 'brand-overhaul',
    title: 'Vanguard Brand System Refresh',
    description: 'A clean, modern geometric logo, responsive vector assets, and an entire corporate digital brand deck.',
    longDescription: 'We coordinated with Vanguard to re-define their entire public visual style. Standardized primary typography on Space Grotesk, built custom vector icons, and delivered interactive digital branding decks.',
    client: 'Vanguard Digital Holdings',
    category: 'Graphic Design',
    tags: ['Brand Strategy', 'Logo Design', 'Figma Prototyping', 'Vector Assets'],
    image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=600&auto=format&fit=crop',
    completionDate: 'February 2026',
    results: ['Uniform guidelines across 6 product subsidiaries', 'Engaging interactive visual design language', '100% vector SVG adaptability']
  },
  {
    id: 'global-marketing',
    title: 'Zephyr SEO & Digital Strategy',
    description: 'A heavy-hitting inbound marketing matrix boosting organic search queries by over 310%.',
    longDescription: 'Through tactical technical schema rewrites, strategic page-speed boosts, and localized Google Maps coordinate authority networks, we successfully scaled Zephyr into high-authority keywords.',
    client: 'Zephyr Tech Services',
    category: 'SEO Optimization',
    tags: ['Search Marketing', 'Technical SEO', 'Schema Markup', 'Competitor Audits'],
    image: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=600&auto=format&fit=crop',
    completionDate: 'June 2026',
    results: ['Ranked #1 on Google for 14 competitive keywords', '+310% traffic growth in single quarter', 'Reduced acquisition costs by 45%']
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic-plan',
    name: 'Basic Startup Plan',
    price: '$799',
    billing: 'one-time development',
    description: 'Perfect for startups, independent businesses, and service providers aiming for an elegant visual launch.',
    features: [
      'Responsive multi-view web platform or Landing Page (up to 5 pages)',
      'Integration of dynamic Contact Form and WhatsApp chat access',
      'Technical SEO baseline schema set up',
      'Integration of Google Analytics tracker',
      '1 Month complimentary technical operations warranty'
    ],
    popular: false
  },
  {
    id: 'standard-plan',
    name: 'Standard Growth Plan',
    price: '$1,999',
    billing: 'one-time development',
    description: 'Premium choice for mid-sized ventures launching highly interactive systems and custom digital solutions.',
    features: [
      'Comprehensive Web application (up to 12 pages) or native iOS/Android App (1 page)',
      'Full Database Integration with Client Portal access',
      'Premium E-Commerce Checkout / Appointment Scheduler setup',
      'Advanced Custom AI chatbot backend implementation',
      'Social media content calendar + 1 dynamic marketing video asset',
      '3 Months priority maintenance and update assistance'
    ],
    popular: true
  },
  {
    id: 'premium-plan',
    name: 'Enterprise Matrix Plan',
    price: '$4,499',
    billing: 'one-time development',
    description: 'The ultimate digital transformation bundle including AI-agents routing, custom software setups, and SEO grids.',
    features: [
      'Full-stack custom React Web App AND Cross-platform Mobile App (React Native)',
      'Enterprise admin logs panel, multi-role security system',
      'Full Google Workspace & CRM automatic pipeline integration',
      'Autonomous AI chatbot with fine-tuning and active database updates',
      'Complete Branding overhaul kit + SEO rank expansion system (10 competitive keywords tracked)',
      'Dedicated 24/7 technical Account Manager with 1 Year coverage'
    ],
    popular: false
  }
];

export const TEAM: TeamMember[] = [
  {
    name: 'Shankar Sharma',
    role: 'Managing Director & Principal Architect',
    bio: 'Shankar possesses over 15 years in enterprise system modeling. He guides critical engineering structures and digital solutions workflows.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    specialty: ['System Architecture', 'Strategy Consulting', 'AI Alignment']
  },
  {
    name: 'Nisha Patil',
    role: 'Lead Systems Developer',
    bio: 'An expert in high-performance React architectures, Nisha heads our full-stack engineers and oversees microservice REST orchestrations.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    specialty: ['React & Next.js', 'API Gateways', 'Database Design']
  },
  {
    name: 'Aman Roy',
    role: 'AI & Machine Learning Lead',
    bio: 'Aman specializes in fine-tuning massive generative libraries and implementing retrieval augmented pipelines for enterprise chatbots.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    specialty: ['Gemini LLM', 'RAG Flows', 'Autonomous agents']
  },
  {
    name: 'Pooja Nair',
    role: 'Heads Creative Branding & UI/UX',
    bio: 'Pooja ensures that each layout breathes identity and flows logically, aligning client products with modern visual psychology.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    specialty: ['Branding Kits', 'Tactile UI/UX Design', 'Motion Graphics']
  }
];

export const BLOGS: BlogPost[] = [
  {
    id: 'ai-agents-businesses',
    title: 'How Autonomous AI Agents Are Rewriting SMB Overhead Rules',
    excerpt: 'Simple prompt chatbots are yesterday. Modern businesses are routing customer support to autonomous agent nodes that update invoices in real-time.',
    content: `Over the past twelve months, the conversation around Artificial Intelligence has shifted from "what can language models write?" to "what can autonomous agents *do*?".

For small and medium businesses (SMBs), this transition from conversational chatbots to action-oriented AI agents represents a monumental reduction in operational overhead.

### Beyond the Textbox: Actionable Chatbots
Traditional support web interfaces only repeat programmed scripts. An AI Agent powered by custom server-side API integration, however, connects straight to operational nodes:
1. **Database-Grounding**: Checking true warehouse stock logs instantly.
2. **Action-Capable Transactions**: Amending active client tickets and processing appointment rescheduling autonomously.
3. **Data Integrity**: Flagging anomalies and dispatching instant messaging updates straight to business managers.

At Margdarshak IT Solutions, we construct deep Gemini API integrations that safely interact with our databases, ensuring customer query resolutions drop from 24 hours to 1.5 seconds.`,
    author: {
      name: 'Aman Roy',
      role: 'AI Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop'
    },
    date: 'June 4, 2026',
    readTime: '4 min read',
    category: 'AI Agents',
    tags: ['AI Agents', 'Automation', 'Gemini API']
  },
  {
    id: 'nextjs-speed-conversions',
    title: 'Core Web Vitals: Why a 500ms Delay Devastates Checkout Conversion Rates',
    excerpt: 'Page Speed is no longer a vanity metric. If your checkout page stutters for even half a second, user drop-off cascades up to 20%. Let us parse the metrics.',
    content: `When measuring e-commerce throughput, developers often hyper-focus on discount campaigns or visual UI fluff. However, technical latency remains the largest silent killer of sales volumes.

Google's Core Web Vitals objectively measure three facets of user experience:
* **LCP (Largest Contentful Paint)**: Loading speed.
* **FID (First Input Delay)**: Visual/Click responsiveness.
* **CLS (Cumulative Layout Shift)**: Page visual stability.

### The Financial Cost of Technical Stutters
Academic research and massive scale audits consistently expose the relationship:
* A site loading in **1.2 seconds** exhibits average conversion rates of **5.2%**.
* Over **3 seconds**, conversion drops to less than **1.9%**.
* Every **100ms of latency reduction** yields up to **1% overall revenue gains**.

This is why "Margdarshak IT Solutions" develops on Jamstack Next.js and Tailwind CSS frameworks. By rendering layouts server-side, compiling CSS inline, and lazy-loading media elements, we guarantee transactional speeds under 900 milliseconds.`,
    author: {
      name: 'Nisha Patil',
      role: 'Lead Systems Developer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop'
    },
    date: 'May 18, 2026',
    readTime: '6 min read',
    category: 'Development',
    tags: ['Next.js', 'Core Web Vitals', 'Page Speed']
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Do you build native mobile applications, or only web-wrappers?",
    answer: "We engineer fully compiled native applications utilizing Swift (iOS) and Kotlin (Android), as well as hybrid single-codebase React Native or Flutter structures depending on your target reach and maintenance budgets.",
    category: "Services"
  },
  {
    question: "Can your AI agent chatbots run securely without exposing our corporate datasets?",
    answer: "Yes, our server-side integration utilizes Gemini API with strict enterprise security protocols. Your raw database remains fully protected behind our Node.js microservices. We configure precise system context restrictions ensuring the chatbot is locked down to professional customer advice.",
    category: "AI & Security"
  },
  {
    question: "How does the digital Client Dashboard and Project Tracking system function?",
    answer: "Upon contract onboarding, we issue you unique client login access. Within your secure Client Dashboard, you track real-time project progress bars, visual task milestones, view your pending development invoices, pay using simulated secure portals, and directly book support calls.",
    category: "Corporate Flow"
  },
  {
    question: "What is your typical schedule for delivery of custom websites and e-commerce portals?",
    answer: "A basic landing or marketing layout finishes in 7 to 14 days, while complex database-driven portals, custom CRM applications, and advanced E-commerce stores typically range from 4 to 8 weeks including technical testing phases.",
    category: "Services"
  },
  {
    question: "Do you offer post-development support plans?",
    answer: "Absolutely. Rather than releasing builds and disappearing, we provide 1 to 12 months in-contract warranties. Afterward, you can opt for standard monthly optimization packages ensuring security patches, data back-ups, and copy alignments occur continuously.",
    category: "Corporate Flow"
  }
];
