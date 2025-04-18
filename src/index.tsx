import React, { useState, useEffect } from 'react';
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
  initialMessage?: string;
  onClose?: () => void;
};

export interface MessageType {
  id: number;
  from: string;
  message: string;
  status?: 'sending' | 'sent' | 'failed';
  msg_id?: string;
}

export default function AloChatScreen({
  clientEmail,
  clientName,
  cwid,
  namespace,
  phone_number,
  security_token,
  customHeader,
  initialMessage = 'Hoşgeldiniz. Sizi müşteri temsilcisine aktarıyorum.',
  onClose,
}: AloChatScreenProps) {
  const [loading, setLoading] = useState(true);
  const [chatToken, setChatToken] = useState('');
  const [chatEnded, setChatEnded] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const initializeChat = async () => {
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
        // setActiveChatKey(response.data.active_chat_key);
        setMessages([
          {
            id: 1,
            from: 'support',
            message: initialMessage,
          },
        ]);
      }
    } catch (error) {
      console.error('Chat initialization failed:', error);
      setMessages([
        {
          id: 1,
          from: 'support',
          message: 'Bağlantı sağlanamadı. Lütfen tekrar deneyin.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (inputMessage.trim() === '' || !chatToken || chatEnded) return;

    const newMessage = {
      id: messages.length + 1,
      from: 'user',
      message: inputMessage,
      status: 'sending' as const,
    };

    setMessages([...messages, newMessage]);
    const msgText = inputMessage;
    setInputMessage('');

    try {
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
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {messages.map((message) => {
          if (message.from == 'support') {
            return (
              <View key={message.id} style={styles.supportMessageContainer}>
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
