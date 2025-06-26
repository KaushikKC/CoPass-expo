import { SkeletonLoader } from '@/components/SkeletonLoader';
import { TripCard } from '@/components/TripCard';
import { mockFeed, mockRequests, mockTrips } from '@/data/mockData';
import { Bell, Check, Heart, Plus, Search, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';

export default function HomeScreen() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleAddTrip = () => {
    Alert.alert('Add Trip', 'Trip creation form coming soon!');
  };

  const handleRequest = (action: 'accept' | 'reject', requestId: string) => {
    Alert.alert('Request', `Request ${action}ed!`);
  };

  const renderUpcomingTrips = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Trips</Text>
        <TouchableOpacity onPress={handleAddTrip}>
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {loading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <SkeletonLoader key={index} width={280} height={180} style={styles.skeletonCard} />
          ))
        ) : (
          mockTrips
            .filter(trip => trip.status === 'upcoming')
            .map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))
        )}
      </ScrollView>
    </View>
  );

  const renderPendingRequests = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Requests</Text>
      {loading ? (
        Array.from({ length: 2 }).map((_, index) => (
          <View key={index} style={[styles.requestCard, { backgroundColor: colors.surface }]}>
            <SkeletonLoader width={50} height={50} borderRadius={25} />
            <View style={styles.requestContent}>
              <SkeletonLoader width={120} height={16} />
              <SkeletonLoader width={180} height={14} style={{ marginTop: 4 }} />
            </View>
          </View>
        ))
      ) : (
        mockRequests.map((request) => (
          <View key={request.id} style={[styles.requestCard, { backgroundColor: colors.surface }]}>
            <Image source={{ uri: request.profileImage }} style={styles.requestAvatar} />
            <View style={styles.requestContent}>
              <Text style={[styles.requestName, { color: colors.text }]}>{request.name}</Text>
              <Text style={[styles.requestMessage, { color: colors.textSecondary }]}>
                {request.message}
              </Text>
              <Text style={[styles.requestTime, { color: colors.textSecondary }]}>
                {request.time}
              </Text>
            </View>
            <View style={styles.requestActions}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.secondary }]}
                onPress={() => handleRequest('accept', request.id)}
              >
                <Check size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.error }]}
                onPress={() => handleRequest('reject', request.id)}
              >
                <X size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderTravelFeed = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Travel Feed</Text>
      {loading ? (
        Array.from({ length: 2 }).map((_, index) => (
          <View key={index} style={[styles.feedCard, { backgroundColor: colors.surface }]}>
            <SkeletonLoader width="100%" height={160} />
            <View style={styles.feedContent}>
              <SkeletonLoader width={150} height={18} />
              <SkeletonLoader width="100%" height={14} style={{ marginTop: 8 }} />
            </View>
          </View>
        ))
      ) : (
        mockFeed.map((item) => (
          <TouchableOpacity key={item.id} style={[styles.feedCard, { backgroundColor: colors.surface }]}>
            <Image source={{ uri: item.image }} style={styles.feedImage} />
            <View style={styles.feedContent}>
              <Text style={[styles.feedTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.feedExcerpt, { color: colors.textSecondary }]}>
                {item.excerpt}
              </Text>
              <View style={styles.feedMeta}>
                <View style={styles.feedAuthor}>
                  <Image source={{ uri: item.authorImage }} style={styles.feedAuthorAvatar} />
                  <Text style={[styles.feedAuthorName, { color: colors.textSecondary }]}>
                    {item.author}
                  </Text>
                </View>
                <View style={styles.feedStats}>
                  <Heart size={16} color={colors.textSecondary} />
                  <Text style={[styles.feedLikes, { color: colors.textSecondary }]}>
                    {item.likes}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good morning</Text>
          <Text style={[styles.userName, { color: colors.text }]}>John</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Search size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Bell size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderUpcomingTrips()}
        {renderPendingRequests()}
        {renderTravelFeed()}
      </ScrollView>
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
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  horizontalScroll: {
    paddingLeft: 0,
  },
  skeletonCard: {
    marginRight: 16,
    borderRadius: 16,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  requestAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  requestContent: {
    flex: 1,
    marginLeft: 12,
  },
  requestName: {
    fontSize: 16,
    fontWeight: '600',
  },
  requestMessage: {
    fontSize: 14,
    marginTop: 2,
  },
  requestTime: {
    fontSize: 12,
    marginTop: 4,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  feedImage: {
    width: '100%',
    height: 160,
  },
  feedContent: {
    padding: 16,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  feedExcerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  feedMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedAuthorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  feedAuthorName: {
    fontSize: 14,
  },
  feedStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feedLikes: {
    fontSize: 14,
  },
});