// CloseIcon.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from './theme/ThemeContext';

type Props = {
  /** Square side in px */
  size?: number;
  /** Line colour */
  color?: string;
  /** Line thickness */
  thickness?: number;
};

const CloseIcon: React.FC<Props> = ({ size = 24, color, thickness = 2 }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.text;

  return (
    <View style={[styles.box, { width: size, height: size }]}>
      {/* \ line */}
      <View
        style={[
          styles.line,
          {
            backgroundColor: iconColor,
            height: thickness,
            transform: [{ rotate: '45deg' }],
          },
        ]}
      />
      {/* / line */}
      <View
        style={[
          styles.line,
          {
            backgroundColor: iconColor,
            height: thickness,
            transform: [{ rotate: '-45deg' }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    width: '100%',
    borderRadius: 1, // slightly rounded ends
  },
});

export default CloseIcon;
