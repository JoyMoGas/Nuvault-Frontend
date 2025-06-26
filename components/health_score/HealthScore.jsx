import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { Svg, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';

const SIZE = 205;
const STROKE_WIDTH = 14;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Tamaño del círculo interior (más pequeño que el SIZE)
const INNER_SIZE = SIZE - 40;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function HealthScore({ score = 0 }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const [displayedScore, setDisplayedScore] = useState(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: score,
      duration: 1000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    Animated.timing(progress, {
      toValue: score,
      duration: 1500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    const listenerId = animatedValue.addListener(({ value }) => {
      setDisplayedScore(Math.round(value));
    });

    return () => {
      animatedValue.removeListener(listenerId);
    };
  }, [score]);


  return (
    <View className="relative items-center justify-center ">
      <View
        style={{
          position: 'absolute',
          width: INNER_SIZE,
          height: INNER_SIZE,
          borderRadius: INNER_SIZE / 2,
          backgroundColor: '#FFD400',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text className="text-gray-800 text-base mb-1">Health Score</Text>
        <Text className="text-5xl font-bold text-gray-900">
          {displayedScore}%
        </Text>
      </View>
    </View>
  );
}
