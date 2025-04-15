// CloseIcon.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  /** Square side in px */
  size?: number;
  /** Line colour */
  color?: string;
  /** Line thickness */
  thickness?: number;
};

const CloseIcon: React.FC<Props> = ({
  size = 24,
  color = '#000',
  thickness = 2,
}) => (
  <View style={[styles.box, { width: size, height: size }]}>
    {/* \ line */}
    <View
      style={[
        styles.line,
        {
          backgroundColor: color,
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
          backgroundColor: color,
          height: thickness,
          transform: [{ rotate: '-45deg' }],
        },
      ]}
    />
  </View>
);

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
