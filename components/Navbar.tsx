import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useRouteContext, AppRoute } from '../app/_layout';
import { useAuth } from '../contexts/AuthContext';
import { usePokemonContext } from '../contexts/PokemonContext';
import { borderThemes } from '../utils/theme';
import { styles } from './Navbar.styles';

export default function Navbar() {
  const { currentRoute, setCurrentRoute } = useRouteContext();
  const { profile } = usePokemonContext();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Get active border theme
  const borderTheme = borderThemes[profile.borderTheme] || borderThemes.pokeball;

  // Dynamic tabs list using the currently active avatar Pokémon sprite
  const tabs = [
    { 
      key: 'pokedex' as AppRoute, 
      label: 'Pokédex', 
      iconUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' 
    },
    { 
      key: 'team' as AppRoute, 
      label: 'Meu Time', 
      iconUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' 
    },
    { 
      key: 'profile' as AppRoute, 
      label: 'Perfil', 
      iconUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${profile.avatarId}.png` 
    },
    {
      key: 'battle' as AppRoute,
      label: 'Batalha',
      iconUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png'
    },
  ];

  // Quick avatar sprite URL using official PokéAPI sprites repo
  const avatarUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${profile.avatarId}.png`;

  const handleTabPress = (route: AppRoute) => {
    setCurrentRoute(route);
    setMenuOpen(false);
  };

  const handleLogoutPress = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <View style={styles.navbarOuter}>
      {/* Top Header Bar */}
      <View style={styles.navbarHeader}>
        {/* Brand/Logo */}
        <Pressable onPress={() => handleTabPress('pokedex')} style={styles.brand}>
          <View style={styles.logoPokeBall}>
            <View style={styles.logoPokeBallTop} />
            <View style={styles.logoPokeBallCenter} />
            <View style={styles.logoPokeBallBottom} />
          </View>
          <Text style={styles.brandText}>Poke<Text style={styles.brandTextRed}>Web</Text></Text>
        </Pressable>

        {/* User preview inside navbar (desktop only) */}
        <View style={styles.desktopUserPreview}>
          <Text style={styles.desktopUserName}>{profile.name}</Text>
          <Text style={styles.desktopUserStats}>{profile.wins}V - {profile.losses}D</Text>
          <View
            style={[
              styles.avatarBorderMini,
              {
                borderColor: borderTheme.borderColor,
              },
            ]}
          >
            <Image source={{ uri: avatarUrl }} style={styles.avatarMiniImage as any} />
          </View>
        </View>

        {/* Hamburger Menu Toggle Button */}
        <Pressable 
          onPress={() => setMenuOpen(!menuOpen)} 
          style={[
            styles.hamburgerBtn,
            menuOpen && styles.hamburgerBtnOpen
          ]}
        >
          {/* Custom Pokémon hamburger design: A Pokéball button that rotates */}
          <View style={[styles.menuPokeBall, menuOpen && styles.menuPokeBallActive]}>
            <View style={styles.menuPokeBallTop} />
            <View style={styles.menuPokeBallCenter} />
            <View style={styles.menuPokeBallBottom} />
          </View>
          <Text style={styles.hamburgerLabel}>{menuOpen ? 'Fechar' : 'Menu'}</Text>
        </Pressable>
      </View>

      {/* Hamburger Dropdown Drawer */}
      {menuOpen && (
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdownInner}>
            {/* Quick Profile Overview inside dropdown */}
            <View style={styles.dropdownProfileCard}>
              <View
                style={[
                  styles.avatarBorderLarge,
                  {
                    borderColor: borderTheme.borderColor,
                    shadowColor: borderTheme.borderColor,
                  },
                ]}
              >
                <View style={styles.avatarInnerContainerLarge}>
                  <Image source={{ uri: avatarUrl }} style={styles.avatarLargeImage as any} />
                </View>
              </View>
              <View style={styles.dropdownProfileInfo}>
                <Text style={styles.trainerName}>{profile.name}</Text>
                <Text style={styles.trainerRank}>Treinador Iniciante</Text>
                <Text style={styles.trainerStats}>{profile.wins} Vitórias • {profile.losses} Derrotas</Text>
              </View>
            </View>

            {/* Menu Items with Real Pokemon Icons */}
            <View style={styles.menuLinks}>
              {tabs.map((tab) => {
                const isActive = currentRoute === tab.key;
                return (
                  <Pressable
                    key={tab.key}
                    onPress={() => handleTabPress(tab.key)}
                    style={[
                      styles.menuLinkItem,
                      isActive && styles.menuLinkItemActive,
                    ]}
                  >
                    <Image source={{ uri: tab.iconUrl }} style={styles.menuIconImage} />
                    <Text style={[styles.menuLinkLabel, isActive && styles.menuLinkLabelActive]}>
                      {tab.label}
                    </Text>
                    {isActive && <View style={styles.activeDot} />}
                  </Pressable>
                );
              })}
            </View>

            {/* Footer Logout Button */}
            <Pressable onPress={handleLogoutPress} style={styles.menuLogoutButton}>
              <Image 
                source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/escape-rope.png' }} 
                style={styles.logoutIconImage} 
              />
              <Text style={styles.menuLogoutText}>Sair da Sessão</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

