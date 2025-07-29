import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PasswordsContext = createContext();

export const usePasswords = () => useContext(PasswordsContext);

export const PasswordsProvider = ({ children }) => {
  const [passwordsCache, setPasswordsCache] = useState({});
  const [healthScore, setHealthScore] = useState(null);
  const [loadingPasswords, setLoadingPasswords] = useState(false);
  const [errorPasswords, setErrorPasswords] = useState(null);
  const [username, setUsername] = useState(null);

  const fetchPasswords = async (filter) => {
    if (passwordsCache[filter]) {
      return passwordsCache[filter];
    }
    setLoadingPasswords(true);
    setErrorPasswords(null);
    try {
      let res;
      const config = { show_plaintext: true };
      if (filter === 'All') {
        res = await api.post('/my-passwords', config);
      } else if (filter === 'Favorites') {
        res = await api.post('/favorites', config);
      } else {
        const order = filter === 'Recent' ? 'recent' : 'oldest';
        res = await api.get(`/passwords-sorted?order=${order}&show_plaintext=true`);
      }
      const data = Array.isArray(res.data) ? res.data : [];
      setPasswordsCache((prev) => ({ ...prev, [filter]: data }));
      return data;
    } catch (e) {
      setErrorPasswords('Error loading passwords');
      return [];
    } finally {
      setLoadingPasswords(false);
    }
  };

  const fetchUsername = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.get('/user-info', {
        headers: { Authorization: `Bearer ${token}`},
      });
      if (res.data?.username) {
        setUsername(res.data.username);
        return res.data.username;
      }
    } catch (err) {
      if (err.response?.status === 404) {
        await AsyncStorage.removeItem('token');
      }
      setUsername(null);
      return null;
    }
  }

  const fetchHealthScore = async () => {
    if (healthScore !== null) return healthScore;
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.get('/health-score', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const score = Math.max(0, res.data.health_score);
      setHealthScore(score);
      return score;
    } catch {
      setHealthScore(0);
      return 0;
    }
  };

  return (
    <PasswordsContext.Provider
      value={{
        fetchPasswords,
        passwordsCache,
        setPasswordsCache,
        loadingPasswords,
        errorPasswords,
        fetchHealthScore,
        healthScore,
        setHealthScore,
        username,
        fetchUsername,
      }}
    >
      {children}
    </PasswordsContext.Provider>
  );
};
