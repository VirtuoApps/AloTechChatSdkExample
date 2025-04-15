import ChatScreen from 'alo-chat-sdk';
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <ChatScreen
      clientEmail="test1@test.com"
      clientName="Test 1 Test 1"
      cwid="ahRzfm11c3RlcmktaGl6bWV0bGVyaXIYCxILQ2hhdFdpZGdldHMYgIDK8K7WmQkMogESYXBwaWMuYWxvLXRlY2guY29t"
      namespace="appic.alo-tech.com"
      phone_number="5398292555"
      security_token="bb0d744673c8fdfbd6e3397da9560212c517308fb3338f3a9edc075fba875181"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
