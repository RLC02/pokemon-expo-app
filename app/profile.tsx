import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Image, Platform, ScrollView } from 'react-native';
import { usePokemonContext } from '../contexts/PokemonContext';
import { borderThemes } from '../utils/theme';

export default function ProfileScreen() {
  const { profile, setProfile, updateProfileStats } = usePokemonContext();
  const [name, setName] = useState(profile.name);
  const [borderTheme, setBorderTheme] = useState(profile.borderTheme);
  const [avatarId, setAvatarId] = useState(profile.avatarId);
  const [wins, setWins] = useState(profile.wins);
  const [losses, setLosses] = useState(profile.losses);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Alterna as bordas
  const handleCycleBorder = () => {
    const keys = Object.keys(borderThemes) as Array<'pokeball' | 'greatball' | 'ultraball' | 'masterball'>;
    const currentIndex = keys.indexOf(borderTheme);
    const nextIndex = (currentIndex + 1) % keys.length;
    setBorderTheme(keys[nextIndex]);
  };

  // Lista de avatares
  const avatarOptions = [
    { id: 25, name: 'Pikachu' },
    { id: 6, name: 'Charizard' },
    { id: 9, name: 'Blastoise' },
    { id: 3, name: 'Venusaur' },
    { id: 133, name: 'Eevee' },
    { id: 94, name: 'Gengar' },
    { id: 150, name: 'Mewtwo' },
    { id: 448, name: 'Lucario' },
  ];

  const handleSave = async () => {
    await updateProfileStats(wins, losses, 1);
    await setProfile({
      name,
      borderTheme,
      avatarId,
      wins,
      losses,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const activeBorder = borderThemes[borderTheme] || borderThemes.pokeball;
  const activeAvatarUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${avatarId}.png`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil de Treinador</Text>
        <Text style={styles.subtitle}>Personalize o seu avatar, altere as bordas e visualize seus recordes de batalha.</Text>
      </View>

      <View style={styles.mainLayout}>
        {/* Lado Esquerdo: Preview */}
        <View style={styles.previewSection}>
          <Text style={styles.cardHeaderTitle}>Pré-visualização</Text>
          
          <View style={styles.pokedexCard}>
            {/* Design da Pokédex */}
            <View style={styles.pokedexLensContainer}>
              <View style={styles.pokedexMainLensOuter}>
                <View style={styles.pokedexMainLensInner} />
              </View>
              <View style={styles.pokedexLightRed} />
              <View style={styles.pokedexLightYellow} />
              <View style={styles.pokedexLightGreen} />
            </View>

            {/* Tela da Pokédex */}
            <View style={styles.pokedexScreen}>
              {/* Borda selecionada */}
              <Pressable
                onPress={handleCycleBorder}
                style={[
                  styles.avatarContainerOuter,
                  {
                    borderColor: activeBorder.borderColor,
                    shadowColor: activeBorder.borderColor,
                  },
                ]}
              >
                <View style={styles.avatarContainerInner}>
                  <Image source={{ uri: activeAvatarUrl }} style={styles.avatarLargeImage} resizeMode="contain" />
                </View>
                {/* Badge do estilo da Pokébola */}
                <View style={[styles.ballBadge, { backgroundColor: activeBorder.borderColor }]}>
                  <Text style={styles.ballBadgeText}>{activeBorder.label}</Text>
                </View>
                <Text style={styles.cycleBorderTooltip}>Trocar Borda</Text>
              </Pressable>

              <Text style={styles.previewName}>{name || 'Treinador'}</Text>
              <Text style={styles.previewSubtitle}>Treinador de Elite</Text>

              {/* Vitórias / Derrotas */}
              <View style={styles.statsCardGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>VITÓRIAS</Text>
                  <Text style={[styles.statValue, styles.statValueWins]}>{wins}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>DERROTAS</Text>
                  <Text style={[styles.statValue, styles.statValueLosses]}>{losses}</Text>
                </View>
              </View>

              {/* Taxa de Vitórias */}
              {wins + losses > 0 && (
                <View style={styles.ratioContainer}>
                  <Text style={styles.ratioText}>
                    Taxa de Vitória: {((wins / (wins + losses)) * 100).toFixed(0)}%
                  </Text>
                  <View style={styles.ratioBarBg}>
                    <View 
                      style={[
                        styles.ratioBarFill, 
                        { width: `${(wins / (wins + losses)) * 100}%` }
                      ]} 
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Lado Direito: Formulário */}
        <View style={styles.formSection}>
          {saveSuccess && (
            <View style={styles.successToast}>
              <Text style={styles.successToastText}>✓ Perfil atualizado com sucesso!</Text>
            </View>
          )}

          {/* Editar Nome */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome do Treinador</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              maxLength={20}
              placeholder="Digite seu nome..."
              placeholderTextColor="#8B949E"
              style={styles.textInput}
            />
          </View>

          {/* Recorde de Batalhas (Leitura) */}
          <View style={styles.winsLossesControl}>
            <Text style={styles.inputLabel}>Recorde de Batalhas</Text>
            <View style={styles.readOnlyStatsCard}>
              <Text style={styles.readOnlyStatsText}>
                As vitórias e derrotas são atualizadas automaticamente após as batalhas e não podem ser alteradas manualmente.
              </Text>
              <View style={styles.readOnlyStatsRow}>
                <View style={styles.readOnlyStatItem}>
                  <Text style={styles.readOnlyStatLabel}>Vitórias</Text>
                  <Text style={[styles.readOnlyStatValue, styles.statValueWins]}>{wins}</Text>
                </View>
                <View style={styles.readOnlyStatDivider} />
                <View style={styles.readOnlyStatItem}>
                  <Text style={styles.readOnlyStatLabel}>Derrotas</Text>
                  <Text style={[styles.readOnlyStatValue, styles.statValueLosses]}>{losses}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Seleção da Borda */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Borda do Perfil (Estilo Poké Ball)</Text>
            <View style={styles.bordersGrid}>
              {Object.keys(borderThemes).map((key) => {
                const border = borderThemes[key];
                const isSelected = borderTheme === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setBorderTheme(key as any)}
                    style={[
                      styles.borderSelectBtn,
                      { borderColor: border.borderColor },
                      isSelected && { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 3 }
                    ]}
                  >
                    <Text style={[styles.borderSelectLabel, { color: border.borderColor }]}>
                      {border.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Seleção de Avatar */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Foto de Perfil (Pokémon)</Text>
            <View style={styles.avatarGrid}>
              {avatarOptions.map((opt) => {
                const isSelected = avatarId === opt.id;
                const optSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${opt.id}.png`;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setAvatarId(opt.id)}
                    style={[
                      styles.avatarOptionCard,
                      isSelected && styles.avatarOptionCardSelected,
                    ]}
                  >
                    <Image source={{ uri: optSpriteUrl }} style={styles.avatarOptionImage} />
                    <Text style={[styles.avatarOptionName, isSelected && styles.avatarOptionNameSelected]}>
                      {opt.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Botão de Salvar */}
          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Salvar Alterações</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    marginBottom: 28,
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
  mainLayout: {
    flexDirection: 'column',
    gap: 24,
    ...Platform.select({
      web: {
        flexDirection: 'row',
        alignItems: 'flex-start',
      },
    }),
  },
  previewSection: {
    flex: 1,
    alignItems: 'center',
    ...Platform.select({
      web: {
        maxWidth: 350,
      },
    }),
  },
  cardHeaderTitle: {
    color: '#8B949E',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  pokedexCard: {
    width: '100%',
    backgroundColor: '#DC0A2D',
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#8B0000',
    padding: 16,
    paddingTop: 50,
    alignItems: 'stretch',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  pokedexScreen: {
    backgroundColor: '#1E202B',
    borderWidth: 3,
    borderColor: '#515363',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  pokedexLensContainer: {
    position: 'absolute',
    top: 12,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pokedexMainLensOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#303030',
  },
  pokedexMainLensInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00A8FF',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  pokedexLightRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3E3E',
    borderWidth: 1,
    borderColor: '#303030',
  },
  pokedexLightYellow: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F4D23C',
    borderWidth: 1,
    borderColor: '#303030',
  },
  pokedexLightGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CD964',
    borderWidth: 1,
    borderColor: '#303030',
  },
  avatarContainerOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E202B',
    position: 'relative',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    marginBottom: 26,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      } as any,
    }),
  },
  avatarContainerInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#252836',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLargeImage: {
    width: 110,
    height: 110,
    marginTop: 8,
  },
  cycleBorderTooltip: {
    position: 'absolute',
    bottom: -22,
    color: '#8B949E',
    fontSize: 9,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ballBadge: {
    position: 'absolute',
    bottom: -6,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  ballBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  previewName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  previewSubtitle: {
    color: '#FF3E3E',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 4,
    marginBottom: 20,
  },
  statsCardGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    paddingVertical: 12,
    width: '100%',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  statLabel: {
    color: '#8B949E',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  statValueWins: {
    color: '#4CD964',
  },
  statValueLosses: {
    color: '#FF3B30',
  },
  ratioContainer: {
    width: '100%',
    gap: 6,
  },
  ratioText: {
    color: '#8B949E',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  ratioBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 3B, 30, 0.2)', // Loss bar background
    borderRadius: 3,
    overflow: 'hidden',
  },
  ratioBarFill: {
    height: '100%',
    backgroundColor: '#4CD964', // Win bar fill
    borderRadius: 3,
  },
  formSection: {
    flex: 2,
    backgroundColor: 'rgba(26, 28, 35, 0.5)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 24,
    gap: 20,
  },
  successToast: {
    backgroundColor: 'rgba(76, 217, 100, 0.1)',
    borderWidth: 1,
    borderColor: '#4CD964',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  successToastText: {
    color: '#4CD964',
    fontSize: 13,
    fontWeight: '700',
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  textInput: {
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 15,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  winsLossesControl: {
    gap: 8,
  },
  readOnlyStatsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 14,
    gap: 12,
  },
  readOnlyStatsText: {
    color: '#8B949E',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  readOnlyStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 10,
    paddingVertical: 10,
  },
  readOnlyStatItem: {
    alignItems: 'center',
  },
  readOnlyStatLabel: {
    color: '#8B949E',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  readOnlyStatValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  readOnlyStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  bordersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  borderSelectBtn: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      } as any,
    }),
  },
  borderSelectLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  avatarOptionCard: {
    width: '23%', // 4 columns
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    gap: 4,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s',
      } as any,
    }),
  },
  avatarOptionCardSelected: {
    borderColor: '#FF3E3E',
    backgroundColor: 'rgba(255, 62, 62, 0.05)',
  },
  avatarOptionImage: {
    width: 60,
    height: 60,
  },
  avatarOptionName: {
    color: '#8B949E',
    fontSize: 10,
    fontWeight: '600',
  },
  avatarOptionNameSelected: {
    color: '#FF3E3E',
  },
  saveBtn: {
    backgroundColor: '#FF3E3E',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      } as any,
    }),
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
