import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Svg, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import Heart from './Heart';

const SIZE = 220;
const STROKE_WIDTH = 14;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ScoreBar({ score = 0, children }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: score,
      duration: 1500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [score]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 100],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <View
      style={{
        width: SIZE,
        height: SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10, // asegurar que esté por encima del fondo
      }}
    >
      <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FFD400" />
            <Stop offset="100%" stopColor="#FFD400" />
          </LinearGradient>
        </Defs>

        <G rotation="90" originX={SIZE / 2} originY={SIZE / 2}>
          {/* Círculo de fondo (solo contorno tenue) */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#FFD400"
            strokeOpacity={0.2}
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
          />
          {/* Círculo de progreso animado */}
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="url(#grad)"
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </G>
      </Svg>

      {/* Contenido central: HealthScore */}
      <View style={{ position: 'absolute', zIndex: 999 }}>
        {children}
      </View>
      
    </View>
  );
}
