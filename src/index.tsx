import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import type { KeyboardEvent, EmitterSubscription } from 'react-native';
import axios from 'axios';
import { createStyles } from './styles';
import Header from './Header/Header';
import InputBox from './InputBox/InputBox';
import { darkTheme, lightTheme, type ThemeColors } from './theme/theme';

interface ThemeContextType {
  theme: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export type ChatRefType = {
  endChat: () => void;
  messages: MessageType[];
  setMessages: (messages: MessageType[]) => void;
  chatEnded: boolean;
  setChatEnded: (chatEnded: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

type AloChatScreenProps = {
  clientEmail: string;
  clientName: string;
  cwid: string;
  namespace: string;
  phone_number: string;
  security_token: string;
  customHeader?: React.ReactNode;
  onClose?: () => void;
  initialChatToken?: string;
  initialChatKey?: string;
  onChatStarted?: (activeChatKey: string, chatToken: string) => void;
  chatRef?: React.RefObject<ChatRefType>;
  onContinueLater?: () => void;
  memberId?: string;
  transaction?: string;
  initialTheme?: 'light' | 'dark';
  client_custom_data?: any;
};

export interface MessageType {
  id: number;
  from: string;
  message: string;
  status?: 'sending' | 'sent' | 'failed';
  msg_id?: string;
  timestamp?: string;
  sender_name?: string;
  avatar?: string;
}

const AloChatContent = ({
  clientEmail,
  clientName,
  cwid,
  namespace,
  phone_number,
  security_token,
  customHeader,
  onClose,
  initialChatToken,
  initialChatKey,
  onChatStarted,
  chatRef,
  onContinueLater,
  memberId,
  transaction,
  initialTheme,
  client_custom_data,
}: AloChatScreenProps) => {
  const [loading, setLoading] = useState(true);
  const [chatToken, setChatToken] = useState('');
  const [activeChatKey, setActiveChatKey] = useState('');
  const [chatEnded, setChatEnded] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [safeAreaTop, setSafeAreaTop] = useState(
    Platform.OS === 'ios' ? StatusBar.currentHeight || 20 : 0
  );
  const [safeAreaBottom, setSafeAreaBottom] = useState(
    Platform.OS === 'ios' ? 34 : 0
  );

  // const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isDark, setIsDark] = useState(
    initialTheme ? initialTheme === 'dark' : false
  );

  const theme = isDark ? darkTheme : lightTheme;

  const styles = createStyles(theme);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (initialTheme) {
      setIsDark(initialTheme === 'dark');
    }
  }, [initialTheme]);

