import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TextSkeleton({ width = 120, height = 24, borderRadius = 6 }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateX }] },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.1)', // gris oscuro para simular fondo de texto cargando
    overflow: 'hidden',
  },
});
