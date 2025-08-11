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
    // Si el caché para este filtro ya existe, lo usamos.
    // Si el caché fue vaciado, esta condición será falsa y se volverán a pedir los datos.
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

  // CAMBIO: Se agrega la función para añadir contraseñas al contexto.
  const addPassword = async (passwordData) => {
    try {
      // La llamada a la API ahora se hace aquí.
      await api.post('/add-password', passwordData);

      // CAMBIO CLAVE: Al tener éxito, vaciamos el caché.
      // Esto obligará a cualquier pantalla que use `fetchPasswords`
      // a obtener la lista actualizada del servidor.
      setPasswordsCache({});

      // También forzamos la actualización del health score.
      await fetchHealthScore(true); // Pasamos true para forzar el refresco

    } catch (error) {
      // Si hay un error, lo lanzamos para que el componente que llama (AddPassword)
      // pueda atraparlo y mostrar un mensaje al usuario.
      console.error("Error adding password in context:", error);
      throw error;
    }
  };


  const fetchUsername = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.get('/user-info', {
        headers: { Authorization: `Bearer ${token}` },
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

  // CAMBIO: Se añade un parámetro 'forceRefresh' para poder invalidar el caché del score.
  const fetchHealthScore = async (forceRefresh = false) => {
    if (healthScore !== null && !forceRefresh) return healthScore;
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

  const clearPasswordsData = () => {
    setPasswordsCache({});
    setUsername(null);
    setHealthScore(null);
  };


  return (
    <PasswordsContext.Provider
      value={{
        // CAMBIO: Exponemos la nueva función 'addPassword'.
        addPassword,
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
        clearPasswordsData,
      }}
    >
      {children}
    </PasswordsContext.Provider>
  );
};
