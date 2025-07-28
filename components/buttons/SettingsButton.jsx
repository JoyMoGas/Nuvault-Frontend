import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SettingsIcon } from '../Icons';
import LogoutButton from './LogoutButton';
import NotAvailableButton from './NotAvailable';

export default function SettingsButton({ isOpen, setIsOpen, onLogout }) {
  const router = useRouter();

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setIsOpen(prev => !prev)}
      >
        <SettingsIcon />
      </Pressable>

      {isOpen && (
        <>
          {/* Fondo semitransparente */}
          <TouchableWithoutFeedback className='z-50' onPress={() => setIsOpen(false)}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          {/* Menú */}
          <View style={styles.menu}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setIsOpen(false);
                router.push('/settings');
              }}
            >
              <Feather name="settings" size={18} color="#000" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Settings</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setIsOpen(false);
                onLogout?.();
              }}
            >
              <Feather name="log-out" size={18} color="#000" style={styles.menuIcon} />
              <LogoutButton />
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => setIsOpen(false)}
            >
              <Feather name="info" size={18} color="#000" style={styles.menuIcon} />
              <NotAvailableButton>
                <Text style={styles.menuItemText}>Help</Text>
              </NotAvailableButton>
            </Pressable>
          </View>
        </>
      )}
    </>
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
  backdrop: {
    position: 'absolute',
    top: -1000, // extender fuera para cubrir toda la pantalla, ajusta si es necesario
    left: -1000,
    right: -1000,
    bottom: -1000,
    backgroundColor: 'transparent',
    zIndex: 55,
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
    zIndex: 1000,
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
