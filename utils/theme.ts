export interface TypeTheme {
  primary: string;
  lightBg: string;
  glow: string;
  badgeText: string;
}

export const typeColors: Record<string, TypeTheme> = {
  normal: { primary: '#9099A1', lightBg: '#EAEADE', glow: 'rgba(144, 153, 161, 0.4)', badgeText: '#FFFFFF' },
  fire: { primary: '#FF9C54', lightBg: '#FFF0E5', glow: 'rgba(255, 156, 84, 0.4)', badgeText: '#FFFFFF' },
  water: { primary: '#4D90E2', lightBg: '#E5F1FF', glow: 'rgba(77, 144, 226, 0.4)', badgeText: '#FFFFFF' },
  grass: { primary: '#63BB5B', lightBg: '#EEFFE5', glow: 'rgba(99, 187, 91, 0.4)', badgeText: '#FFFFFF' },
  electric: { primary: '#F4D23C', lightBg: '#FFFBE6', glow: 'rgba(244, 210, 60, 0.5)', badgeText: '#1E1E24' },
  ice: { primary: '#74CEC0', lightBg: '#EBFBFA', glow: 'rgba(116, 206, 192, 0.4)', badgeText: '#FFFFFF' },
  fighting: { primary: '#CE4069', lightBg: '#FCE7ED', glow: 'rgba(206, 64, 105, 0.4)', badgeText: '#FFFFFF' },
  poison: { primary: '#AB6AC8', lightBg: '#F8ECFC', glow: 'rgba(171, 106, 200, 0.4)', badgeText: '#FFFFFF' },
  ground: { primary: '#D97746', lightBg: '#FDF1EB', glow: 'rgba(217, 119, 70, 0.4)', badgeText: '#FFFFFF' },
  flying: { primary: '#92A9EC', lightBg: '#EDF1FE', glow: 'rgba(146, 169, 236, 0.4)', badgeText: '#FFFFFF' },
  psychic: { primary: '#F97176', lightBg: '#FFEAEB', glow: 'rgba(249, 113, 118, 0.4)', badgeText: '#FFFFFF' },
  bug: { primary: '#90C12C', lightBg: '#F4FBE7', glow: 'rgba(144, 193, 44, 0.4)', badgeText: '#FFFFFF' },
  rock: { primary: '#C7B78B', lightBg: '#F5F2E9', glow: 'rgba(199, 183, 139, 0.4)', badgeText: '#FFFFFF' },
  ghost: { primary: '#5269AC', lightBg: '#EBEEF7', glow: 'rgba(82, 105, 172, 0.4)', badgeText: '#FFFFFF' },
  dragon: { primary: '#0A6FC2', lightBg: '#E0F0FD', glow: 'rgba(10, 111, 194, 0.4)', badgeText: '#FFFFFF' },
  dark: { primary: '#5A5366', lightBg: '#F0EFF2', glow: 'rgba(90, 83, 102, 0.4)', badgeText: '#FFFFFF' },
  steel: { primary: '#5A8EA1', lightBg: '#ECF4F7', glow: 'rgba(90, 142, 161, 0.4)', badgeText: '#FFFFFF' },
  fairy: { primary: '#EC8FE6', lightBg: '#FDF2FC', glow: 'rgba(236, 143, 230, 0.4)', badgeText: '#FFFFFF' },
};

export const getPokemonTypeTheme = (typeName?: string): TypeTheme => {
  if (!typeName) return typeColors.normal;
  const normalized = typeName.toLowerCase();
  return typeColors[normalized] || typeColors.normal;
};

export interface BorderTheme {
  name: string;
  borderColor: string;
  glowColor: string;
  backgroundStyle: string; // Estilo CSS ou cor
  label: string;
}

export const borderThemes: Record<string, BorderTheme> = {
  pokeball: {
    name: 'pokeball',
    label: 'Poké Ball',
    borderColor: '#E3350D',
    glowColor: 'rgba(227, 53, 13, 0.6)',
    backgroundStyle: 'linear-gradient(135deg, #FF1C1C 0%, #FF1C1C 50%, #FFFFFF 50%, #FFFFFF 100%)',
  },
  greatball: {
    name: 'greatball',
    label: 'Great Ball',
    borderColor: '#005EA8',
    glowColor: 'rgba(0, 94, 168, 0.6)',
    backgroundStyle: 'linear-gradient(135deg, #005EA8 0%, #005EA8 40%, #E3350D 40%, #E3350D 50%, #FFFFFF 50%, #FFFFFF 100%)',
  },
  ultraball: {
    name: 'ultraball',
    label: 'Ultra Ball',
    borderColor: '#303030',
    glowColor: 'rgba(244, 210, 60, 0.7)',
    backgroundStyle: 'linear-gradient(135deg, #303030 0%, #303030 40%, #F4D23C 40%, #F4D23C 50%, #FFFFFF 50%, #FFFFFF 100%)',
  },
  masterball: {
    name: 'masterball',
    label: 'Master Ball',
    borderColor: '#7B2F90',
    glowColor: 'rgba(123, 47, 144, 0.6)',
    backgroundStyle: 'linear-gradient(135deg, #7B2F90 0%, #7B2F90 40%, #D81A5F 40%, #D81A5F 50%, #FFFFFF 50%, #FFFFFF 100%)',
  },
};

export const theme = {
  colors: {
    background: '#0D0E12',
    cardBg: '#1A1C23',
    navbarBg: '#13141A',
    textPrimary: '#FFFFFF',
    textSecondary: '#8B949E',
    accent: '#FF3E3E',
    border: 'rgba(255, 255, 255, 0.08)',
    inputBg: 'rgba(255, 255, 255, 0.05)',
  },
  glassmorphism: {
    backgroundColor: 'rgba(26, 28, 35, 0.75)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
  },
};
