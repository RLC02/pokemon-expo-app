export interface PokemonType {
  name: string;
  url: string;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonDetails {
  id: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  stats: PokemonStat[];
  gifUrl: string;
  imageUrl: string;
}

export interface UserProfile {
  name: string;
  avatarId: number; // Pokemon ID used as profile pic
  borderTheme: 'pokeball' | 'greatball' | 'ultraball' | 'masterball';
  wins: number;
  losses: number;
}

export interface TeamMember {
  id: string; // Unique ID for this specific team slot instance
  pokemonId: number | null; // Null means empty slot
  nickname: string;
  level: number;
  moves: string[]; // Up to 4 moves
  pokemonDetails?: PokemonDetails | null;
}

export type PokemonTeam = TeamMember[]; // Max 6 members
