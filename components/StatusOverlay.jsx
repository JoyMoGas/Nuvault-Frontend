import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { CheckIcon } from './Icons';

export default function StatusOverlay({ visible, text = 'Copied', icon: Icon = CheckIcon, duration = 1000, onHide }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            if (onHide) onHide();
            setShouldRender(false); // desmonta después de la animación de salida
          });
        }, duration);
      });
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <Animated.View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.85)',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: anim,
        zIndex: 999,
      }}
      pointerEvents="none"
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
        <Text className="font-bold" style={{ color: '#10B981', fontSize: 40 }}>{text}</Text>
        {Icon && <Icon />}
      </View>
    </Animated.View>
  );
}