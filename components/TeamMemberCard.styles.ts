import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  emptyCard: {
    height: 260,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      } as any,
    }),
  },
  emptyCardHovered: {
    borderColor: '#FF3E3E',
    backgroundColor: 'rgba(255, 62, 62, 0.03)',
  },
  emptyBall: {
    width: 50,
    height: 50,
    opacity: 0.25,
    marginBottom: 12,
    ...Platform.select({
      web: {
        transition: 'transform 0.3s ease',
      } as any,
    }),
  },
  emptyBallHovered: {
    opacity: 0.6,
    transform: [{ rotate: '45deg' }, { scale: 1.1 }],
  },
  emptyText: {
    color: '#8B949E',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  addText: {
    color: '#FF3E3E',
    fontSize: 14,
    fontWeight: '700',
  },
  cardContainer: {
    height: 260,
    backgroundColor: '#161821',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      } as any,
    }),
  },
  cardContainerHovered: {
    backgroundColor: '#1E202C',
    transform: [{ translateY: -4 }],
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
  },
  spriteContainer: {
    width: 76,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  roundBackground: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.15,
  },
  spriteImage: {
    width: 56,
    height: 56,
    zIndex: 2,
  },
  headerInfo: {
    flex: 1,
  },
  pokemonName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  speciesText: {
    color: '#8B949E',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 6,
  },
  typeBadgeContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  typeBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  statsContainer: {
    marginTop: 8,
  },
  statsTitle: {
    color: '#8B949E',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  statSlot: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statNameText: {
    color: '#8B949E',
    fontSize: 10,
    fontWeight: '600',
  },
  statValueText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  removeButton: {
    backgroundColor: 'rgba(255, 62, 62, 0.08)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  pokedexHeaderMini: {
    position: 'absolute',
    top: 8,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniBlueLight: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00A8FF',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  miniRedLight: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF3E3E',
  },
  miniYellowLight: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F4D23C',
  },
  miniGreenLight: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4CD964',
  },
  removeText: {
    color: '#FF6464',
  },
});
