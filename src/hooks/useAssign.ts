import { useState } from 'react';
import type { Conversation } from '../types';

export const useAssign = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assign = async (id: string, onSuccess: (updatedConversation: Conversation) => void) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/conversations/${id}/assign`, { method: 'PUT' });
      if (!response.ok) throw new Error('Failed to assign');
      const data = await response.json();
      onSuccess(data);
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { assign, isLoading, error };
};