  // Keyboard event listeners
  useEffect(() => {
    let keyboardWillShowListener: EmitterSubscription | undefined;
    let keyboardWillHideListener: EmitterSubscription | undefined;
    let keyboardDidShowListener: EmitterSubscription | undefined;
    let keyboardDidHideListener: EmitterSubscription | undefined;

    if (Platform.OS === 'ios') {
      // iOS-specific events
      keyboardWillShowListener = Keyboard.addListener(
        'keyboardWillShow',
        (e: KeyboardEvent) => {
          setKeyboardHeight(e.endCoordinates.height);
        }
      );
      keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        () => {
          setKeyboardHeight(0);
        }
      );
    } else {
      // Android-specific events
      keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        (e: KeyboardEvent) => {
          setKeyboardHeight(e.endCoordinates.height);
        }
      );
      keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardHeight(0);
      });
    }

    return () => {
      // Clean up listeners
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Additional function to scroll to bottom that can be called manually
  const scrollToBottom = useCallback(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (chatRef?.current) {
      chatRef.current.messages = messages;
      chatRef.current.setMessages = setMessages;
      chatRef.current.chatEnded = chatEnded;
      chatRef.current.setChatEnded = setChatEnded;
      chatRef.current.loading = loading;
      chatRef.current.setLoading = setLoading;
    }
  }, [
    messages,
    setMessages,
    chatEnded,
    setChatEnded,
    loading,
    setLoading,
    chatRef,
  ]);

  const initializeChat = useCallback(async () => {
    try {
      if (initialChatToken && initialChatKey) {
        const tokenRes = await axios.post(
          'https://api.alo-tech.com/application/access_token/',
          {
            client_id: 'deae0fdc12ccfa63f94dd19f66bfcb10',
            client_secret:
              'be4c9e5959ec2e27c3229f527015d0f07e353294384308e75e0e166ca64d54f6',
          },
          {
            headers: {
              tenant: 'appic.alo-tech.com',
            },
          }
        );

        const chatHistoryRes = await axios.get(
          `https://api.alo-tech.com/v3/chats/${initialChatKey}/history`,
          {
            headers: {
              Authorization: `Bearer ${tokenRes.data.access_token}`,
              Tenant: 'appic.alo-tech.com',
            },
          }
        );

        const chatHistory = chatHistoryRes.data.chat_history;

        // Process messages if they exist in the response
        if (chatHistory && Array.isArray(chatHistory)) {
          // Process each message using the same logic as socket.onmessage
          const processedMessages: MessageType[] = [];

          for (const data of chatHistory) {
            // Skip setting/queued and other non-text messages
            if (
              data.type === 'text' &&
              data.type !== 'system' &&
              data.message &&
              data.message.length > 0
            ) {
              const isSupportMessage = data.sender !== 'client';

              const formattedTimestamp =
                data.insert_date &&
                data.insert_date.date &&
                data.insert_date.time
                  ? `${data.insert_date.date} ${data.insert_date.time}`
                  : new Date().toISOString();

              processedMessages.push({
                id: processedMessages.length + 1,
                from: isSupportMessage ? 'support' : 'user',
                message: data.message || '',
                status: 'sent',
                timestamp: formattedTimestamp,
                sender_name: isSupportMessage
                  ? data.name || data.nickname || 'Support'
                  : 'You',
                avatar: data.avatar || undefined,
                msg_id: data.msg_id,
              });
            }
          }

          setMessages(processedMessages);
        }

        setChatToken(initialChatToken);
        setActiveChatKey(initialChatKey);
      } else {
        const response = await axios.post(
          'https://chatserver.alo-tech.com/chat-api/new',
          {
            client_email: clientEmail,
            client_name: clientName,
            cwid: cwid,
            namespace: namespace,
            phone_number: phone_number,
            security_token: security_token,
            client_custom_data: JSON.stringify(client_custom_data),
          }
        );
        setChatToken(response.data.token);
        setActiveChatKey(response.data.active_chat_key);
        onChatStarted?.(response.data.active_chat_key, response.data.token);
      }
    } catch (error) {
      console.error('Chat initialization failed:', error);
      setMessages([
        {
          id: 1,
          from: 'support',
          message: 'Bağlantı sağlanamadı. Lütfen tekrar deneyin.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [
    clientEmail,
    clientName,
    cwid,
    namespace,
    phone_number,
    security_token,
    initialChatToken,
    initialChatKey,
    onChatStarted,
    memberId,
    transaction,
  ]);

  const connectWebSocket = useCallback(() => {
    try {
      const socketUrl = `wss://chatserver.alo-tech.com/ws/${activeChatKey}/${chatToken}`;
      const socket = new WebSocket(socketUrl);

      socket.onopen = () => {
        console.log('WebSocket connected');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'setting' && data.text === 'queued') {
            // Müşteri temsilcisi mesajı kuyrukta (Müşteri temsilcisi mesajı kuyrukta)
            //Burada bir şey yapılmayacak şu anda
          } else if (data.type === 'agent_accept' && data.text === 'answered') {
            // Müşteri temsilcisi mesajı kuyruktan çıktı (Müşteri temsilcisi mesajı kuyruktan çıktı)
            //Burada bir şey yapılmayacak şu anda
          } else if (data.type === 'typing') {
            // Müşteri temsilcisi mesajı yazıyor (Müşteri temsilcisi mesajı yazıyor)
            // setIsTyping(true);
            // Clear existing timeout if there is one
            // if (typingTimeoutRef.current) {
            //   clearTimeout(typingTimeoutRef.current);
            // }
            // // Set new timeout to reset typing status after 3 seconds
            // typingTimeoutRef.current = setTimeout(() => {
            //   setIsTyping(false);
            // }, 3000);
          } else if (
            data.type === 'text' &&
            data.type !== 'system' &&
            data.text.length > 0
          ) {
            //Müşteri temsilcisi mesaj gönderdi
            handleNewMessageFormat(data);
            // When message is received, typing is done
            // setIsTyping(false);

            // Clear typing timeout if it exists
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = null;
            }
            // setIsTyping(false);
          } else if (data.type === 'end') {
            // setIsTyping(false);

            // Müşteri temsilcisi mesajı sonlandı (Müşteri temsilcisi mesajı sonlandı)
            //Burada bir şey yapılmayacak şu anda
            setChatEnded(true);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect if chat isn't ended
        if (!chatEnded) {
          setTimeout(() => {
            if (!chatEnded && chatToken && activeChatKey) {
              connectWebSocket();
            }
          }, 3000); // Reconnect after 3 seconds
        }
      };

      socketRef.current = socket;
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }, [activeChatKey, chatToken, chatEnded]);

  useEffect(() => {
    initializeChat().then(() => {
      // Scroll to bottom after chat is initialized and messages are loaded
      scrollToBottom();
    });

    return () => {
      // Clean up WebSocket connection when component unmounts
      if (socketRef.current) {
        socketRef.current.close();
      }
      // Clean up typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [initializeChat, scrollToBottom]);

  // Connect to WebSocket when we have token and activeChatKey
  useEffect(() => {
    if (chatToken && activeChatKey && !socketRef.current) {
      connectWebSocket();
    }
  }, [chatToken, activeChatKey, connectWebSocket]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300); // Increased timeout to ensure render completes
    }
  }, [messages]);

  const handleNewMessageFormat = (data: any) => {
    // Handle message format with sender, date, time, text, etc.
    const isSupportMessage = data.sender !== 'client';

    const formattedTimestamp =
      data.insert_date && data.insert_date.date && data.insert_date.time
        ? `${data.insert_date.date} ${data.insert_date.time}`
        : new Date().toISOString();

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: currentMessages.length + 1,
        from: isSupportMessage ? 'support' : 'user',
        message: data.text || '',
        status: 'sent',
        timestamp: formattedTimestamp,
        sender_name: isSupportMessage
          ? data.name || data.nickname || 'Support'
          : 'You',
        avatar: data.avatar || undefined,
        msg_id: data.msg_id,
      },
    ]);
  };

  const sendMessage = async () => {
    if (inputMessage.trim() === '' || !chatToken || chatEnded) return;

    const newMessage = {
      id: messages.length + 1,
      from: 'user',
      message: inputMessage,
      status: 'sending' as const,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    const msgText = inputMessage;
    setInputMessage('');

    try {
      // Fallback to HTTP if WebSocket is not available
      const response = await axios.post(
        'https://chatserver.alo-tech.com/chat-api/put_message',
        {
          token: chatToken,
          message_body: msgText,
        }
      );

      if (response.data.success) {
        // Update message status to sent
        setMessages((currentMessages) =>
          currentMessages.map((msg) =>
            msg.id === newMessage.id
              ? { ...msg, status: 'sent', msg_id: response.data.msg_id }
              : msg
          )
        );
      } else {
        // Handle failure
        setMessages((currentMessages) =>
          currentMessages.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: 'failed' } : msg
          )
        );
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Update message status to failed
      setMessages((currentMessages) =>
        currentMessages.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'failed' } : msg
        )
      );
    }
  };

  const retryMessage = async (message: MessageType) => {
    // Mark message as sending again
    setMessages((currentMessages) =>
      currentMessages.map((msg) =>
        msg.id === message.id ? { ...msg, status: 'sending' as const } : msg
      )
    );

    try {
      // Try WebSocket first if connected
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(
          JSON.stringify({
            type: 'message',
            message_body: message.message,
          })
        );

        // Optimistically mark as sent
        setMessages((currentMessages) =>
          currentMessages.map((msg) =>
            msg.id === message.id ? { ...msg, status: 'sent' as const } : msg
          )
        );
        return;
      }

      // Fallback to HTTP
      const response = await axios.post(
        'https://chatserver.alo-tech.com/chat-api/put_message',
        {
          token: chatToken,
          message_body: message.message,
        }
      );

      if (response.data.success) {
        // Update message status to sent
        setMessages((currentMessages) =>
          currentMessages.map((msg) =>
            msg.id === message.id
              ? {
                  ...msg,
                  status: 'sent' as const,
                  msg_id: response.data.msg_id,
                }
              : msg
          )
        );
      } else {
        // Still failed
        setMessages((currentMessages) =>
          currentMessages.map((msg) =>
            msg.id === message.id ? { ...msg, status: 'failed' as const } : msg
          )
        );
      }
    } catch (error) {
      console.error('Failed to retry sending message:', error);
      // Update message status to failed again
      setMessages((currentMessages) =>
        currentMessages.map((msg) =>
          msg.id === message.id ? { ...msg, status: 'failed' as const } : msg
        )
      );
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme: isDark ? darkTheme : lightTheme, isDark, toggleTheme }}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: safeAreaTop,
            paddingBottom: keyboardHeight > 0 ? 0 : safeAreaBottom,
          },
        ]}
      >
        {/* Header */}
        {customHeader ? (
          customHeader
        ) : (
          <Header
            chatEnded={chatEnded}
            setChatEnded={setChatEnded}
            chatToken={chatToken}
            setMessages={setMessages}
            loading={loading}
            onClose={onClose}
            chatRef={chatRef}
            onContinueLater={onContinueLater}
          />
        )}

        {/* Chat messages */}
        <ScrollView
          style={styles.messagesContainer}
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}
        >
          {messages.map((message) => {
            if (message.from === 'support') {
              return (
                <View key={message.id} style={styles.supportMessageContainer}>
                  <View style={styles.supportMessage}>
                    <Text style={styles.supportMessageText}>
                      {message.message}
                    </Text>
                  </View>
                </View>
              );
            }

            // const isLastMessage =
            //   message.id === Math.max(...messages.map((m) => m.id));

            return (
              <View key={message.id} style={styles.userMessageContainer}>
                <View style={styles.userMessage}>
                  <Text style={styles.userMessageText}>{message.message}</Text>
                </View>

                {message.status &&
                  (message.status === 'sent' ? null : (
                    <View style={styles.messageStatusContainer}>
                      <Text
                        style={[
                          styles.messageStatusText,
                          message.status === 'failed' &&
                            styles.messageStatusError,
                        ]}
                      >
                        {message.status === 'sending'
                          ? 'Gönderiliyor...'
                          : 'Gönderilemedi'}
                      </Text>
                      {message.status === 'failed' && (
                        <TouchableOpacity
                          style={styles.retryButton}
                          onPress={() => retryMessage(message)}
                        >
                          <Text style={styles.retryButtonText}>
                            Tekrar Dene
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
              </View>
            );
          })}

          {/* Typing indicator */}
          {/* {isTyping && (
          <View style={styles.supportMessageContainer}>
            <Text style={styles.supportMessage}>Yazıyor...</Text>
          </View>
        )} */}
        </ScrollView>

        {/* Message input */}
        <View style={{ marginBottom: keyboardHeight }}>
          <InputBox
            chatEnded={chatEnded}
            loading={loading}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            sendMessage={sendMessage}
          />
        </View>
      </View>
    </ThemeContext.Provider>
  );
};

export default function AloChatScreen(props: AloChatScreenProps) {
  return <AloChatContent {...props} />;
}
