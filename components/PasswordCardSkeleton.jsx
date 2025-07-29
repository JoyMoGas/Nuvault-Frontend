import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function PasswordCardSkeleton() {
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
    outputRange: [-200, 200],
  });

  return (
    <View className="px-5 mb-2">
      <View style={styles.card}>
        <View style={styles.iconBox} />
        <View style={{ flex: 1 }}>
          <View style={styles.line} />
          <View style={styles.lineSmall} />
          <View style={styles.lineSmall} />
        </View>
        <View style={{ marginLeft: 3, width: 40, height: 40 }} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#eee',
  },
  iconBox: {
    width: 66,
    height: 66,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginRight: 16,
  },
  line: {
    height: 16,
    backgroundColor: '#ddd',
    marginBottom: 6,
    borderRadius: 8,
    width: '80%',
  },
  lineSmall: {
    height: 12,
    backgroundColor: '#ddd',
    marginBottom: 6,
    borderRadius: 6,
    width: '60%',
  },
});
