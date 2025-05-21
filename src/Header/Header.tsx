import React, { useEffect, useCallback, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Alert,
  Modal,
  Image,
} from 'react-native';
import CloseIcon from '../CloseIcon';
import { createStyles } from '../styles';
import { createPopupStyles } from '../theme/styles';
import { useTheme, type MessageType } from '../index';
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
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);
  const popupStyles = createPopupStyles(theme);

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
    // setChatEnded(true);
    // axios.post('https://chatserver.alo-tech.com/chat-api/end', {
    //   token: chatToken,
    // });

    // setMessages((prevMessages) => [
    //   ...prevMessages,
    //   {
    //     id: prevMessages.length + 1,
    //     from: 'support',
    //     message: 'Görüşme sonlandırılmıştır.',
    //   },
    // ]);
    onClose?.();
  }, [chatToken, setChatEnded, setMessages, onClose]);

  useEffect(() => {
    if (chatRef?.current) {
      chatRef.current.endChat = endChat;
    }
  }, [chatRef, endChat]);

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.profileIcon}>
          {!isDark ? (
            <Image
              source={require('../Support.png')}
              style={{
                width: 30,
                height: 30,
              }}
            />
          ) : (
            <Image
              source={require('../SupportWhite.png')}
              style={{
                width: 30,
                height: 30,
              }}
            />
          )}
        </View>
        <View>
          <Text style={styles.headerTitle}>Canlı Destek</Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 4,
            }}
          >
            <View
              style={{
                backgroundColor: loading
                  ? '#FFB900'
                  : chatEnded
                    ? '#ADB5BD'
                    : '#37B24D',
                width: 8,
                height: 8,
                borderRadius: 100,
                marginRight: 5,
              }}
            ></View>
            <Text
              style={{
                color: theme.text,
                fontSize: 12,
              }}
            >
              {loading
                ? 'Bağlanıyor...'
                : chatEnded
                  ? 'Çevrimdışı'
                  : 'Çevrimiçi'}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#4285F4' }}
          thumbColor={isDark ? '#f5dd4b' : '#f4f3f4'}
          style={{ marginRight: 10 }}
        /> */}
        <TouchableOpacity onPress={handleEndChatConfirmation}>
          <CloseIcon color={theme.text} />
        </TouchableOpacity>
      </View>

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
