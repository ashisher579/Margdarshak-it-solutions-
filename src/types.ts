export interface Service {
  id: string;
  title: string;
  icon: string; // lucide icon name
  description: string;
  details: string[];
  features: string[];
  images: string; // image placeholder text/url
  category: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  client: string;
  category: string;
  tags: string[];
  image: string;
  completionDate: string;
  results: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  billing: string;
  description: string;
  features: string[];
  popular: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  specialty: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface ProjectTrack {
  id: string;
  name: string;
  clientName: string;
  status: 'In Planning' | 'Design Phase' | 'Development' | 'Testing' | 'Completed';
  progress: number; // 0 to 100
  startDate: string;
  targetDate: string;
  milestones: {
    title: string;
    completed: boolean;
    date: string;
  }[];
  paymentStatus: 'unpaid' | 'paid' | 'partial';
  amount: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'pending' | 'resolved';
  createdAt: string;
  messages: {
    sender: 'client' | 'agent';
    text: string;
    timestamp: string;
  }[];
}
