import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Heart, RotateCcw, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { SwipeCard } from '@/components/SwipeCard';
import { mockTravelers } from '@/data/mockData';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.7;

export default function MatchScreen() {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardStack, setCardStack] = useState(mockTravelers);

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentTraveler = cardStack[currentIndex];
    
    if (direction === 'right') {
      // Mock match logic
      if (Math.random() > 0.7) {
        // It's a match!
        Alert.alert(
          '🎉 It\'s a Match!',
          `You and ${currentTraveler.name} both want to connect!`,
          [
            { text: 'Send Message', style: 'default' },
            { text: 'Keep Swiping', style: 'cancel' }
          ]
        );
      }
    }

    if (currentIndex < cardStack.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // No more cards
      Alert.alert('No More Travelers', 'Check back later for more potential connections!');
    }
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const renderCard = (traveler: any, index: number) => {
    if (index < currentIndex) return null;
    
    const isVisible = index <= currentIndex + 1;
    const translateY = (index - currentIndex) * 4;
    const scale = 1 - (index - currentIndex) * 0.02;
    const opacity = index === currentIndex ? 1 : 0.8;

    if (!isVisible) return null;

    return (
      <View
        key={traveler.id}
        style={[
          styles.cardContainer,
          {
            transform: [{ translateY }, { scale }],
            opacity,
            zIndex: cardStack.length - index,
          }
        ]}
      >
        <SwipeCard traveler={traveler} />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Discover</Text>
        <TouchableOpacity>
          <Sparkles size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardStack}>
        {currentIndex >= cardStack.length ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No More Travelers
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Check back later for more potential connections!
            </Text>
          </View>
        ) : (
          cardStack.map((traveler, index) => renderCard(traveler, index))
        )}
      </View>

      <View style={[styles.actions, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton, { backgroundColor: colors.error }]}
          onPress={() => handleSwipe('left')}
          disabled={currentIndex >= cardStack.length}
        >
          <X size={32} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.undoButton, { backgroundColor: colors.textSecondary }]}
          onPress={handleUndo}
          disabled={currentIndex === 0}
        >
          <RotateCcw size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton, { backgroundColor: colors.secondary }]}
          onPress={() => handleSwipe('right')}
          disabled={currentIndex >= cardStack.length}
        >
          <Heart size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.progress}>
        <View 
          style={[
            styles.progressBar,
            { 
              width: `${((currentIndex + 1) / cardStack.length) * 100}%`,
              backgroundColor: colors.primary 
            }
          ]} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardStack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    position: 'absolute',
    width: width - 40,
    height: CARD_HEIGHT,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 24,
    gap: 20,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  passButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  undoButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  likeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  progress: {
    height: 4,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});