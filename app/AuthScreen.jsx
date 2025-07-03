import { useRouter, usePathname } from 'expo-router';
import AuthTabs from '../components/AuthTabs';
import { useCallback } from 'react';

export default function AuthScreen() {
  const router = useRouter();
  const pathname = usePathname();

  // Determinar el tab activo según la ruta actual
  const activeTab = pathname === '/register' ? 'register' : 'login';

  // Cambiar de tab actualizando la ruta (sin estado local)
  const onTabChange = useCallback(
    (tab) => {
      if (tab === 'login' && pathname !== '/login') router.replace('/login');
      else if (tab === 'register' && pathname !== '/register') router.replace('/register');
    },
    [pathname, router]
  );

  return <AuthTabs activeTab={activeTab} onTabChange={onTabChange} />;
}
