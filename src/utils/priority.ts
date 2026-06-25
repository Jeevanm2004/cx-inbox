import type { Conversation } from '../types';

export const groupConversationsByPriority = (conversations: Conversation[]) => {
  const groups: { urgent: Conversation[], high: Conversation[], normal: Conversation[] } = {
    urgent: [],
    high: [],
    normal: []
  };

  conversations.forEach((conv) => {
    if (conv.priority === 'urgent') {
      groups.urgent.push(conv);
    } else if (conv.priority === 'high') {
      groups.high.push(conv);
    } else {
      groups.normal.push(conv);
    }
  });

  return groups;
};
