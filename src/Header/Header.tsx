import React, { useEffect, useCallback, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import CloseIcon from '../CloseIcon';
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
  onContinueLater?: () => void;
};

export default function Header({
  chatEnded,
  setChatEnded,
  chatToken,
  setMessages,
  loading,
  onClose,
  chatRef,
  onContinueLater,
}: HeaderProps) {
  const [showPopup, setShowPopup] = useState(false);

  const handleClosePress = () => {
    if (chatEnded) return;
    setShowPopup(true);
  };

  const handleContinueLater = () => {
    setShowPopup(false);
    onContinueLater?.();
  };

  const handleEndChatConfirmation = () => {
    setShowPopup(false);
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

      <Modal
        visible={showPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={popupStyles.modalOverlay}>
          <View style={popupStyles.modalContent}>
            <TouchableOpacity
              style={popupStyles.option}
              onPress={handleEndChatConfirmation}
            >
              <Text style={popupStyles.optionText}>Konuşmayı Sonlandır</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={popupStyles.option}
              onPress={handleContinueLater}
            >
              <Text style={popupStyles.optionText}>Daha Sonra Devam Et</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={popupStyles.option}
              onPress={() => setShowPopup(false)}
            >
              <Text style={popupStyles.optionText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const popupStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
});
