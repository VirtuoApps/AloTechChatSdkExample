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
import ChatScreen, { type ChatRefType } from '@lepuz/alotech-chat-sdk';

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
      chatRef={chatRef}
      onClose={() => console.log('Chat closed')}
      onChatStarted={(info) => console.log('Chat started:', info)}
      onContinueLater={() => console.log('User chose to continue chat later')}  {/* NEW */}
    />
  );
};

export default App;
```

> **Tip:** To end the conversation programmatically, call `chatRef.current?.endChat()`.
> This method both closes the UI **and** notifies the AloTech API.
> Manually doing `chatRef.current?.setChatEnded(true)` is possible but **not recommended**.

## Props Reference

| Prop               | Type                           | Required | Description                                                                           |
| ------------------ | ------------------------------ | -------- | ------------------------------------------------------------------------------------- |
| `clientEmail`      | `string`                       | Yes      | End‑user’s email.                                                                     |
| `clientName`       | `string`                       | Yes      | End‑user’s full name.                                                                 |
| `cwid`             | `string`                       | Yes      | Company/workspace ID provided by AloTech.                                             |
| `namespace`        | `string`                       | Yes      | Chat namespace / tenant identifier.                                                   |
| `phone_number`     | `string`                       | No       | User’s phone in E.164 format.                                                         |
| `security_token`   | `string`                       | Yes      | Token for authenticating the session.                                                 |
| `chatRef`          | `React.RefObject<ChatRefType>` | No       | **New.** Exposes imperative methods & state (see *Chat Ref API*).                     |
| `customHeader`     | `ReactElement`                 | No       | Override the default header UI.                                                       |
| `onClose`          | `( ) ⇒ void`                   | No       | Fired when the user closes the screen.                                                |
| `initialChatToken` | `string`                       | No       | Resume token for an existing chat.                                                    |
| `initialChatKey`   | `string`                       | No       | Resume key for an existing chat.                                                      |
| `onChatStarted`    | `(info: ChatInfo) ⇒ void`      | No       | Fired after a fresh chat is created.                                                  |
| `onContinueLater`  | `( ) ⇒ void`                   | No       | **New.** Fired when the user chooses to continue the chat later instead of ending it. |

### Chat Ref API

When you pass **chatRef**, the SDK sets the following fields on `chatRef.current`:

| Field / Method            | Type / Signature         | Purpose                                                                      |
| ------------------------- | ------------------------ | ---------------------------------------------------------------------------- |
| `endChat()`               | `() ⇒ void`              | Closes the chat *and* notifies AloTech. Preferred over manual state changes. |
| `messages`                | `MessageType[]`          | Current list of messages.                                                    |
| `setMessages(messages)`   | `(MessageType[]) ⇒ void` | Replace the message list.                                                    |
| `chatEnded`               | `boolean`                | `true` if the chat is closed.                                                |
| `setChatEnded(chatEnded)` | `(boolean) ⇒ void`       | Manually flag chat as ended (avoid; use `endChat()`).                        |
| `loading`                 | `boolean`                | `true` while the SDK is starting / reconnecting.                             |
| `setLoading(loading)`     | `(boolean) ⇒ void`       | Force‑set the loading state (rarely needed).                                 |

---

## Features

**AloTech Chat SDK** comes with several useful features out-of-the-box:

* **WebSocket-based real-time messaging:** Uses WebSocket connections for instant, bi-directional communication.
* **Message retry mechanism:** Built-in retry logic for reliable message delivery.
* **Chat queue & typing indicators:** Supports queuing chats, waiting indicators, and agent typing indicators.
* **Customizable header and interface:** Match your app’s branding with customizable headers and styles.
* **End-of-chat handling and clean-up:** Properly closes and cleans up after chat sessions.
* **Continue later handling:** Allows users to opt to continue the chat later, giving you control over related user experience flows.
