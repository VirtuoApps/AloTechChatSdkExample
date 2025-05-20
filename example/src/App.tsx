import { useRef } from 'react';
import ChatScreen, { type ChatRefType } from '../../src/index';

export default function App() {
  const chatRef = useRef<ChatRefType>({} as ChatRefType);

  const handleContinueLater = () => {
    console.log('Continue later');
  };

  return (
    <ChatScreen
      clientEmail="test1@test.com"
      clientName="Test 1 Test 1"
      cwid="ahRzfm11c3RlcmktaGl6bWV0bGVyaXIYCxILQ2hhdFdpZGdldHMYgIDK8K7WmQkMogESYXBwaWMuYWxvLXRlY2guY29t"
      namespace="appic.alo-tech.com"
      phone_number="5398292553"
      security_token="bb0d744673c8fdfbd6e3397da9560212c517308fb3338f3a9edc075fba875181"
      chatRef={chatRef}
      onContinueLater={handleContinueLater}
      memberId="1234567890"
      transaction="1234567890"
      initialTheme="light"
      client_custom_data={{
        user_id: '1234567890',
        user_name: 'Test User',
        user_email: 'test@test.com',
        user_phone: '5398292553',
      }}
    />
  );
}
