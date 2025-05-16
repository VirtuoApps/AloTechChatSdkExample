import React from 'react';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { createStyles } from '../styles';
import { useTheme } from '../index';

type InputBoxProps = {
  chatEnded: boolean;
  loading: boolean;
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
};

export default function InputBox({
  chatEnded,
  loading,
  inputMessage,
  setInputMessage,
  sendMessage,
}: InputBoxProps) {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);

  let extraStyles: any = {};

  if (isDark) {
    extraStyles = {
      borderWidth: 1,
      borderColor: '#343A40',
    };
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.inputContainer}
    >
      <View
        style={{
          marginBottom: 10,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TextInput
          style={[styles.input, chatEnded && styles.disabledInput, extraStyles]}
          placeholder={
            chatEnded ? 'Görüşme sonlandırılmıştır' : 'Mesajınızı yazın...'
          }
          placeholderTextColor={
            chatEnded ? theme.disabledText : theme.textSecondary
          }
          value={inputMessage}
          onChangeText={setInputMessage}
          editable={!loading && !chatEnded}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (loading || chatEnded || inputMessage.length === 0) &&
              styles.disabledButton,
          ]}
          onPress={sendMessage}
          disabled={loading || chatEnded || inputMessage.length === 0}
        >
          <Image
            source={require('../DirectionArrow.png')}
            style={{
              width: 20,
              height: 20,
              tintColor: theme.userMessageText,
            }}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
