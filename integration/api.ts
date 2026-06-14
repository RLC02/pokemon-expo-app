import { PokemonDetails } from '../@types/pokemon';

// ==========================================
// POKEAPI (Externa)
// ==========================================
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Cache em memória para evitar requisições duplicadas
const pokemonDetailsCache: Record<string, PokemonDetails> = {};
let allMovesCache: string[] = [];

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  results: PokemonListItem[];
  next: string | null;
  previous: string | null;
  count: number;
}

/**
 * Busca detalhes de um Pokémon (por nome ou ID)
 */
export async function getPokemonDetails(nameOrId: string | number): Promise<PokemonDetails> {
  const identifier = String(nameOrId).toLowerCase();

  if (pokemonDetailsCache[identifier]) {
    return pokemonDetailsCache[identifier];
  }

  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${identifier}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon details for: ${nameOrId}`);
  }

  const data = await response.json();

  // Extrai os tipos
  const types = data.types.map((t: any) => t.type.name);

  // Extrai os atributos
  const stats = data.stats.map((s: any) => ({
    name: s.stat.name,
    value: s.base_stat,
  }));

  // Extrai os sprites (Geração V tem GIFs de alta qualidade!)
  const animatedGif = data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default;
  const officialArtwork = data.sprites?.other?.['official-artwork']?.front_default;
  const standardSprite = data.sprites?.front_default;

  const pokemonDetails: PokemonDetails = {
    id: data.id,
    name: data.name,
    types,
    height: data.height,
    weight: data.weight,
    stats,
    gifUrl: animatedGif || officialArtwork || standardSprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
    imageUrl: officialArtwork || standardSprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
  };

  // Salva no cache por nome e ID
  pokemonDetailsCache[data.name] = pokemonDetails;
  pokemonDetailsCache[String(data.id)] = pokemonDetails;

  return pokemonDetails;
}

/**
 * Busca uma lista de Pokémons com detalhes
 */
export async function getPokemonList(limit = 20, offset = 0): Promise<{
  pokemons: PokemonDetails[];
  hasMore: boolean;
  totalCount: number;
}> {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokémon list');
  }

  const data: PokemonListResponse = await response.json();
  
  // Busca detalhes em paralelo
  const detailPromises = data.results.map((item) =>
    getPokemonDetails(item.name).catch((err) => {
      console.error(err);
      return null;
    })
  );

  const results = await Promise.all(detailPromises);
  const pokemons = results.filter((p): p is PokemonDetails => p !== null);

  return {
    pokemons,
    hasMore: data.next !== null,
    totalCount: data.count,
  };
}

/**
 * Busca ataques de um Pokémon
 */
export async function getPokemonMoves(pokemonId: number): Promise<string[]> {
  try {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${pokemonId}`);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.moves.map((m: any) => m.move.name).slice(0, 15); // Limita aos top 15 ataques
  } catch (err) {
    console.error('Error fetching moves:', err);
    return [];
  }
}

// ==========================================
// BACKEND API (Própria)
// ==========================================
const BACKEND_BASE_URL = 'https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon';

export const pokemonApi = {
  // Autenticação e Perfil
  register: async (data: { username: string; password: string }) => {
    const response = await fetch(`${BACKEND_BASE_URL}/auth/v1/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Register failed with status: ${response.status}`);
    }
    return response.json();
  },

  login: async (data: { username: string; password: string }) => {
    const response = await fetch(`${BACKEND_BASE_URL}/auth/v1/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }
    return response.json(); // Retorna dados do login
  },

  getProfileStats: async (userId: string) => {
    const response = await fetch(`${BACKEND_BASE_URL}/auth/v1/stats/${userId}`);
    if (!response.ok) {
      if (response.status === 404) return null; // Não encontrado
      throw new Error(`Failed to get stats: ${response.status}`);
    }
    return response.json(); // Retorna { level, vitorias, derrotas }
  },

  updateProfileStats: async (userId: string, data: { level: string | number; vitorias: string | number; derrotas: string | number }) => {
    const response = await fetch(`${BACKEND_BASE_URL}/auth/v1/stats/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update stats: ${response.status}`);
    }
    return response.json();
  },

  // Time
  getTeam: async (userId: string) => {
    const response = await fetch(`${BACKEND_BASE_URL}/pokemon/v1/team?user-id=${userId}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to get team: ${response.status}`);
    }
    return response.json();
  },

  updateTeam: async (userId: string, removedPokemonId: number | string, newPokemonId: number | string) => {
    const response = await fetch(`${BACKEND_BASE_URL}/pokemon/v1/team?user-id=${userId}&removed-pokemon=${removedPokemonId}&new-pokemon=${newPokemonId}`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error(`Failed to update team: ${response.status}`);
    }
    return response.json();
  },

  // Capturados
  addCapturedPokemon: async (userId: string, pokemonId: number | string) => {
    const response = await fetch(`${BACKEND_BASE_URL}/pokemon/v1/captured?user-id=${userId}&pokemon-id=${pokemonId}`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error(`Failed to capture pokemon: ${response.status}`);
    }
    return response.json();
  },

  deleteCapturedPokemon: async (userId: string, pokemonId: number | string) => {
    const response = await fetch(`${BACKEND_BASE_URL}/pokemon/v1/captured?user-id=${userId}&pokemon-id=${pokemonId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to release pokemon: ${response.status}`);
    }
    return response.json();
  },
};
