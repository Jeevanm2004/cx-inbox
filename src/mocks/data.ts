import type { Conversation } from '../types';

const generateIsoString = (minutesAgo: number) => {
  const date = new Date('2026-06-26T14:00:00.000Z');
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
};

export const conversations: Conversation[] = [
  // URGENT cases: waitingTime > 30 AND csatScore <= 2
  {
    id: 'conv-001',
    customerName: 'Acme Corp - IT Admin',
    customerEmail: 'admin@acme.corp',
    customerSince: 'Jan 2024',
    channel: 'email',
    priority: 'urgent',
    status: 'open',
    waitingTime: 45,
    csatScore: 1,
    escalationReason: 'System outage affecting multiple regions. Bot unable to resolve infrastructure tier 3 issues.',
    lastMessage: 'Your case is being escalated to the severity 1 incident team. 🚨👩‍💻',
    assignedTo: null,
    messages: [
      {
        id: 'msg-001-1',
        sender: 'customer',
        text: '🚨 Urgent: Our primary production database cluster in US-East has gone completely offline. We are experiencing a total service disruption.',
        timestamp: generateIsoString(60)
      },
      {
        id: 'msg-001-2',
        sender: 'ai',
        text: 'I understand you are experiencing database connectivity issues. Have you tried checking your VPC security group rules or restarting the cluster? 🛠️',
        timestamp: generateIsoString(59)
      },
      {
        id: 'msg-001-3',
        sender: 'customer',
        text: 'This is not a simple VPC issue. The entire cluster is unresponsive, and our internal metrics show hardware failure on your end. Stop giving me basic troubleshooting steps and escalate this immediately! 🛑',
        timestamp: generateIsoString(45)
      },
      {
        id: 'msg-001-4',
        sender: 'ai',
        text: '🤖 SYSTEM AUTOMATION: High-severity keywords detected ("hardware failure", "escalate immediately"). Case automatically upgraded to Priority 1 and flagged for human incident response team. Your case is being escalated to the severity 1 incident team. 🚨👩‍💻',
        timestamp: generateIsoString(45)
      }
    ]
  },
  {
    id: 'conv-002',
    customerName: 'Elena Rodriguez',
    customerEmail: 'elena.rodriguez@gmail.com',
    customerSince: 'Mar 2025',
    channel: 'whatsapp',
    priority: 'urgent',
    status: 'assigned',
    waitingTime: 65,
    csatScore: 2,
    escalationReason: 'Account locked due to suspected fraud during international travel.',
    lastMessage: 'A fraud specialist will review your passport scan shortly. 🛂',
    assignedTo: 'Marcus Reed',
    messages: [
      {
        id: 'msg-002-1',
        sender: 'customer',
        text: 'My corporate card is declining everywhere in Tokyo 🇯🇵. I need this unlocked ASAP, I have a client dinner in two hours! 💳🍣',
        timestamp: generateIsoString(80)
      },
      {
        id: 'msg-002-2',
        sender: 'ai',
        text: '👋 Hello Elena. I see a security block on your card ending in 4092 due to unexpected international activity. I can unlock it if you authenticate via SMS. 📱',
        timestamp: generateIsoString(79)
      },
      {
        id: 'msg-002-3',
        sender: 'customer',
        text: 'I told you before my trip I wouldn\'t have my US SIM active! ✈️ I can\'t get the SMS. I need another way to verify. This is extremely frustrating. 😠',
        timestamp: generateIsoString(65)
      },
      {
        id: 'msg-002-4',
        sender: 'ai',
        text: '🤖 SYSTEM NOTE: Customer failed standard multi-factor challenge. Escalating to fraud prevention team for manual ID verification. A fraud specialist will review your passport scan shortly. 🛂',
        timestamp: generateIsoString(65)
      }
    ]
  },

  // HIGH cases: waitingTime > 15 OR csatScore <= 3 (but not both triggering urgent)
  {
    id: 'conv-003',
    customerName: 'TechFlow Solutions',
    customerEmail: 'contact@techflow.io',
    customerSince: 'Nov 2024',
    channel: 'chat',
    priority: 'high',
    status: 'open',
    waitingTime: 20, // waitingTime > 15
    csatScore: 4,    // csatScore > 2 (so it's not urgent)
    escalationReason: 'API rate limit expansion request needs sales engineering approval.',
    lastMessage: 'Routing you to an integration specialist to review your architecture. 👨‍💻',
    assignedTo: null,
    messages: [
      {
        id: 'msg-003-1',
        sender: 'customer',
        text: '👋 Hello, we are consistently hitting the 10,000 req/min rate limit on the messaging API and getting 429s. We need this limit doubled. 📈',
        timestamp: generateIsoString(30)
      },
      {
        id: 'msg-003-2',
        sender: 'ai',
        text: 'Hello! To increase rate limits, you can upgrade your plan in the Billing Dashboard. Would you like a link to that page? 🔗',
        timestamp: generateIsoString(29)
      },
      {
        id: 'msg-003-3',
        sender: 'customer',
        text: 'We are already on the Enterprise tier 🏢. My account manager said we could request custom limits for our architecture. The dashboard won\'t let me go higher.',
        timestamp: generateIsoString(20)
      },
      {
        id: 'msg-003-4',
        sender: 'ai',
        text: '🤖 SYSTEM TRIGGER: Enterprise tier custom limit request identified. Routing you to an integration specialist to review your architecture. 👨‍💻',
        timestamp: generateIsoString(20)
      }
    ]
  },
  {
    id: 'conv-004',
    customerName: 'Michael Chang',
    customerEmail: 'mchang@solutions.com',
    customerSince: 'Feb 2023',
    channel: 'email',
    priority: 'high',
    status: 'resolved',
    waitingTime: 10, // waitingTime <= 15
    csatScore: 3,    // csatScore <= 3 (makes it high)
    escalationReason: 'Billing discrepancy involving prorated enterprise licenses.',
    lastMessage: 'I have issued a credit of $450 to your next invoice. Is there anything else? 🎉💰',
    assignedTo: 'Sarah Jenkins',
    messages: [
      {
        id: 'msg-004-1',
        sender: 'customer',
        text: 'My invoice this month is $450 higher than expected 💵. I removed 10 user seats halfway through the billing cycle but wasn\'t prorated.',
        timestamp: generateIsoString(120)
      },
      {
        id: 'msg-004-2',
        sender: 'ai',
        text: 'I can help with billing inquiries 🧾. According to our policy, removing seats takes effect on the next billing cycle. Proration applies only to added seats.',
        timestamp: generateIsoString(119)
      },
      {
        id: 'msg-004-3',
        sender: 'customer',
        text: 'That contradicts the addendum in our enterprise service agreement 📄. Clause 4.2 specifically states we get daily proration for removed licenses. Can someone human look at my contract? 🤔',
        timestamp: generateIsoString(100)
      },
      {
        id: 'msg-004-4',
        sender: 'ai',
        text: '🤖 SYSTEM ALERT: Legal/Contract discrepancy detected. Escalating ticket to Enterprise Billing Support for contract review.',
        timestamp: generateIsoString(100)
      },
      {
        id: 'msg-004-5',
        sender: 'agent',
        text: 'Hi Michael. You are absolutely correct; your enterprise addendum supersedes standard policy. I have issued a credit of $450 to your next invoice. Is there anything else? 🎉💰',
        timestamp: generateIsoString(20)
      }
    ]
  },

  // NORMAL cases: waitingTime <= 15 AND csatScore > 3
  {
    id: 'conv-005',
    customerName: 'Global Logistics Inc',
    customerEmail: 'support@globallogistics.com',
    customerSince: 'Jul 2024',
    channel: 'chat',
    priority: 'normal',
    status: 'assigned',
    waitingTime: 8,
    csatScore: 5,
    escalationReason: 'Requesting documentation for a legacy API endpoint.',
    lastMessage: 'Transferring you to a technical support agent who can provide legacy docs. 🔄',
    assignedTo: 'David Kim',
    messages: [
      {
        id: 'msg-005-1',
        sender: 'customer',
        text: 'Hi, I\'m looking for the documentation for the v1/shipments endpoint 📦. The developer portal only shows v2 and v3. 📚',
        timestamp: generateIsoString(20)
      },
      {
        id: 'msg-005-2',
        sender: 'ai',
        text: 'Hello! ⚠️ The v1 API has been deprecated as of last year. We highly recommend migrating to v3. You can find the migration guide here: [Link]',
        timestamp: generateIsoString(19)
      },
      {
        id: 'msg-005-3',
        sender: 'customer',
        text: 'We are planning to migrate next quarter, but I need to patch an existing integration right now 🕰️. Is there an archive of the old docs?',
        timestamp: generateIsoString(8)
      },
      {
        id: 'msg-005-4',
        sender: 'ai',
        text: '🤖 SYSTEM ROUTING: Legacy documentation requested. Transferring you to a technical support agent who can provide legacy docs. 🔄',
        timestamp: generateIsoString(8)
      }
    ]
  },
  {
    id: 'conv-006',
    customerName: 'Jessica Alby',
    customerEmail: 'jessica.alby@yahoo.com',
    customerSince: 'Sep 2025',
    channel: 'whatsapp',
    priority: 'normal',
    status: 'open',
    waitingTime: 2,
    csatScore: 4,
    escalationReason: 'User wants to merge two accounts with different email addresses.',
    lastMessage: 'Connecting you with an account specialist to merge your profiles securely. 🔒',
    assignedTo: null,
    messages: [
      {
        id: 'msg-006-1',
        sender: 'customer',
        text: 'Hello, I accidentally created a new account with my personal email, but I want to merge its purchase history with my work account. 🛍️',
        timestamp: generateIsoString(15)
      },
      {
        id: 'msg-006-2',
        sender: 'ai',
        text: 'I can help with account management ⚙️. To change your email address, you can go to Settings > Profile > Email.',
        timestamp: generateIsoString(14)
      },
      {
        id: 'msg-006-3',
        sender: 'customer',
        text: 'No, I don\'t want to change my email. I have two separate accounts and want to combine them into one so I don\'t lose my loyalty points! ⭐',
        timestamp: generateIsoString(2)
      },
      {
        id: 'msg-006-4',
        sender: 'ai',
        text: '🤖 SYSTEM ESCALATION: Account merge request requires manual security verification. Connecting you with an account specialist to merge your profiles securely. 🔒',
        timestamp: generateIsoString(2)
      }
    ]
  }
];
