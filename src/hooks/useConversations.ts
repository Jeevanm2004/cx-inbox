import { useReducer, useEffect, useCallback, useRef } from 'react';
import type { Conversation, Message } from '../types';

type State = {
  conversations: Conversation[];
  bufferedConversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  selectedConversationId: string | undefined;
};

type Action =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: Conversation[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_SELECTED'; payload: string | undefined }
  | { type: 'UPDATE_CONVERSATION'; payload: Conversation }
  | { type: 'REMOVE_CONVERSATION'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: { conversationId: string; message: Message } }
  | { type: 'FLUSH_BUFFER'; payload?: 'urgent' | 'high' | 'normal' | 'all' }
  | { type: 'SURGE_TICKETS'; payload: Conversation[] };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, conversations: action.payload };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_SELECTED':
      return { ...state, selectedConversationId: action.payload };
    case 'UPDATE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'REMOVE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.filter((c) => c.id !== action.payload),
        selectedConversationId: state.selectedConversationId === action.payload ? undefined : state.selectedConversationId,
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        conversations: state.conversations.map((c) => {
          if (c.id === action.payload.conversationId) {
            return {
              ...c,
              lastMessage: action.payload.message.text,
              messages: [...c.messages, action.payload.message],
            };
          }
          return c;
        }),
      };
    case 'FLUSH_BUFFER': {
      const priorityToFlush = action.payload || 'all';
      if (priorityToFlush === 'all') {
        return {
          ...state,
          conversations: [...state.bufferedConversations, ...state.conversations],
          bufferedConversations: [],
        };
      }
      
      const toFlush = state.bufferedConversations.filter(c => c.priority === priorityToFlush);
      const toKeep = state.bufferedConversations.filter(c => c.priority !== priorityToFlush);
      
      return {
        ...state,
        conversations: [...toFlush, ...state.conversations],
        bufferedConversations: toKeep,
      };
    }
    case 'SURGE_TICKETS':
      return {
        ...state,
        bufferedConversations: [...state.bufferedConversations, ...action.payload],
      };
    default:
      return state;
  }
};

export const useConversations = () => {
  const [state, dispatch] = useReducer(reducer, {
    conversations: [],
    bufferedConversations: [],
    isLoading: false,
    error: null,
    selectedConversationId: undefined,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchConversations = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    dispatch({ type: 'FETCH_INIT' });
    try {
      const response = await fetch('/api/conversations', { signal: controller.signal });
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchConversations]);

  const setSelectedId = useCallback((id: string | undefined) => {
    dispatch({ type: 'SET_SELECTED', payload: id });
  }, []);

  const flushBuffer = useCallback((priority?: 'urgent' | 'high' | 'normal' | 'all') => {
    dispatch({ type: 'FLUSH_BUFFER', payload: priority });
  }, []);

  const simulateSurge = useCallback(() => {
    const surgeCount = Math.floor(Math.random() * 4) + 3; // 3 to 6 tickets
    const buffered: Conversation[] = [];
    
    for (let i = 0; i < surgeCount; i++) {
      const isUrgent = Math.random() > 0.7;
      const isHigh = !isUrgent && Math.random() > 0.6;
      const priority = isUrgent ? 'urgent' : isHigh ? 'high' : 'normal';
      
      const newTicket: Conversation = {
        id: `surge-${Date.now()}-${i}`,
        customerName: `Surge Customer ${i + 1}`,
        customerEmail: `surge${i + 1}@example.com`,
        customerSince: new Date().toISOString(),
        channel: ['email', 'chat', 'whatsapp'][Math.floor(Math.random() * 3)] as 'email' | 'chat' | 'whatsapp',
        priority,
        status: 'open',
        waitingTime: 0,
        csatScore: 0,
        escalationReason: '',
        lastMessage: 'I need help immediately!',
        assignedTo: null,
        messages: [{
          id: `msg-surge-${Date.now()}-${i}`,
          sender: 'customer',
          text: 'I need help immediately!',
          timestamp: new Date().toISOString(),
        }],
      };
      
      buffered.push(newTicket);
    }
    
    dispatch({ type: 'SURGE_TICKETS', payload: buffered });
  }, []);

  return { state, dispatch, setSelectedId, refetch: fetchConversations, flushBuffer, simulateSurge };
};
