export type ThemeColors = {
  background: string;
  text: string;
  textSecondary: string;
  primary: string;
  inputBackground: string;
  supportMessageBackground: string;
  supportMessageText: string;
  userMessageBackground: string;
  userMessageText: string;
  modalBackground: string;
  headerBackground: string;
  borderColor: string;
  disabledBackground: string;
  disabledText: string;
  retryButtonBackground: string;
  retryButtonText: string;
  error: string;
};

export const lightTheme: ThemeColors = {
  background: '#fff',
  text: '#333',
  textSecondary: '#999',
  primary: '#1E64FF',
  inputBackground: '#F0F0F0',
  supportMessageBackground: '#F8F9FA',
  supportMessageText: '#333',
  userMessageBackground: '#1E64FF',
  userMessageText: '#ffffff',
  modalBackground: '#ffffff',
  headerBackground: '#ffffff',
  borderColor: '#E0E0E0',
  disabledBackground: '#ADB5BD',
  disabledText: '#999',
  retryButtonBackground: '#ff4444',
  retryButtonText: '#ffffff',
  error: '#ff4444',
};

export const darkTheme: ThemeColors = {
  background: '#121212',
  text: '#E0E0E0',
  textSecondary: '#9E9E9E',
  primary: '#4285F4',
  inputBackground: 'transparent',
  supportMessageBackground: '#343A40',
  supportMessageText: '#E0E0E0',
  userMessageBackground: '#1E64FF',
  userMessageText: '#ffffff',
  modalBackground: '#1E1E1E',
  headerBackground: '#1E1E1E',
  borderColor: '#333333',
  disabledBackground: '#555555',
  disabledText: '#9E9E9E',
  retryButtonBackground: '#CF6679',
  retryButtonText: '#121212',
  error: '#CF6679',
};
