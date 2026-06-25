import { http, HttpResponse, delay } from 'msw';
import { conversations } from './data';
import type { Message } from '../types';

let mockConversations = [...conversations];

const randomDelay = () => delay(500);
export const handlers = [
  http.get('/api/conversations', async () => {
    await randomDelay();
    return HttpResponse.json(mockConversations);
  }),
  http.put('/api/conversations/:id/resolve', async ({ params }) => {
    await randomDelay();
    const { id } = params;

    // Fails 30% of the time
    if (Math.random() < 0.3) {
      return HttpResponse.json(
        { error: 'Failed to resolve conversation' },
        { status: 500 }
      );
    }

    const conversationIndex = mockConversations.findIndex((c) => c.id === id);
    if (conversationIndex === -1) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }

    mockConversations[conversationIndex] = {
      ...mockConversations[conversationIndex],
      status: 'resolved',
    };

    return HttpResponse.json(mockConversations[conversationIndex]);
  }),

  http.put('/api/conversations/:id/assign', async ({ params }) => {
    await randomDelay();
    const { id } = params;

    const conversationIndex = mockConversations.findIndex((c) => c.id === id);
    if (conversationIndex === -1) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }

    mockConversations[conversationIndex] = {
      ...mockConversations[conversationIndex],
      status: 'assigned',
      assignedTo: 'You',
    };

    return HttpResponse.json(mockConversations[conversationIndex]);
  }),

  http.post('/api/conversations/:id/reply', async ({ request, params }) => {
    await randomDelay();
    const { id } = params;
    
    let text = '';
    try {
      const body = await request.json() as { text?: string };
      text = body.text || '';
    } catch {
      return HttpResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    
    const conversationIndex = mockConversations.findIndex((c) => c.id === id);
    if (conversationIndex === -1) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      text,
      timestamp: new Date().toISOString(),
    };

    mockConversations[conversationIndex] = {
      ...mockConversations[conversationIndex],
      lastMessage: text,
      messages: [...mockConversations[conversationIndex].messages, newMessage],
    };

    return HttpResponse.json(newMessage, { status: 201 });
  }),
];
