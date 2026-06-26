import { useReducer, useEffect, useCallback, useRef } from 'react';
import type { Conversation, Message } from '../types';

type State = {
  conversations: Conversation[];
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
  | { type: 'ADD_MESSAGE'; payload: { conversationId: string; message: Message } };

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
    default:
      return state;
  }
};

export const useConversations = () => {
  const [state, dispatch] = useReducer(reducer, {
    conversations: [],
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

  return { state, dispatch, setSelectedId, refetch: fetchConversations };
};
