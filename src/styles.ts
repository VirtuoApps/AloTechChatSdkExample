import { StyleSheet } from 'react-native';
import type { ThemeColors } from './theme/theme';

export const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    profileIconText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    headerSubtitle: {
      fontSize: 12,
      color: '#67AB4C',
    },
    closeButton: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textSecondary,
    },
    messagesContainer: {
      flex: 1,
      padding: 15,
      backgroundColor: theme.background,
    },
    supportMessageContainer: {
      marginBottom: 20,
      alignItems: 'flex-start',
    },
    supportMessage: {
      backgroundColor: theme.supportMessageBackground,
      padding: 12,
      borderRadius: 18,
      borderTopLeftRadius: 5,
      maxWidth: '80%',
      color: theme.supportMessageText,
      fontSize: 14,
      marginBottom: 8,
    },
    messageStatus: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    supportName: {
      fontSize: 14,
      color: theme.text,
      marginTop: 5,
      backgroundColor: theme.supportMessageBackground,
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
      backgroundColor: theme.userMessageBackground,
      color: theme.userMessageText,
      padding: 12,
      borderRadius: 18,
      borderBottomRightRadius: 5,
      maxWidth: '80%',
      fontSize: 14,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 10,
      marginBottom: 20,
    },
    input: {
      flex: 1,
      backgroundColor: theme.inputBackground,
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 15,
      marginRight: 10,
      fontSize: 14,
      color: theme.text,
    },
    sendButton: {
      backgroundColor: theme.primary,
      width: 40,
      height: 40,
      borderRadius: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    disabledButton: {
      backgroundColor: theme.disabledBackground,
    },
    sendButtonText: {
      color: theme.userMessageText,
      fontWeight: 'bold',
    },
    messageStatusText: {
      fontSize: 12,
      color: theme.textSecondary,
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
      backgroundColor: theme.retryButtonBackground,
      borderRadius: 4,
    },
    retryButtonText: {
      color: theme.retryButtonText,
      fontSize: 10,
    },
    messageStatusError: {
      color: theme.error,
    },
    disabledInput: {
      backgroundColor: theme.disabledBackground,
      color: theme.disabledText,
    },
    messageSenderName: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.textSecondary,
      marginBottom: 4,
    },
    scrollViewContent: {
      flexGrow: 1,
    },
  });
