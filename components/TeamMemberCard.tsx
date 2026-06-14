import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { TeamMember } from '../@types/pokemon';
import { getPokemonTypeTheme } from '../utils/theme';
import { styles } from './TeamMemberCard.styles';

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [hovered, setHovered] = useState(false);
  const pokemon = member.pokemonDetails;

  if (!pokemon) {
    return (
      <View style={styles.emptyCard}>
        <Image
          source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }}
          style={styles.emptyBall}
        />
        <Text style={styles.emptyText}>Slot Vazio</Text>
      </View>
    );
  }

  const primaryType = pokemon.types[0] || 'normal';
  const typeTheme = getPokemonTypeTheme(primaryType);

  return (
    <View
      style={[
        styles.cardContainer,
        hovered && styles.cardContainerHovered,
        { borderColor: typeTheme.primary },
      ]}
      // @ts-ignore for web support without complaining on native
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Luzes indicativas da Pokédex */}
      <View style={styles.pokedexHeaderMini}>
        <View style={styles.miniBlueLight} />
        <View style={styles.miniRedLight} />
        <View style={styles.miniYellowLight} />
        <View style={styles.miniGreenLight} />
      </View>
      {/* Informações Básicas e Sprite */}
      <View style={styles.cardHeader}>
        <View style={styles.spriteContainer}>
          <View style={[styles.roundBackground, { backgroundColor: typeTheme.primary }]} />
          <Image source={{ uri: pokemon.gifUrl }} style={styles.spriteImage as any} resizeMode="contain" />
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.pokemonName}>{member.nickname || pokemon.name}</Text>
          <Text style={styles.speciesText}>
            {pokemon.name.toUpperCase()} • Nível {member.level}
          </Text>
          
          {/* Tipos */}
          <View style={styles.typeBadgeContainer}>
            {pokemon.types.map((type) => {
              const badgeTheme = getPokemonTypeTheme(type);
              return (
                <View key={type} style={[styles.typeBadge, { backgroundColor: badgeTheme.primary }]}>
                  <Text style={styles.typeText}>{type.toUpperCase()}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Atributos */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Status do Pokémon:</Text>
        <View style={styles.statsGrid}>
          {pokemon.stats.map((stat) => (
            <View key={stat.name} style={styles.statSlot}>
              <Text style={styles.statNameText} numberOfLines={1}>
                {stat.name.replace('special-', 's-').toUpperCase()}
              </Text>
              <Text style={styles.statValueText}>{stat.value}</Text>
            </View>
          ))}
        </View>
      </View>

    </View>
  );
}

