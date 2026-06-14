import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Platform, Pressable, Image } from 'react-native';
import { usePokemonContext } from '../contexts/PokemonContext';
import TeamMemberCard from '../components/TeamMemberCard';
import { getPokemonTypeTheme } from '../utils/theme';
import { PokemonDetails } from '../@types/pokemon';

export default function TeamScreen() {
  const { team, setTeam, capturedPokemons, setCapturedPokemons, updateTeamInBackend } = usePokemonContext();
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Estado de troca
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedBoxPokemonId, setSelectedBoxPokemonId] = useState<number | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);

  // Filtra slots vazios
  const activeMembers = team.filter(member => member.pokemonId !== null);

  const handleSwap = async () => {
    if (!selectedSlotId || !selectedBoxPokemonId) return;

    setIsSwapping(true);
    const memberToReplace = team.find(m => m.id === selectedSlotId);
    const boxPokemon = capturedPokemons.find(p => p.id === selectedBoxPokemonId);
    
    if (memberToReplace && memberToReplace.pokemonId && boxPokemon) {
      // 1. Chama API
      await updateTeamInBackend(memberToReplace.pokemonId, boxPokemon.id);
      
      // 2. Atualiza estado local
      const updatedTeam = team.map(m => {
        if (m.id === selectedSlotId) {
          return {
            ...m,
            pokemonId: boxPokemon.id,
            nickname: boxPokemon.name.charAt(0).toUpperCase() + boxPokemon.name.slice(1),
            pokemonDetails: boxPokemon,
            moves: boxPokemon.stats.map(s => s.name).slice(0, 4),
          };
        }
        return m;
      });
      setTeam(updatedTeam);

      // 3. Atualiza estado do Armazém
      if (memberToReplace.pokemonDetails) {
        const updatedBox = capturedPokemons.map(p => 
          p.id === selectedBoxPokemonId ? memberToReplace.pokemonDetails! : p
        );
        setCapturedPokemons(updatedBox);
      }
    }

    // Reseta seleção
    setSelectedSlotId(null);
    setSelectedBoxPokemonId(null);
    setIsSwapping(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>Meu Time Pokémon</Text>
          <Text style={styles.subtitle}>
            Seu time padrão fornecido pela API AWS. Ganhe batalhas para capturar novos Pokémons e use o Armazém abaixo para realizar substituições!
          </Text>
        </View>

        {/* Área de Troca */}
        {(selectedSlotId || selectedBoxPokemonId) && (
          <View style={styles.swapControlPanel}>
            <Text style={styles.swapTitle}>Modo de Troca Ativo</Text>
            <View style={styles.swapActionRow}>
              <Text style={styles.swapStatus}>
                {selectedSlotId ? '✅ Slot Selecionado' : '❌ Selecione um Pokémon do Time'} 
                {'  '}⇄{'  '}
                {selectedBoxPokemonId ? '✅ Box Selecionado' : '❌ Selecione um Pokémon do Box'}
              </Text>
              
              <Pressable 
                style={[
                  styles.confirmSwapBtn, 
                  (!selectedSlotId || !selectedBoxPokemonId || isSwapping) && styles.confirmSwapBtnDisabled
                ]}
                onPress={handleSwap}
                disabled={!selectedSlotId || !selectedBoxPokemonId || isSwapping}
              >
                <Text style={styles.confirmSwapText}>{isSwapping ? 'Trocando...' : 'Confirmar Troca'}</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Grid do Time */}
        {activeMembers.length > 0 ? (
          <View style={styles.teamGrid}>
            {activeMembers.map((member) => {
              const isSelected = member.id === selectedSlotId;
              return (
                <View key={member.id} style={styles.gridCol}>
                  <Pressable onPress={() => setSelectedSlotId(isSelected ? null : member.id)}>
                    <View style={[styles.cardWrapper, isSelected && styles.cardWrapperSelected]}>
                      <TeamMemberCard member={member} />
                      {isSelected && (
                        <View style={styles.selectedOverlay}>
                          <Text style={styles.selectedOverlayText}>Selecionado para Troca</Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyTeamContainer}>
            <Text style={styles.emptyTeamText}>Seu time está vazio no momento.</Text>
          </View>
        )}

        {/* Armazém de Pokémons */}
        <View style={styles.boxSection}>
          <View style={styles.boxHeader}>
            <Text style={styles.boxTitle}>Armazém de Pokémons</Text>
            <Text style={styles.boxSubtitle}>
              Pokémons que você conquistou em Batalhas. Selecione um para trocar com um membro do seu time ativo.
            </Text>
          </View>

          <View style={styles.boxGrid}>
            {capturedPokemons.map((pokemon) => {
              const isAlreadyInTeam = team.some((member) => member.pokemonId === pokemon.id);
              const isSelected = selectedBoxPokemonId === pokemon.id;
              const primaryType = pokemon.types[0] || 'normal';
              const typeTheme = getPokemonTypeTheme(primaryType);

              return (
                <View key={pokemon.id} style={styles.boxCardCol}>
                  <Pressable 
                    onPress={() => {
                      if (!isAlreadyInTeam) {
                        setSelectedBoxPokemonId(isSelected ? null : pokemon.id);
                      }
                    }}
                    style={[
                      styles.boxCard, 
                      { borderColor: typeTheme.primary },
                      isSelected && styles.boxCardSelected,
                      isAlreadyInTeam && styles.boxCardDisabled
                    ]}
                  >
                    {/* Sprite */}
                    <View style={styles.boxSpriteContainer}>
                      <View style={[styles.boxRoundBackground, { backgroundColor: typeTheme.primary }]} />
                      <Image source={{ uri: pokemon.gifUrl }} style={styles.boxImage} resizeMode="contain" />
                    </View>

                    <View style={styles.boxInfo}>
                      <Text style={styles.boxName}>
                        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                      </Text>
                    </View>

                    {isAlreadyInTeam ? (
                      <View style={styles.boxBadgeInTeam}>
                        <Text style={styles.boxBadgeInTeamText}>No Time ✓</Text>
                      </View>
                    ) : isSelected ? (
                      <View style={styles.boxBadgeSelected}>
                        <Text style={styles.boxBadgeSelectedText}>Selecionado</Text>
                      </View>
                    ) : null}
                  </Pressable>
                </View>
              );
            })}

            {capturedPokemons.length === 0 && (
              <View style={styles.emptyBoxContainer}>
                <Text style={styles.emptyBoxText}>Nenhum Pokémon no armazém. Vença batalhas para capturá-los!</Text>
              </View>
            )}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingTop: 10, paddingBottom: 32 },
  header: { marginBottom: 28 },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#8B949E', fontSize: 14, lineHeight: 22 },
  swapControlPanel: { backgroundColor: 'rgba(255, 62, 62, 0.1)', borderWidth: 1, borderColor: '#FF3E3E', borderRadius: 12, padding: 16, marginBottom: 20 },
  swapTitle: { color: '#FF3E3E', fontSize: 14, fontWeight: '800', marginBottom: 8, textTransform: 'uppercase' },
  swapActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  swapStatus: { color: '#E6EDF3', fontSize: 15, fontWeight: '600' },
  confirmSwapBtn: { backgroundColor: '#FF3E3E', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
  confirmSwapBtnDisabled: { backgroundColor: '#555', opacity: 0.5 },
  confirmSwapText: { color: '#FFF', fontWeight: 'bold' },
  teamGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 },
  gridCol: { paddingHorizontal: 8, marginBottom: 16, ...Platform.select({ web: { width: '33.33%' } as any, default: { width: '50%' } }) },
  cardWrapper: { borderRadius: 20, position: 'relative' },
  cardWrapperSelected: { transform: [{ scale: 1.02 }], shadowColor: '#FF3E3E', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 15 },
  selectedOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 62, 62, 0.2)', borderRadius: 20, borderWidth: 2, borderColor: '#FF3E3E', justifyContent: 'center', alignItems: 'center' },
  selectedOverlayText: { color: '#FFF', backgroundColor: '#FF3E3E', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, fontWeight: 'bold', fontSize: 12 },
  emptyTeamContainer: { padding: 32, alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  emptyTeamText: { color: '#8B949E', fontSize: 16, fontWeight: '600' },
  
  // Estilos do Armazém
  boxSection: { marginTop: 36, paddingTop: 28, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.08)' },
  boxHeader: { marginBottom: 20 },
  boxTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginBottom: 6 },
  boxSubtitle: { color: '#8B949E', fontSize: 13, lineHeight: 18 },
  boxGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 },
  boxCardCol: { paddingHorizontal: 8, marginBottom: 16, ...Platform.select({ web: { width: '20%' } as any, default: { width: '33.33%' } }) },
  boxCard: { backgroundColor: 'rgba(22, 24, 33, 0.6)', borderRadius: 18, borderWidth: 1.5, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
  boxCardSelected: { backgroundColor: 'rgba(255, 62, 62, 0.1)', borderColor: '#FF3E3E', transform: [{ scale: 1.05 }] },
  boxCardDisabled: { opacity: 0.4 },
  boxSpriteContainer: { width: 70, height: 70, justifyContent: 'center', alignItems: 'center', marginBottom: 8, position: 'relative' },
  boxRoundBackground: { position: 'absolute', width: 60, height: 60, borderRadius: 30, opacity: 0.15 },
  boxImage: { width: 65, height: 65, zIndex: 2 },
  boxInfo: { alignItems: 'center', width: '100%', marginBottom: 8 },
  boxName: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  boxBadgeInTeam: { backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 8 },
  boxBadgeInTeamText: { color: '#8B949E', fontSize: 10, fontWeight: '700' },
  boxBadgeSelected: { backgroundColor: '#FF3E3E', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 8 },
  boxBadgeSelectedText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  emptyBoxContainer: { padding: 30, alignItems: 'center', width: '100%', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 12 },
  emptyBoxText: { color: '#8B949E', fontSize: 14 }
});
