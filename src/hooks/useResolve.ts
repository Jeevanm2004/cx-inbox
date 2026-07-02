import { useState } from 'react';
import type { Conversation } from '../types';

export const useResolve = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolve = async (
    id: string, 
    onSuccess: (updated: Conversation) => void,
    onError?: (errMessage: string) => void
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/conversations/${id}/resolve`, { method: 'PUT' });
      if (!response.ok) {
        throw new Error("Couldn't resolve. Try again?");
      }
      const data = await response.json();
      onSuccess(data);
    } catch {
      const errMsg = "Couldn't resolve. Try again?";
      setError(errMsg);
      if (onError) onError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };
  
  const unresolve = async (
    id: string, 
    onSuccess: (updated: Conversation) => void,
    onError?: (errMessage: string) => void
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/conversations/${id}/unresolve`, { method: 'PUT' });
      if (!response.ok) {
        throw new Error("Couldn't unresolve. Try again?");
      }
      const data = await response.json();
      onSuccess(data);
    } catch {
      const errMsg = "Couldn't unresolve. Try again?";
      setError(errMsg);
      if (onError) onError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };
  return { resolve, unresolve, isLoading, error };
};