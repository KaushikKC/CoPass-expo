export const Colors = {
  light: {
    primary: '#007AFF',
    secondary: '#34C759',
    accent: '#FF9500',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#E5E5EA',
    error: '#FF3B30',
    success: '#34C759',
  },
  dark: {
    primary: '#007AFF',
    secondary: '#34C759',
    accent: '#FF9500',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
  },
};

export const getColors = (isDark: boolean) => isDark ? Colors.dark : Colors.light;