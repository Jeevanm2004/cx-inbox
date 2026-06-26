import { useEffect } from 'react';
import type { Conversation } from '../types';

interface UseKeyboardNavigationProps {
  conversations: Conversation[];
  selectedConversationId: string | undefined;
  setSelectedConversationId: (id: string | undefined) => void;
  onAssign: () => void;
  onResolve: () => void;
  onFocusInput: () => void;
  onOpenHelp: () => void;
}

export const useKeyboardNavigation = ({
  conversations,
  selectedConversationId,
  setSelectedConversationId,
  onAssign,
  onResolve,
  onFocusInput,
  onOpenHelp,
}: UseKeyboardNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Bypass global shortcuts if typing inside an input/textarea
      const target = event.target as HTMLElement;
      const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Escape handles globally to blur inputs
      if (event.key === 'Escape') {
        if (isInputFocused) {
          target.blur();
        }
        return;
      }

      // Lock other single-key shortcuts while typing
      if (isInputFocused) return;

      switch (event.key) {
        case 'ArrowDown':
        case 'j':
        case 'J': {
          event.preventDefault(); // Prevent native scrolling
          if (conversations.length === 0) break;
          const currentIndex = conversations.findIndex(c => c.id === selectedConversationId);
          const nextIndex = currentIndex < conversations.length - 1 ? currentIndex + 1 : 0;
          setSelectedConversationId(conversations[nextIndex].id);
          break;
        }
        case 'ArrowUp':
        case 'k':
        case 'K': {
          event.preventDefault(); // Prevent native scrolling
          if (conversations.length === 0) break;
          const currentIndex = conversations.findIndex(c => c.id === selectedConversationId);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : conversations.length - 1;
          setSelectedConversationId(conversations[prevIndex].id);
          break;
        }
        case 'a':
        case 'A': {
          if (selectedConversationId) onAssign();
          break;
        }
        case 'r':
        case 'R': {
          if (selectedConversationId) onResolve();
          break;
        }
        case 'i':
        case 'I': {
          event.preventDefault(); // Prevent typing the 'i' character inside the box
          onFocusInput();
          break;
        }
        case '/': {
          event.preventDefault();
          const searchInput = document.getElementById('search-input');
          searchInput?.focus();
          break;
        }
        case '?': {
          event.preventDefault();
          onOpenHelp();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [conversations, selectedConversationId, setSelectedConversationId, onAssign, onResolve, onFocusInput, onOpenHelp]);
};
