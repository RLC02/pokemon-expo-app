import React from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import PokemonList from '../components/PokemonList';

export default function PokedexScreen() {
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={Platform.OS === 'web'}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Pokédex Oficial</Text>
        <Text style={styles.subtitle}>
          Explore todos os 150 Pokémons da primeira geração e gerencie sua equipe com facilidade!
        </Text>
      </View>

      {/* Componente da Lista de Pokémons */}
      <PokemonList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#8B949E',
    fontSize: 14,
    lineHeight: 22,
  },
});
