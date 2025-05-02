Aşağıda **chatRef** özelliğini ve ilişkili API’yi de içerecek şekilde güncellenmiş dökümantasyonun tam hâlini bulabilirsin. Tabloya yeni satır eklendi, *Usage* örneği güncellendi ve “Chat Ref API” başlıklı yeni bir bölüm eklendi. Dilersen doğrudan kopyalayıp README’nin yerini alabilirsin.

---

# AloTech Chat SDK for React Native

AloTech Chat SDK for React Native is a plug‑and‑play live‑chat component that connects users of your mobile app with customer support in real time. It lets you focus on your app’s UX while the SDK handles all messaging plumbing.

## Installation

```sh
npm install @lepuz/alotech-chat-sdk
# or
yarn add @lepuz/alotech-chat-sdk
```

For iOS, remember to link native deps:

```sh
cd ios && pod install
```

## Usage

```tsx
import React, { useRef } from 'react';
import ChatScreen, { type ChatRefType } from '@lepuz/alo-chat-sdk';

const App = () => {
  const chatRef = useRef<ChatRefType>({});

  return (
    <ChatScreen
      clientEmail="john.doe@example.com"
      clientName="John Doe"
      cwid="YOUR_CWID"
      namespace="YOUR_NAMESPACE"
      phone_number="+1234567890"
      security_token="YOUR_SECURITY_TOKEN"
      chatRef={chatRef}            {/* NEW */}
      onClose={() => console.log('Chat closed')}
      onChatStarted={(info) => console.log('Chat started:', info)}
    />
  );
};

export default App;
```

> **Tip:** To end the conversation programmatically, call `chatRef.current?.endChat()`.  
> This method both closes the UI **and** notifies the AloTech API.  
> Manually doing `chatRef.current?.setChatEnded(true)` is possible but **not recommended**.

## Props Reference

| Prop               | Type                                  | Required | Description |
| ------------------ | ------------------------------------- | -------- | ----------- |
| `clientEmail`      | `string`                              | Yes      | End‑user’s email. |
| `clientName`       | `string`                              | Yes      | End‑user’s full name. |
| `cwid`             | `string`                              | Yes      | Company/workspace ID provided by AloTech. |
| `namespace`        | `string`                              | Yes      | Chat namespace / tenant identifier. |
| `phone_number`     | `string`                              | No       | User’s phone in E.164 format. |
| `security_token`   | `string`                              | Yes      | Token for authenticating the session. |
| `chatRef`          | `React.RefObject<ChatRefType>`        | No       | **New.** Exposes imperative methods & state (see *Chat Ref API*). |
| `customHeader`     | `ReactElement`                        | No       | Override the default header UI. |
| `onClose`          | `( ) ⇒ void`                          | No       | Fired when the user closes the screen. |
| `initialChatToken` | `string`                              | No       | Resume token for an existing chat. |
| `initialChatKey`   | `string`                              | No       | Resume key for an existing chat. |
| `onChatStarted`    | `(info: ChatInfo) ⇒ void`             | No       | Fired after a fresh chat is created. |

### Chat Ref API

When you pass **chatRef**, the SDK sets the following fields on `chatRef.current`:

| Field / Method              | Type / Signature                      | Purpose |
| --------------------------- | ------------------------------------- | ------- |
| `endChat()`                 | `() ⇒ void`                           | Closes the chat *and* notifies AloTech. Preferred over manual state changes. |
| `messages`                  | `MessageType[]`                       | Current list of messages. |
| `setMessages(messages)`     | `(MessageType[]) ⇒ void`              | Replace the message list. |
| `chatEnded`                 | `boolean`                             | `true` if the chat is closed. |
| `setChatEnded(chatEnded)`   | `(boolean) ⇒ void`                    | Manually flag chat as ended (avoid; use `endChat()`). |
| `loading`                   | `boolean`                             | `true` while the SDK is starting / reconnecting. |
| `setLoading(loading)`       | `(boolean) ⇒ void`                    | Force‑set the loading state (rarely needed). |

---

## Features

**AloTech Chat SDK** comes with several useful features out-of-the-box:

- **WebSocket-based real-time messaging:** Uses WebSocket connections for instant, bi-directional communication. Messages sent by the user appear immediately in the chat, and incoming messages from the support agent are received in real-time with minimal latency.
- **Message retry mechanism:** Built-in retry logic for message delivery. If a message fails to send due to network issues, the SDK will automatically retry sending it, improving reliability even on unstable connections.
- **Chat queue & typing indicators:** Supports queuing new chats when all agents are busy. If the user is waiting, the chat can display a queue position or a waiting message. The SDK also shows a typing indicator when the support agent is typing a response, giving the user real-time feedback that someone is responding.
- **Customizable header and interface:** Allows customization of the chat interface to match your app’s branding. You can provide a custom header component (with your own styling or buttons), and the look of chat messages/bubbles can be adjusted via theming or styling to fit your design guidelines.
- **End-of-chat handling and clean-up:** Properly handles the end of a chat session. When either the user or the agent ends the chat, the SDK will close the WebSocket connection and clean up any resources. The `onClose` callback allows your app to perform additional actions (like navigating the user away or showing a feedback form) once the conversation is over.



