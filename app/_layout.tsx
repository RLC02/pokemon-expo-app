import React, { createContext, useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import Navbar from '../components/Navbar';
import LoginScreen from './index';
import PokedexScreen from './pokedex';
import ProfileScreen from './profile';
import TeamScreen from './team';
import BattleScreen from './battle';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { PokemonProvider, usePokemonContext } from '../contexts/PokemonContext';

export type AppRoute = 'login' | 'pokedex' | 'profile' | 'team' | 'battle';

interface RouteContextType {
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export function useRouteContext() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRouteContext must be used within RouteProvider');
  }
  return context;
}

export default function Layout() {
  return (
    <AuthProvider>
      <PokemonProvider>
        <RouteProvider>
          <LayoutContent />
        </RouteProvider>
      </PokemonProvider>
    </AuthProvider>
  );
}

function RouteProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [currentRoute, setCurrentRouteState] = useState<AppRoute>('login');

  useEffect(() => {
    if (isLoggedIn && currentRoute === 'login') {
      setCurrentRouteState('pokedex');
    } else if (!isLoggedIn && currentRoute !== 'login') {
      setCurrentRouteState('login');
    }
  }, [isLoggedIn, currentRoute]);

  const setCurrentRoute = (route: AppRoute) => {
    if (!isLoggedIn && route !== 'login') {
      setCurrentRouteState('login');
    } else {
      setCurrentRouteState(route);
    }
  };

  return (
    <RouteContext.Provider value={{ currentRoute, setCurrentRoute }}>
      {children}
    </RouteContext.Provider>
  );
}

function LayoutContent() {
  const { currentRoute } = useRouteContext();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const { loadingData } = usePokemonContext();

  const loading = authLoading || loadingData;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3E3E" />
        <Text style={styles.loadingText}>Carregando a PokeAPI...</Text>
      </View>
    );
  }

  // Animações de fundo na Web
  const renderWebAnimations = () => {
    if (Platform.OS !== 'web') return null;
    return (
      <style>{`
        body {
          background-color: #08090C !important;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(227, 53, 13, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(77, 144, 226, 0.05) 0%, transparent 40%) !important;
          background-attachment: fixed;
          margin: 0;
          font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
        }
        
        /* Animação da Pokébola girando */
        @keyframes pokeball-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        /* Scrollbar customizada */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0d0e12;
        }
        ::-webkit-scrollbar-thumb {
          background: #252836;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #383d52;
        }
      `}</style>
    );
  };

  const renderActiveScreen = () => {
    switch (currentRoute) {
      case 'login':
        return <LoginScreen />;
      case 'pokedex':
        return <PokedexScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'team':
        return <TeamScreen />;
      case 'battle':
        return <BattleScreen />;
      default:
        return <LoginScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderWebAnimations()}
      <View style={styles.appContainer}>
        {isLoggedIn && <Navbar />}
        <View style={styles.contentContainer}>
          {renderActiveScreen()}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#08090C',
  },
  appContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 1200 : undefined,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#08090C',
  },
  loadingText: {
    marginTop: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
