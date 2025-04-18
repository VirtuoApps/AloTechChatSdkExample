import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { styles } from '../styles';

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
          style={[styles.input, chatEnded && styles.disabledInput]}
          placeholder={
            chatEnded ? 'Görüşme sonlandırılmıştır' : 'Mesajınızı yazın...'
          }
          placeholderTextColor={chatEnded ? '#999' : '#999'}
          value={inputMessage}
          onChangeText={setInputMessage}
          editable={!loading && !chatEnded}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (loading || chatEnded) && styles.disabledButton,
          ]}
          onPress={sendMessage}
          disabled={loading || chatEnded}
        >
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
