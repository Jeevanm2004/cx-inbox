export interface Message {
  id: string;
  sender: 'customer' | 'ai' | 'agent';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerSince: string;
  channel: 'whatsapp' | 'chat' | 'email';
  priority: 'urgent' | 'high' | 'normal';
  status: 'open' | 'assigned' | 'resolved';
  waitingTime: number;
  csatScore: number;
  escalationReason: string;
  lastMessage: string;
  assignedTo: string | null;
  messages: Message[];
}
