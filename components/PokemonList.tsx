import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { getPokemonList } from '../integration/api';
import { PokemonDetails } from '../@types/pokemon';
import PokemonCard from './PokemonCard';
import { typeColors } from '../utils/theme';
import { styles } from './PokemonList.styles';

export default function PokemonList() {
  const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllPokemons() {
      try {
        setLoading(true);
        // Busca a 1ª geração de pokémons (151)
        const data = await getPokemonList(151, 0);
        setPokemons(data.pokemons);
      } catch (err) {
        console.error('Error fetching pokemon list:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllPokemons();
  }, []);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType(null);
  };

  // Filtra localmente para resposta instantânea
  const filteredPokemons = pokemons.filter((poke) => {
    const matchesSearch =
      poke.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(poke.id).includes(searchQuery);

    const matchesType = selectedType
      ? poke.types.some((t) => t.toLowerCase() === selectedType.toLowerCase())
      : true;

    return matchesSearch && matchesType;
  });

  const pokemonTypes = Object.keys(typeColors);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF3E3E" />
        <Text style={styles.loadingText}>Carregando Todos os 151 Pokémons...</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {/* Filtro e Pesquisa */}
      <View style={styles.searchSection}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Pesquise por nome ou número (ex: 25)..."
          placeholderTextColor="#8B949E"
          style={styles.searchInput}
        />
        
        {/* Botões de filtro por tipo */}
        <Text style={styles.sectionLabel}>Filtrar por tipo:</Text>
        <View style={styles.typeFilterContainer}>
          {pokemonTypes.map((type) => {
            const isActive = selectedType === type;
            const bgTheme = typeColors[type];
            return (
              <Pressable
                key={type}
                onPress={() => setSelectedType(isActive ? null : type)}
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: isActive ? bgTheme.primary : 'rgba(255, 255, 255, 0.03)',
                    borderColor: bgTheme.primary,
                  },
                ]}
              >
                <Text style={[styles.typeButtonText, isActive && styles.typeButtonTextActive]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Grid de Pokémons */}
      {filteredPokemons.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Nenhum Pokémon encontrado.</Text>
          <Pressable style={styles.resetButton} onPress={handleResetFilters}>
            <Text style={styles.resetButtonText}>Limpar Filtros</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.grid}>
          {filteredPokemons.map((pokemon) => (
            <View key={pokemon.id} style={styles.gridCol}>
              <PokemonCard pokemon={pokemon} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
