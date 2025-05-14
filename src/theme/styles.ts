import { StyleSheet } from 'react-native';
import type { ThemeColors } from './theme';

export const createPopupStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      backgroundColor: theme.modalBackground,
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.text,
    },
    option: {
      width: '100%',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
      alignItems: 'center',
    },
    optionText: {
      fontSize: 16,
      color: theme.text,
    },
  });
