import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { SettingsIcon } from '../Icons';
import { Feather } from '@expo/vector-icons';
import LogoutButton from './LogoutButton';

export default function SettingsButton({ onLogout, onSettings }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showMenu) {
      setIsVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0.4,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setIsVisible(false));
    }
  }, [showMenu]);

  return (
    <View style={{ position: 'relative', zIndex: 1000 }}>
      <Pressable style={styles.button} onPress={() => setShowMenu((prev) => !prev)}>
        <SettingsIcon />
      </Pressable>

      {isVisible && (
        <>
          <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
            <Animated.View />
          </TouchableWithoutFeedback>

          <Animated.View style={[styles.menu, { opacity: fadeAnim }]}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onSettings?.();
              }}
            >
              <Feather name="settings" size={18} color="#000" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Settings</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onLogout?.();
              }}
            >
              <Feather name="log-out" size={18} color="#000" style={styles.menuIcon} />
              <LogoutButton />
            </Pressable>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFD400',
    paddingVertical: 10,
    borderRadius: 999,
    height: 50,
    width: 50,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    position: 'absolute',
    top: 65,
    right: 0,
    backgroundColor: '#FFD400',
    borderRadius: 16,
    elevation: 8,
    shadowOffset: { width: 0, height: 5 },
    paddingVertical: 8,
    width: 125,
    zIndex: 1001,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
