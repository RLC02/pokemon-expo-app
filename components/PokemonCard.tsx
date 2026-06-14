import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { PokemonDetails } from '../@types/pokemon';
import { getPokemonTypeTheme } from '../utils/theme';
import { usePokemonContext } from '../contexts/PokemonContext';
import { styles } from './PokemonCard.styles';

interface PokemonCardProps {
  pokemon: PokemonDetails;
  isSelectable?: boolean;
  onSelect?: (pokemon: PokemonDetails) => void;
}

export default function PokemonCard({ pokemon, isSelectable, onSelect }: PokemonCardProps) {
  const { team } = usePokemonContext();
  const [hovered, setHovered] = useState(false);

  const primaryType = pokemon.types[0] || 'normal';
  const typeTheme = getPokemonTypeTheme(primaryType);

  // Verifica se o Pokémon já está no time
  const isInTeam = team.some((member) => member.pokemonId === pokemon.id);

  return (
    <Pressable
      style={[
        styles.cardContainer,
        hovered && styles.cardContainerHovered,
        { borderColor: typeTheme.primary, borderWidth: 1.5 },
      ]}
      onPress={() => {
        if (isSelectable && onSelect) {
          onSelect(pokemon);
        }
      }}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      {/* Luzes indicativas (estilo Pokédex) */}
      <View style={styles.pokedexHeaderMini}>
        <View style={styles.miniBlueLight} />
        <View style={styles.miniRedLight} />
        <View style={styles.miniYellowLight} />
        <View style={styles.miniGreenLight} />
      </View>

      {/* Badge do ID */}
      <Text style={styles.idText}>
        {isInTeam ? '✓ ' : ''}#{String(pokemon.id).padStart(3, '0')}
      </Text>

      {/* Fundo redondo que combina com o tipo primário */}
      <View style={styles.spriteContainer}>
        <View style={[styles.roundBackground, { backgroundColor: typeTheme.primary }]} />
        
        {/* Sprite animado flutuante */}
        <Image
          source={{ uri: pokemon.gifUrl }}
          style={[
            styles.spriteImage,
            hovered && styles.spriteImageHovered
          ]}
          resizeMode="contain"
        />
      </View>

      {/* Nome e Tipos */}
      <Text style={styles.pokemonName}>
        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </Text>

      <View style={styles.typeBadgeContainer}>
        {pokemon.types.map((type) => {
          const badgeTheme = getPokemonTypeTheme(type);
          return (
            <View
              key={type}
              style={[styles.typeBadge, { backgroundColor: badgeTheme.primary }]}
            >
              <Text style={styles.typeText}>{type.toUpperCase()}</Text>
            </View>
          );
        })}
      </View>

    </Pressable>
  );
}

