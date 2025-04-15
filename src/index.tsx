import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import CloseIcon from '../example/src/CloseIcon';
import axios from 'axios';

type AloChatScreenProps = {
  clientEmail: string;
  clientName: string;
  cwid: string;
  namespace: string;
  phone_number: string;
  security_token: string;
};

interface MessageType {
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
}: AloChatScreenProps) {
  const [loading, setLoading] = useState(true);
  const [chatToken, setChatToken] = useState('');
  const [activeChatKey, setActiveChatKey] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 1,
      from: 'support',
      message: 'Bağlantı sağlanıyor...',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);

  console.log({
    chatToken,
    activeChatKey,
  });

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
        setActiveChatKey(response.data.active_chat_key);
        setMessages([
          {
            id: 1,
            from: 'support',
            message: 'Hoşgeldiniz. Sizi müşteri temsilcisine aktarıyorum.',
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
    if (inputMessage.trim() === '' || !chatToken) return;

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
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>CD</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Canlı Destek</Text>
            <Text style={styles.headerSubtitle}>
              {loading ? 'Bağlanıyor...' : 'Çevrimiçi'}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <CloseIcon />
        </TouchableOpacity>
      </View>

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Mesajınızı yazın..."
          placeholderTextColor="#999"
          value={inputMessage}
          onChangeText={setInputMessage}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.disabledButton]}
          onPress={sendMessage}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E1E1E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  profileIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#67AB4C',
  },
  closeButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  supportMessageContainer: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  supportMessage: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 5,
    maxWidth: '80%',
    color: '#333',
    fontSize: 14,
    marginBottom: 8,
  },
  messageStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportName: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 5,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: '#1877F2',
    color: 'white',
    padding: 12,
    borderRadius: 18,
    borderBottomRightRadius: 5,
    maxWidth: '80%',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#1877F2',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#B0C4DE',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageStatusText: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
    marginRight: 4,
  },
  messageStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  retryButton: {
    marginLeft: 8,
    padding: 4,
    backgroundColor: '#ff4444',
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 10,
  },
  messageStatusError: {
    color: '#ff4444',
  },
});
