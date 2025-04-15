import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E1E1E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  profileIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#67AB4C',
  },
  closeButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  supportMessageContainer: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  supportMessage: {
    backgroundColor: '#eee',

    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 5,
    maxWidth: '80%',
    color: '#333',
    fontSize: 14,
    marginBottom: 8,
  },
  messageStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportName: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 5,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: '#1877F2',
    color: 'white',
    padding: 12,
    borderRadius: 18,
    borderBottomRightRadius: 5,
    maxWidth: '80%',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#1877F2',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#B0C4DE',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageStatusText: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
    marginRight: 4,
  },
  messageStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  retryButton: {
    marginLeft: 8,
    padding: 4,
    backgroundColor: '#ff4444',
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 10,
  },
  messageStatusError: {
    color: '#ff4444',
  },
  disabledInput: {
    backgroundColor: '#E5E5E5',
    color: '#999',
  },
});
