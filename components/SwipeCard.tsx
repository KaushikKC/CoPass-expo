import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MapPin, Calendar, Tag } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface SwipeCardProps {
  traveler: {
    id: string;
    name: string;
    age: number;
    profileImage: string;
    purpose: string;
    dates: string;
    interests: string[];
    bio: string;
    location: string;
  };
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ traveler }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Image source={{ uri: traveler.profileImage }} style={styles.profileImage} />
      
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]}>
            {traveler.name}, {traveler.age}
          </Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={[styles.location, { color: colors.textSecondary }]}>
              {traveler.location}
            </Text>
          </View>
        </View>

        <View style={[styles.purposeCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.purpose}>{traveler.purpose}</Text>
          <View style={styles.datesRow}>
            <Calendar size={14} color="#FFFFFF" />
            <Text style={styles.dates}>{traveler.dates}</Text>
          </View>
        </View>

        <Text style={[styles.bio, { color: colors.textSecondary }]}>{traveler.bio}</Text>

        <View style={styles.interestsContainer}>
          {traveler.interests.map((interest, index) => (
            <View key={index} style={[styles.interestTag, { backgroundColor: colors.accent }]}>
              <Tag size={12} color="#FFFFFF" />
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    height: 600,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    padding: 20,
    paddingTop: 100,
  },
  header: {
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    marginLeft: 4,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  purposeCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  purpose: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dates: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
    opacity: 0.9,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
});