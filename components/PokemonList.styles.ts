import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  searchSection: {
    backgroundColor: 'rgba(26, 28, 35, 0.5)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    gap: 12,
  },
  searchInput: {
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
  sectionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  typeFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s',
      } as any,
    }),
  },
  typeButtonText: {
    color: '#8B949E',
    fontSize: 11,
    fontWeight: '700',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  gridCol: {
    paddingHorizontal: 8,
    marginBottom: 16,
    ...Platform.select({
      web: {
        width: '25%', // 4 columns on larger screens
      } as any,
      default: {
        width: '50%', // 2 columns on mobile by default
      },
    }),
  },
  centerContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#8B949E',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    color: '#8B949E',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#FF3E3E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
