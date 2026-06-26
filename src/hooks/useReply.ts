import { useState } from 'react';
import type { Message } from '../types';

export const useReply = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reply = async (
    id: string, 
    text: string, 
    onSuccess: (message: Message) => void,
    onError?: (errMessage: string) => void
  ) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/conversations/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to reply');
      const message = await response.json();
      onSuccess(message);
    } catch (err: any) {
      const errMsg = err instanceof Error ? err.message : 'Failed to reply';
      setError(errMsg);
      if (onError) onError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return { reply, isLoading, error };
};