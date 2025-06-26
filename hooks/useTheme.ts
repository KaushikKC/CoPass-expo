import { useColorScheme } from 'react-native';
import { getColors } from '@/constants/Colors';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  return { colors, isDark };
};