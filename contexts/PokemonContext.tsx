import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, PokemonTeam, PokemonDetails } from '../@types/pokemon';
import { pokemonApi } from '../integration/api';
import { useAuth } from './AuthContext';

interface PokemonContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  team: PokemonTeam;
  setTeam: (team: PokemonTeam) => void;
  capturedPokemons: PokemonDetails[];
  setCapturedPokemons: (captured: PokemonDetails[]) => Promise<void>;
  updateProfileStats: (wins: number, losses: number, level: number) => Promise<void>;
  updateTeamInBackend: (removedId: number, newId: number) => Promise<void>;
  capturePokemonInBackend: (pokemonId: number) => Promise<void>;
  releasePokemonInBackend: (pokemonId: number) => Promise<void>;
  loadingData: boolean;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

const DEFAULT_PROFILE: UserProfile = {
  name: 'Treinador',
  avatarId: 25,
  borderTheme: 'pokeball',
  wins: 0,
  losses: 0,
};

const DEFAULT_TEAM: PokemonTeam = Array.from({ length: 6 }, (_, i) => ({
  id: `slot-${i + 1}`,
  pokemonId: null,
  nickname: '',
  level: 50,
  moves: [],
  pokemonDetails: null,
}));

export function PokemonProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, userId, username } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [team, setTeam] = useState<PokemonTeam>(DEFAULT_TEAM);
  const [capturedPokemons, setCapturedPokemons] = useState<PokemonDetails[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!isLoggedIn || !userId) return;
      
      setLoadingData(true);
      try {
        // Carrega Status do Perfil
        const stats = await pokemonApi.getProfileStats(userId).catch(() => null);
        setProfile({
          name: username || 'Treinador',
          avatarId: 25,
          borderTheme: 'pokeball',
          wins: stats?.vitorias ? Number(stats.vitorias) : 0,
          losses: stats?.derrotas ? Number(stats.derrotas) : 0,
        });

        // Carrega Time e Capturas da API
        const teamRes = await pokemonApi.getTeam(userId).catch(() => null);
        
        if (teamRes && teamRes.team) {
          const loadedTeam = [...DEFAULT_TEAM];
          for (let i = 0; i < Math.min(teamRes.team.length, 6); i++) {
            const p = teamRes.team[i];
            const pDetails: PokemonDetails = {
              id: Number(p.index),
              name: p.name,
              types: p.types,
              imageUrl: p.image,
              gifUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${p.index}.gif`,
              height: 0,
              weight: 0,
              stats: p.abilities.map((a: any) => ({ name: a.name, value: a.strength })),
            };
            loadedTeam[i] = {
              id: `slot-${i + 1}`,
              pokemonId: pDetails.id,
              nickname: pDetails.name.charAt(0).toUpperCase() + pDetails.name.slice(1),
              level: 50,
              moves: pDetails.stats.map((s) => s.name).slice(0, 4),
              pokemonDetails: pDetails,
            };
          }
          setTeam(loadedTeam);
        }

        if (teamRes && teamRes.capture) {
          const allCaptured = teamRes.capture.map((p: any) => ({
            id: Number(p.index),
            name: p.name,
            types: p.types,
            imageUrl: p.image,
            gifUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${p.index}.gif`,
            height: 0,
            weight: 0,
            stats: p.abilities.map((a: any) => ({ name: a.name, value: a.strength })),
          }));
          setCapturedPokemons(allCaptured);
        } else {
          setCapturedPokemons([]);
        }

      } catch (err) {
        console.error('Error loading data from API', err);
      } finally {
        setLoadingData(false);
      }
    }

    if (isLoggedIn) {
      loadData();
    } else {
      // Reseta ao fazer logout
      setProfile(DEFAULT_PROFILE);
      setTeam(DEFAULT_TEAM);
      setCapturedPokemons([]);
    }
  }, [isLoggedIn, userId, username]);

  const updateProfileStats = async (wins: number, losses: number, level: number = 1) => {
    if (!userId) return;
    try {
      await pokemonApi.updateProfileStats(userId, { 
        level: String(level), 
        vitorias: String(wins), 
        derrotas: String(losses) 
      });
      setProfile((prev) => ({ ...prev, wins, losses }));
    } catch (err) {
      console.error(err);
    }
  };

  const updateTeamInBackend = async (removedId: number, newId: number) => {
    if (!userId) return;
    try {
      await pokemonApi.updateTeam(userId, removedId, newId);
    } catch (err) {
      console.error(err);
    }
  };

  const capturePokemonInBackend = async (pokemonId: number) => {
    if (!userId) return;
    try {
      await pokemonApi.addCapturedPokemon(userId, pokemonId);
    } catch (err) {
      console.error(err);
    }
  };

  const releasePokemonInBackend = async (pokemonId: number) => {
    if (!userId) return;
    try {
      await pokemonApi.deleteCapturedPokemon(userId, pokemonId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PokemonContext.Provider
      value={{
        profile,
        setProfile,
        team,
        setTeam,
        capturedPokemons,
        setCapturedPokemons: async (c) => setCapturedPokemons(c),
        updateProfileStats,
        updateTeamInBackend,
        capturePokemonInBackend,
        releasePokemonInBackend,
        loadingData,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemonContext() {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error('usePokemonContext must be used within a PokemonProvider');
  }
  return context;
}
