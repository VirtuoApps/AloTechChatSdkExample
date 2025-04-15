# alo-chat-sdk

A **plug‑and‑play React Native component** that lets you drop a fully‑featured live‑chat window into your iOS or Android app in minutes.  
It handles the entire client side of an Alo‑Tech chat session – authentication, message delivery state, connection handling, and a clean, mobile‑first UI that feels native out of the box.

---

## ✨ Features

* **One‑line install & import** – ship live chat without rebuilding your UI
* **Graceful reconnect / end‑chat workflow** with confirmation alerts
* **Full TypeScript support** – all props and message objects are typed
* **Composable** – drop in your own header or style overrides when you need them

---

## 🛠 Installation

```bash
# with npm
npm install alo-chat-sdk axios

# or with Yarn
yarn add alo-chat-sdk axios
```

> **axios** is a peer dependency. If your project already uses it you can skip installing it again.

The component relies on the default React Native fonts and icons only – **no extra native modules** are required.

---

## ⚡️ Quick start

```tsx
import ChatScreen from 'alo-chat-sdk';

export default function App() {
  return (
    <ChatScreen
      clientEmail="test1@test.com"
      clientName="Test 1 Test 1"
      cwid="your_cwid"
      namespace="your.namespace.com"
      phone_number="123456789"
      security_token="your_security_token"
    />
  );
}
```

That’s it – run your app and you’ll see a live‑chat window that immediately connects to Alo‑Tech and sends the built‑in greeting message.

---

## 📑 Prop reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `clientEmail` | `string` | ✔︎ | End‑user’s e‑mail used by Alo‑Tech for identification. |
| `clientName` | `string` | ✔︎ | End‑user’s full name shown to the agent. |
| `cwid` | `string` | ✔︎ | Chat‑widget ID provided by Alo‑Tech dashboard. |
| `namespace` | `string` | ✔︎ | Namespace / sub‑domain of your Alo‑Tech instance. |
| `phone_number` | `string` | ✔︎ | User’s phone number (digits only). |
| `security_token` | `string` | ✔︎ | Server‑side token you create for secure access. |
| `customHeader` | `ReactNode` | – | Replace the built‑in header (title + status + close button) with your own component. |
| `initialMessage` | `string` | – | First message shown from support before the agent joins. *(Default: Turkish welcome text)* |
| `onClose` | `() => void` | – | Callback fired **after** the user confirms chat termination and the component calls `/chat-api/end`. |

### Message object shape

Every chat message is an object of type:

```ts
interface MessageType {
  id: number;          // Local incremental ID
  from: 'user' | 'support';
  message: string;     // UTF‑8 text
  status?: 'sending' | 'sent' | 'failed';
  msg_id?: string;     // Alo‑Tech server message id (available after send)
}
```

You never need to create these manually – the component handles it – but the type is exported in case you want to extend the UI.

---

## 🎨 Customisation

### 1. Provide your own header

```tsx
function MyHeader({ onClose }: { onClose?: () => void }) {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', padding: 16}}>
      <Text style={{fontWeight: '600', fontSize: 18}}>Support</Text>
      <Pressable onPress={onClose} style={{marginLeft: 'auto'}}>
        <CloseIcon />
      </Pressable>
    </View>
  );
}

<ChatScreen
  {...credentials}
  customHeader={<MyHeader />}
/>
```

### 2. Change colours & fonts

All UI primitives are rendered with React Native `View`, `Text`, and `TouchableOpacity`.  
Simply copy the component source (see `src/`) and tweak the `styles` object, or wrap the whole screen in your own container.

---

## 🔌 Endpoints used

| Purpose | Method & Path |
|---------|---------------|
| Create / resume chat | `POST https://chatserver.alo-tech.com/chat-api/new` |
| Send message | `POST https://chatserver.alo-tech.com/chat-api/put_message` |
| End chat | `POST https://chatserver.alo-tech.com/chat-api/end` |

All network calls are made with **axios** and automatically include the `token` returned from the first request.

---

## 🚦 Status & roadmap

The SDK is production‑ready and powers multiple apps in the wild. Planned additions:

* Push‑notification support (FCM / APNS) – *Q2 2025*
* File & image attachments
* Dark‑mode aware default theme

---

## 🤝 Contributing

1. Clone the repo
2. `yarn` to install dev dependencies
3. `yarn example ios` or `yarn example android` to run the Expo sample
4. Submit a PR – please follow the existing ESLint / Prettier rules

Bug reports and feature requests are welcome in the **Issues** tab.

---

## 📜 License

`alo-chat-sdk` is released under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

