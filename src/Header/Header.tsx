import React, { useEffect, useCallback } from 'react';
import { TouchableOpacity, View, Text, Alert } from 'react-native';
import CloseIcon from '../../example/src/CloseIcon';
import { styles } from '../styles';
import type { MessageType } from 'alo-chat-sdk';
import axios from 'axios';

type HeaderProps = {
  chatEnded: boolean;
  setChatEnded: (chatEnded: boolean) => void;
  chatToken: string;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  loading: boolean;
  onClose?: () => void;
  chatRef?: React.RefObject<any>;
};

export default function Header({
  chatEnded,
  setChatEnded,
  chatToken,
  setMessages,
  loading,
  onClose,
  chatRef,
}: HeaderProps) {
  const handleClosePress = () => {
    if (chatEnded) return;

    Alert.alert(
      'Konuşmayı Sonlandır',
      'Konuşmayı sonlandırmak istediğinize emin misiniz?',
      [
        {
          text: 'Hayır',
          style: 'cancel',
        },
        {
          text: 'Evet',
          onPress: endChat,
        },
      ]
    );
  };

  const endChat = useCallback(async () => {
    try {
      setChatEnded(true);
      await axios.post('https://chatserver.alo-tech.com/chat-api/end', {
        token: chatToken,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          from: 'support',
          message: 'Görüşme sonlandırılmıştır.',
        },
      ]);
      onClose?.();
    } catch (error) {
      console.error('Failed to end chat:', error);
      Alert.alert(
        'Hata',
        'Görüşme sonlandırılırken bir hata oluştu, lütfen tekrar deneyin.'
      );
    }
  }, [chatToken, setChatEnded, setMessages, onClose]);

  useEffect(() => {
    if (chatRef?.current) {
      chatRef.current.endChat = endChat;
    }
  }, [chatRef, endChat]);

  const getSubtitleStyle = useCallback(() => {
    return [styles.headerSubtitle, { color: chatEnded ? 'red' : 'green' }];
  }, [chatEnded]);

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.profileIcon}>
          <Text style={styles.profileIconText}>CD</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Canlı Destek</Text>
          <Text style={getSubtitleStyle()}>
            {loading ? 'Bağlanıyor...' : chatEnded ? 'Çevrimdışı' : 'Çevrimiçi'}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleClosePress}>
        <CloseIcon />
      </TouchableOpacity>
    </View>
  );
}
