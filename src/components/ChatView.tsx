import { useRef, useState } from "react";
import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { Message } from "../providers/base";
import { Conversation } from "../utils/storage";

interface ChatViewProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  streamingContent: string;
  isLoading: boolean;
  searchText: string;
  selectedItemId: string;
  onSearchTextChange: (text: string) => void;
  onSubmit: (text: string) => void;
  onNewChat: () => void;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (conversation: Conversation) => void;
}

function formatConversation(messages: Message[], streamingContent: string): string {
  if (messages.length === 0 && !streamingContent) {
    return `# New Conversation

Type your message above and press **Enter** to send.`;
  }

  let markdown = "";

  for (const message of messages) {
    if (message.role === "user") {
      markdown += `**You**\n\n${message.content}\n\n---\n\n`;
    } else if (message.role === "assistant") {
      markdown += `**Assistant**\n\n> ${message.content.split('\n').join('\n> ')}\n\n---\n\n`;
    }
  }

  if (streamingContent) {
    markdown += `**Assistant**\n\n> ${streamingContent.split('\n').join('\n> ')}\n\n_Generating..._\n\n---\n\n`;
  }

  return markdown;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function ChatView({
  conversations,
  currentConversation,
  messages,
  streamingContent,
  isLoading,
  searchText,
  selectedItemId,
  onSearchTextChange,
  onSubmit,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}: ChatViewProps) {
  const markdown = formatConversation(messages, streamingContent);
  const fullConversation = messages.map((m) => `${m.role === "user" ? "You" : "Assistant"}: ${m.content}`).join("\n\n");

  // Track actual selection locally - this is the source of truth for display
  const [localSelection, setLocalSelection] = useState<string>(selectedItemId);

  // Only sync from prop on initial mount (when localSelection would match initial selectedItemId)
  const isInitialMount = useRef(true);
  if (isInitialMount.current) {
    isInitialMount.current = false;
  }

  const handleSendMessage = () => {
    if (searchText.trim() && !isLoading) {
      onSubmit(searchText.trim());
      onSearchTextChange("");
    }
  };

  return (
    <List
      isLoading={isLoading}
      isShowingDetail={true}
      searchText={searchText}
      onSearchTextChange={onSearchTextChange}
      searchBarPlaceholder="Type a message..."
      onSelectionChange={(id) => {
        if (!id) return;

        // Update local selection immediately
        setLocalSelection(id);

        // Notify parent
        if (id === "new-chat") {
          onNewChat();
          return;
        }

        const conv = conversations.find((c) => c.id === id);
        if (conv) {
          onSelectConversation(conv);
        }
      }}
    >
      <List.Item
        id="new-chat"
        icon={Icon.Plus}
        title="New Chat"
        detail={<List.Item.Detail markdown={markdown} />}
        actions={
          <ActionPanel>
            <Action
              title="Send Message"
              icon={Icon.Message}
              onAction={handleSendMessage}
            />
            <Action
              title="New Chat"
              icon={Icon.Plus}
              shortcut={{ modifiers: ["cmd"], key: "n" }}
              onAction={onNewChat}
            />
          </ActionPanel>
        }
      />

      {conversations.length > 0 && (
        <List.Section title="History">
          {conversations.map((conv) => {
            // Use local state for isSelected - synchronized with onSelectionChange
            const isSelected = localSelection === conv.id;
            // Use conv's messages directly to avoid timing issues
            const convMarkdown = isSelected
              ? formatConversation(conv.messages, streamingContent)
              : `**${conv.title}**\n\n${conv.messages.length} messages`;
            const convFullText = conv.messages.map((m) => `${m.role === "user" ? "You" : "Assistant"}: ${m.content}`).join("\n\n");

            return (
              <List.Item
                id={conv.id}
                key={conv.id}
                icon={Icon.Message}
                title={conv.title}
                accessories={[
                  { text: `${conv.messages.length}` },
                  { text: formatDate(conv.updatedAt) },
                ]}
                detail={<List.Item.Detail markdown={convMarkdown} />}
                actions={
                  <ActionPanel>
                    <Action
                      title="Send Message"
                      icon={Icon.Message}
                      onAction={handleSendMessage}
                    />
                    <Action
                      title="New Chat"
                      icon={Icon.Plus}
                      shortcut={{ modifiers: ["cmd"], key: "n" }}
                      onAction={onNewChat}
                    />
                    {convFullText && isSelected && (
                      <Action.CopyToClipboard
                        title="Copy Conversation"
                        content={convFullText}
                        shortcut={{ modifiers: ["cmd"], key: "c" }}
                      />
                    )}
                    <Action
                      title="Delete"
                      icon={Icon.Trash}
                      style={Action.Style.Destructive}
                      shortcut={{ modifiers: ["cmd"], key: "backspace" }}
                      onAction={() => onDeleteConversation(conv)}
                    />
                  </ActionPanel>
                }
              />
            );
          })}
        </List.Section>
      )}
    </List>
  );
}
