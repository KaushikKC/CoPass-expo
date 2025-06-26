import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MapPin, Calendar, Users } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface TripCardProps {
  trip: {
    id: string;
    destination: string;
    dates: string;
    purpose: string;
    image: string;
    status: string;
  };
  onPress?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface }]} onPress={onPress}>
      <Image source={{ uri: trip.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.locationRow}>
            <MapPin size={16} color={colors.primary} />
            <Text style={[styles.destination, { color: colors.text }]}>{trip.destination}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: trip.status === 'upcoming' ? colors.primary : colors.secondary }
          ]}>
            <Text style={styles.statusText}>{trip.status}</Text>
          </View>
        </View>
        <View style={styles.detailsRow}>
          <Calendar size={14} color={colors.textSecondary} />
          <Text style={[styles.dates, { color: colors.textSecondary }]}>{trip.dates}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Users size={14} color={colors.textSecondary} />
          <Text style={[styles.purpose, { color: colors.textSecondary }]}>{trip.purpose}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginHorizontal: 4,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: 280,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  destination: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dates: {
    fontSize: 14,
    marginLeft: 6,
  },
  purpose: {
    fontSize: 14,
    marginLeft: 6,
  },
});