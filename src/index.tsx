import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { styles } from './styles';
import Header from './Header/Header';
import InputBox from './InputBox/InputBox';

type AloChatScreenProps = {
  clientEmail: string;
  clientName: string;
  cwid: string;
  namespace: string;
  phone_number: string;
  security_token: string;
  customHeader?: React.ReactNode;
  onClose?: () => void;
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

export default function AloChatScreen({
  clientEmail,
  clientName,
  cwid,
  namespace,
  phone_number,
  security_token,
  customHeader,
  onClose,
}: AloChatScreenProps) {
  const [loading, setLoading] = useState(true);
  const [chatToken, setChatToken] = useState('');
  const [activeChatKey, setActiveChatKey] = useState('');
  const [chatEnded, setChatEnded] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initializeChat = useCallback(async () => {
    try {
      const response = await axios.post(
        'https://chatserver.alo-tech.com/chat-api/new',
        {
          client_email: clientEmail,
          client_name: clientName,
          cwid: cwid,
          namespace: namespace,
          phone_number: phone_number,
          security_token: security_token,
        }
      );

      if (response.data.success) {
        setChatToken(response.data.token);
        setActiveChatKey(response.data.active_chat_key);
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
  }, [clientEmail, clientName, cwid, namespace, phone_number, security_token]);

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

          console.log({
            data,
          });

          if (data.type === 'setting' && data.text === 'queued') {
            // Müşteri temsilcisi mesajı kuyrukta (Müşteri temsilcisi mesajı kuyrukta)
            //Burada bir şey yapılmayacak şu anda
          } else if (data.type === 'agent_accept' && data.text === 'answered') {
            // Müşteri temsilcisi mesajı kuyruktan çıktı (Müşteri temsilcisi mesajı kuyruktan çıktı)
            //Burada bir şey yapılmayacak şu anda
          } else if (data.type === 'typing') {
            // Müşteri temsilcisi mesajı yazıyor (Müşteri temsilcisi mesajı yazıyor)
            setIsTyping(true);

            // Clear existing timeout if there is one
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }

            // Set new timeout to reset typing status after 3 seconds
            typingTimeoutRef.current = setTimeout(() => {
              setIsTyping(false);
            }, 3000);
          } else if (data.type === 'text' && data.text.length > 0) {
            //TODO: Müşteri temsilcisi mesaj gönderdi
            handleNewMessageFormat(data);
            // When message is received, typing is done
            setIsTyping(false);

            // Clear typing timeout if it exists
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = null;
            }
          } else if (data.type === 'end') {
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
    initializeChat();

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
  }, [initializeChat]);

  // Connect to WebSocket when we have token and activeChatKey
  useEffect(() => {
    if (chatToken && activeChatKey && !socketRef.current) {
      connectWebSocket();
    }
  }, [chatToken, activeChatKey, connectWebSocket]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleNewMessageFormat = (data: any) => {
    // Handle _NewMessage format with sender, date, time, text, etc.
    const isSupportMessage = data.sender !== 'client';

    const formattedTimestamp =
      data.date && data.time
        ? `${data.date} ${data.time}`
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
    <SafeAreaView style={styles.container}>
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
                {message.sender_name && (
                  <Text style={styles.messageSenderName}>
                    {message.sender_name}
                  </Text>
                )}
                <Text style={styles.supportMessage}>{message.message}</Text>
              </View>
            );
          }

          const isLastMessage =
            message.id === Math.max(...messages.map((m) => m.id));

          return (
            <View key={message.id} style={styles.userMessageContainer}>
              <Text style={styles.userMessage}>{message.message}</Text>

              {message.status &&
                (message.status === 'sent' ? (
                  // Only show "Gönderildi" for the last message with 'sent' status
                  isLastMessage ? (
                    <View style={styles.messageStatusContainer}>
                      <Text style={styles.messageStatusText}>Gönderildi</Text>
                    </View>
                  ) : null
                ) : (
                  // Always show status for 'sending' or 'failed' messages
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
                        <Text style={styles.retryButtonText}>Tekrar Dene</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
            </View>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <View style={styles.supportMessageContainer}>
            <Text style={styles.supportMessage}>Yazıyor...</Text>
          </View>
        )}
      </ScrollView>

      {/* Message input */}
      <InputBox
        chatEnded={chatEnded}
        loading={loading}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={sendMessage}
      />
    </SafeAreaView>
  );
}
