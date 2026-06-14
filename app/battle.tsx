import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, Animated, Easing, Pressable } from 'react-native';
import { usePokemonContext } from '../contexts/PokemonContext';
import { PokemonDetails } from '../@types/pokemon';
import { getPokemonDetails } from '../integration/api';

type BattleState = 'IDLE' | 'SEARCHING' | 'FOUND' | 'BATTLING' | 'REWARD' | 'LOSS';

export default function BattleScreen() {
  const { profile, team, capturePokemonInBackend, capturedPokemons, setCapturedPokemons } = usePokemonContext();
  const [battleState, setBattleState] = useState<BattleState>('IDLE');
  
  const [opponentName, setOpponentName] = useState('Gary Oak');
  const [opponentAvatar, setOpponentAvatar] = useState(133); // Eevee
  const [opponentTeam, setOpponentTeam] = useState<PokemonDetails[]>([]);

  const [playerWins, setPlayerWins] = useState(0);
  const [opponentWins, setOpponentWins] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // Estado do Round
  const [currentRound, setCurrentRound] = useState(0);
  const [playerFighter, setPlayerFighter] = useState<PokemonDetails | null>(null);
  const [opponentFighter, setOpponentFighter] = useState<PokemonDetails | null>(null);
  const [roundStat, setRoundStat] = useState<string>('');
  
  // Recompensa
  const [rewardPokemon, setRewardPokemon] = useState<PokemonDetails | null>(null);
  const [capturing, setCapturing] = useState(false);

  // Animações
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnimPlayer = useRef(new Animated.Value(-300)).current;
  const slideAnimOpponent = useRef(new Animated.Value(300)).current;
  const attackAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const spin = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-30deg', '0deg', '30deg']
  });

  // Membros ativos do time
  const activeMembers = team.filter(m => m.pokemonId !== null).map(m => m.pokemonDetails as PokemonDetails);

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 5));

  const startSearch = () => {
    if (activeMembers.length === 0) {
      alert("Você precisa de pelo menos 1 Pokémon no time para batalhar!");
      return;
    }
    setBattleState('SEARCHING');
    setPlayerWins(0);
    setOpponentWins(0);
    setLogs([]);

    // Animação de pulso
    const loopAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.5, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
      ])
    );
    loopAnim.start();

    // Simula atraso de WebSocket para encontrar oponente
    setTimeout(async () => {
      loopAnim.stop();
      pulseAnim.setValue(1);
      
      // Gera time do oponente
      const oppTeam: PokemonDetails[] = [];
      for(let i=0; i<3; i++) {
        const randomId = Math.floor(Math.random() * 151) + 1;
        const p = await getPokemonDetails(randomId).catch(() => null);
        if (p) oppTeam.push(p);
      }
      setOpponentTeam(oppTeam);
      
      setBattleState('FOUND');
      
      setTimeout(() => {
        setBattleState('BATTLING');
        playRound(0, 0, oppTeam);
      }, 3000);
    }, 2000);
  };

  const playRound = (pWins: number, oWins: number, currentOppTeam: PokemonDetails[]) => {
    if (pWins === 3) {
      handleWin();
      return;
    }
    if (oWins === 3) {
      setBattleState('LOSS');
      return;
    }

    const pFighter = activeMembers[Math.floor(Math.random() * activeMembers.length)];
    const oFighter = currentOppTeam[Math.floor(Math.random() * currentOppTeam.length)];
    const statsList = ['hp', 'attack', 'defense', 'speed'];
    const chosenStat = statsList[Math.floor(Math.random() * statsList.length)];

    setPlayerFighter(pFighter);
    setOpponentFighter(oFighter);
    setRoundStat('...'); // initial value
    
    // Reseta posições
    slideAnimPlayer.setValue(-300);
    slideAnimOpponent.setValue(300);
    attackAnim.setValue(0);

    // Animação de entrada
    Animated.parallel([
      Animated.timing(slideAnimPlayer, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnimOpponent, { toValue: 0, duration: 500, useNativeDriver: true })
    ]).start(() => {
      // Animação de sorteio
      let draws = 0;
      const maxDraws = 15;
      const drawInterval = setInterval(() => {
        draws++;
        if (draws >= maxDraws) {
          clearInterval(drawInterval);
          setRoundStat(chosenStat);
          
          setTimeout(() => {
            // Animação de ataque
            Animated.sequence([
              Animated.timing(attackAnim, { toValue: 1, duration: 300, easing: Easing.bounce, useNativeDriver: true }),
              Animated.timing(attackAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
              Animated.delay(1000)
            ]).start(() => {
              // Calcula vencedor
              const pStatVal = pFighter.stats.find(s => s.name === chosenStat)?.value || 0;
              const oStatVal = oFighter.stats.find(s => s.name === chosenStat)?.value || 0;

              let newPWins = pWins;
              let newOWins = oWins;

              if (pStatVal >= oStatVal) {
                addLog(`Seu ${pFighter.name} venceu com ${pStatVal} de ${chosenStat}!`);
                newPWins++;
                setPlayerWins(newPWins);
              } else {
                addLog(`${opponentName}'s ${oFighter.name} venceu com ${oStatVal} de ${chosenStat}!`);
                newOWins++;
                setOpponentWins(newOWins);
              }

              setTimeout(() => {
                playRound(newPWins, newOWins, currentOppTeam);
              }, 1500);
            });
          }, 500);
        } else {
          setRoundStat(statsList[draws % statsList.length]);
        }
      }, 100);
    });
  };

  const handleWin = async () => {
    setBattleState('REWARD');
    setCapturing(true);

    const spinAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: -1, duration: 150, useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: 0, duration: 150, useNativeDriver: true })
      ])
    );
    spinAnim.start();

    // Recompensa aleatória
    const randomId = Math.floor(Math.random() * 151) + 1;
    const p = await getPokemonDetails(randomId).catch(() => null);
    if (p) {
      setRewardPokemon(p);
      await capturePokemonInBackend(p.id);
      setCapturedPokemons([...capturedPokemons, p]);
    }
    
    setTimeout(() => {
      spinAnim.stop();
      rotateAnim.setValue(0);
      setCapturing(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {battleState === 'IDLE' && (
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Batalha Pokémon</Text>
          <Text style={styles.subtitle}>Encontre um oponente via WebSocket e batalhe!</Text>
          <Pressable style={styles.battleBtn} onPress={startSearch}>
            <Text style={styles.battleBtnText}>Buscar Oponente</Text>
          </Pressable>
        </View>
      )}

      {battleState === 'SEARCHING' && (
        <View style={styles.centerContainer}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Image source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png' }} style={styles.searchIcon} />
          </Animated.View>
          <Text style={styles.subtitle}>Procurando oponente...</Text>
        </View>
      )}

      {battleState === 'FOUND' && (
        <View style={styles.centerContainer}>
          <Text style={styles.vsTitle}>V S</Text>
          <View style={styles.vsRow}>
            <View style={styles.vsCard}>
              <Image source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${profile.avatarId}.png` }} style={styles.vsAvatar} />
              <Text style={styles.vsName}>{profile.name}</Text>
            </View>
            <Text style={styles.vsText}>X</Text>
            <View style={styles.vsCard}>
              <Image source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${opponentAvatar}.png` }} style={styles.vsAvatar} />
              <Text style={styles.vsName}>{opponentName}</Text>
            </View>
          </View>
        </View>
      )}

      {battleState === 'BATTLING' && playerFighter && opponentFighter && (
        <View style={styles.battleArena}>
          <View style={styles.scoreBoard}>
            <Text style={styles.scoreText}>{profile.name}: {playerWins}/3</Text>
            <Text style={styles.scoreText}>{opponentName}: {opponentWins}/3</Text>
          </View>
          <View style={styles.statAnnounceBox}>
            <Text style={styles.statAnnounceLabel}>⚔️ Status Sorteado para o Duelo ⚔️</Text>
            <Text style={styles.statAnnounceVal}>{roundStat.toUpperCase()}</Text>
            <Text style={styles.statAnnounceDesc}>O Pokémon com o maior valor neste atributo vence o round!</Text>
          </View>

          <View style={styles.fightersContainer}>
            <Animated.View style={[styles.fighterWrapper, { transform: [{ translateX: slideAnimPlayer }, { translateX: attackAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }) }] }]}>
              <Image source={{ uri: playerFighter.gifUrl }} style={styles.fighterSprite} />
              <Text style={styles.fighterName}>{playerFighter.name}</Text>
              <View style={styles.allStatsBox}>
                {['hp', 'attack', 'defense', 'speed'].map(statName => {
                  const isHighlighted = roundStat === statName;
                  return (
                    <View key={statName} style={[styles.statRow, isHighlighted && styles.statRowHighlighted]}>
                      <Text style={[styles.statName, isHighlighted && styles.statNameHighlighted]}>{statName.toUpperCase()}</Text>
                      <Text style={[styles.statValue, isHighlighted && styles.statValueHighlighted]}>
                        {playerFighter.stats.find(s => s.name === statName)?.value || 0}
                      </Text>
                    </View>
                  )
                })}
              </View>
            </Animated.View>

            <Animated.View style={[styles.fighterWrapper, { transform: [{ translateX: slideAnimOpponent }, { translateX: attackAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -50] }) }] }]}>
              <Image source={{ uri: opponentFighter.gifUrl }} style={styles.fighterSprite} />
              <Text style={styles.fighterName}>{opponentFighter.name}</Text>
              <View style={styles.allStatsBox}>
                {['hp', 'attack', 'defense', 'speed'].map(statName => {
                  const isHighlighted = roundStat === statName;
                  return (
                    <View key={statName} style={[styles.statRow, isHighlighted && styles.statRowHighlighted]}>
                      <Text style={[styles.statName, isHighlighted && styles.statNameHighlighted]}>{statName.toUpperCase()}</Text>
                      <Text style={[styles.statValue, isHighlighted && styles.statValueHighlighted]}>
                        {opponentFighter.stats.find(s => s.name === statName)?.value || 0}
                      </Text>
                    </View>
                  )
                })}
              </View>
            </Animated.View>
          </View>

          <View style={styles.logsBox}>
            {logs.map((log, i) => (
              <Text key={i} style={styles.logText}>{log}</Text>
            ))}
          </View>
        </View>
      )}

      {battleState === 'LOSS' && (
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Derrota!</Text>
          <Text style={styles.subtitle}>Seu oponente chegou a 3 vitórias primeiro.</Text>
          <Pressable style={styles.battleBtn} onPress={() => setBattleState('IDLE')}>
            <Text style={styles.battleBtnText}>Voltar</Text>
          </Pressable>
        </View>
      )}

      {battleState === 'REWARD' && (
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Vitória! 🏆</Text>
          {capturing ? (
            <Animated.View style={{ transform: [{ rotate: spin }], alignItems: 'center' }}>
              <Image source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png' }} style={styles.pokeballAnim} />
              <Text style={styles.subtitle}>Capturando prêmio...</Text>
            </Animated.View>
          ) : rewardPokemon ? (
            <View style={styles.rewardBox}>
              <Text style={styles.subtitle}>Você capturou:</Text>
              <Image source={{ uri: rewardPokemon.gifUrl }} style={styles.rewardSprite} />
              <Text style={styles.rewardName}>{rewardPokemon.name.toUpperCase()}</Text>
              <Text style={styles.subtitle}>Ele foi adicionado ao seu Box!</Text>
              <Pressable style={styles.battleBtn} onPress={() => setBattleState('IDLE')}>
                <Text style={styles.battleBtnText}>Continuar</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { color: '#FFF', fontSize: 32, fontWeight: '800', marginBottom: 10 },
  subtitle: { color: '#8B949E', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  battleBtn: { backgroundColor: '#FF3E3E', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  battleBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  searchIcon: { width: 80, height: 80, marginBottom: 20 },
  vsTitle: { color: '#FF3E3E', fontSize: 48, fontWeight: '900', marginBottom: 30 },
  vsRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  vsCard: { alignItems: 'center' },
  vsAvatar: { width: 100, height: 100 },
  vsName: { color: '#FFF', fontSize: 18, fontWeight: '700', marginTop: 10 },
  vsText: { color: '#8B949E', fontSize: 24, fontWeight: '800' },
  battleArena: { flex: 1, padding: 20, paddingTop: 40 },
  scoreBoard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 10 },
  scoreText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  statAnnounceBox: { alignItems: 'center', backgroundColor: 'rgba(244, 210, 60, 0.1)', padding: 15, borderRadius: 10, marginVertical: 20, borderWidth: 1, borderColor: '#F4D23C' },
  statAnnounceLabel: { color: '#F4D23C', fontSize: 14, fontWeight: '700', marginBottom: 5 },
  statAnnounceVal: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: 2 },
  statAnnounceDesc: { color: '#8B949E', fontSize: 12, marginTop: 5 },
  fightersContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 320, marginBottom: 40 },
  fighterWrapper: { alignItems: 'center', width: '45%' },
  fighterSprite: { width: '100%', height: 140, resizeMode: 'contain' },
  fighterName: { color: '#FFF', fontSize: 18, fontWeight: '800', marginTop: 10, textTransform: 'capitalize' },
  allStatsBox: { width: '100%', marginTop: 10, gap: 4 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 6 },
  statRowHighlighted: { backgroundColor: 'rgba(255, 62, 62, 0.2)', borderWidth: 1, borderColor: '#FF3E3E' },
  statName: { color: '#8B949E', fontSize: 10, fontWeight: '700' },
  statNameHighlighted: { color: '#FF3E3E' },
  statValue: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  statValueHighlighted: { color: '#FFF', fontSize: 14, fontWeight: '900' },
  logsBox: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 15 },
  logText: { color: '#8B949E', fontSize: 14, marginBottom: 5 },
  pokeballAnim: { width: 100, height: 100, marginBottom: 20 },
  rewardBox: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 30, borderRadius: 20 },
  rewardSprite: { width: 150, height: 150, marginVertical: 20 },
  rewardName: { color: '#F4D23C', fontSize: 24, fontWeight: '800', marginBottom: 10 }
});
