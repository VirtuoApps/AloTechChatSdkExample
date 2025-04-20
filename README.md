# AloTech Chat SDK for React Native

AloTech Chat SDK for React Native is a plug-and-play live chat component that connects users of your mobile app with customer support in real-time. It provides a streamlined way to embed a customer support chat interface into your React Native application, letting you focus on your app's user experience while the SDK handles the messaging backend.

## Installation

Install the package via npm or yarn:

```sh
npm install alotech-chat-sdk
# or, using Yarn:
yarn add alotech-chat-sdk
```

**Peer Dependencies:** Make sure you have the following libraries installed in your project (if not, install them as well):
- `axios` – used for performing HTTP requests (e.g., to fetch chat tokens or send messages through REST if needed).
- WebSocket support – React Native has a built-in WebSocket API. If your environment requires it, you can use a library like `react-native-websocket` for more advanced WebSocket support.

After installing the package (and any peer dependencies), if you're on iOS, navigate to the ios directory and run `pod install` to link native dependencies:

```sh
cd ios && pod install
```

## Usage

Once installed, you can import the `ChatScreen` component from the AloTech SDK and use it in your app. Typically, you would render `<ChatScreen />` as a full-screen component (for example, as a screen in your navigation stack or a modal). Here's a minimal example:

```jsx
import React from 'react';
import ChatScreen from 'alotech-chat-sdk';

const App = () => {
  return (
    <ChatScreen
      clientEmail="john.doe@example.com"
      clientName="John Doe"
      cwid="YOUR_CWID"
      namespace="YOUR_NAMESPACE"
      phone_number="+1234567890"
      security_token="YOUR_SECURITY_TOKEN"
      customHeader={<MyCustomHeader />}
      onClose={() => console.log('Chat closed')}
      onChatStarted={(chatInfo) => console.log('Chat started:', chatInfo)}
    />
  );
};

export default App;
```

In the example above, replace `"YOUR_CWID"`, `"YOUR_NAMESPACE"`, and `"YOUR_SECURITY_TOKEN"` with the actual credentials provided by AloTech for your chat service. These values (`cwid`, `namespace`, and `security_token`) are required to authenticate and connect the chat session to the correct account/instance on AloTech's platform. The `clientEmail`, `clientName`, and `phone_number` props provide the end-user's contact info, which will be visible to the support agents (allowing them to know who is contacting support).

The minimum required props to start a chat are typically **clientEmail**, **clientName**, **cwid**, **namespace**, and **security_token**. The phone number is optional, but providing it can be helpful for identification or follow-up. In the example, we also passed a `customHeader` component to override the default header (which by default might show a title like "Live Chat" and a close button). If you don't provide a customHeader, the SDK will display its own default header UI. We also passed an `onClose` callback – this function will be called when the user closes the chat screen (for example, by tapping a close button in the header). You can use `onClose` to perform any cleanup or navigation (e.g., go back to a previous screen).

The `onChatStarted` callback in the example will be invoked when a new chat session is successfully initiated. It provides chat session details (for instance, a chat token or ID) via its argument. You can use this information to keep track of the chat session. If you want to resume a chat later (say, the user comes back to support chat after closing the app), you can store the session's token/key from `onChatStarted` and then pass those values to `initialChatToken` and `initialChatKey` in `<ChatScreen />`. Providing `initialChatToken` and `initialChatKey` as props will tell the SDK to attempt to continue the existing chat session instead of starting a new one.

## Props Reference

Below is a reference table for the props accepted by the `<ChatScreen />` component:

| Prop               | Type          | Required | Description                                                                                                                                                                                                                                                                                   |
| ------------------ | ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clientEmail`      | `string`      | Yes      | The email address of the client (end-user) who is initiating the chat. This is used to identify the user in the support system and may be visible to support agents.                                                                                                                           |
| `clientName`       | `string`      | Yes      | The full name of the client/user. This is used for greeting the user in the chat and for the support agent to address the user properly.                                                                                                                                                       |
| `cwid`             | `string`      | Yes      | The company or workspace identifier for your AloTech account. This ID (provided by AloTech) tells the SDK which company’s chat queue and agents to connect with.                                                                                                                               |
| `namespace`        | `string`      | Yes      | The chat namespace or environment identifier. This is provided by AloTech and helps route the chat to the correct context (similar to a project or tenant identifier within AloTech's system).                                                                                                 |
| `phone_number`     | `string`      | No       | The phone number of the client (in international format, e.g. "+1234567890"). This is optional, but if provided, it gives support agents additional context about the user (and a possible alternate contact method).                                                                           |
| `security_token`   | `string`      | Yes      | A security token used to authenticate the chat session with AloTech. This token ensures the chat is authorized and secure. You typically obtain this token from AloTech's system (for example, via an API call or provided configuration) before initializing the chat.                         |
| `customHeader`     | `ReactElement`| No       | A custom React element to use as the header of the chat screen. Use this if you want to override the default header (for example, to use your app's branding, add custom buttons, or change the style). If not provided, a default header (with a title and a close button) will be shown.       |
| `onClose`          | `function`    | No       | Callback function invoked when the chat is closed by the user. For instance, if the user taps a close button (either on the default header or your custom header), this function will run. You can use it to perform actions like navigating away from the chat screen or resetting state.        |
| `initialChatToken` | `string`      | No       | Token for an existing chat session to resume. If you have previously started a chat and saved its token, provide it here to reconnect to that session. Must be used in combination with `initialChatKey`. If not provided, a new chat session will be started.                                    |
| `initialChatKey`   | `string`      | No       | Key (identifier) for an existing chat session to resume. Provide the chat session's key along with the token to reopen that session. If not provided, a new chat session will be started.                                                                                                       |
| `onChatStarted`    | `function`    | No       | Callback function invoked when a new chat session is successfully created/started. The function receives the chat session details (such as a chat ID or token) as its argument. This is useful for logging or storing the session info in order to resume the chat later if needed.            |

## Features

**AloTech Chat SDK** comes with several useful features out-of-the-box:

- **WebSocket-based real-time messaging:** Uses WebSocket connections for instant, bi-directional communication. Messages sent by the user appear immediately in the chat, and incoming messages from the support agent are received in real-time with minimal latency.
- **Message retry mechanism:** Built-in retry logic for message delivery. If a message fails to send due to network issues, the SDK will automatically retry sending it, improving reliability even on unstable connections.
- **Chat queue & typing indicators:** Supports queuing new chats when all agents are busy. If the user is waiting, the chat can display a queue position or a waiting message. The SDK also shows a typing indicator when the support agent is typing a response, giving the user real-time feedback that someone is responding.
- **Customizable header and interface:** Allows customization of the chat interface to match your app’s branding. You can provide a custom header component (with your own styling or buttons), and the look of chat messages/bubbles can be adjusted via theming or styling to fit your design guidelines.
- **End-of-chat handling and clean-up:** Properly handles the end of a chat session. When either the user or the agent ends the chat, the SDK will close the WebSocket connection and clean up any resources. The `onClose` callback allows your app to perform additional actions (like navigating the user away or showing a feedback form) once the conversation is over.


## Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you'd like to change.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.