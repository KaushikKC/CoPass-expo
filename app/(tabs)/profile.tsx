import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard as Edit3, MapPin, Calendar, Star, Instagram, Twitter, Settings, Share, Camera } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { TripCard } from '@/components/TripCard';
import { mockProfile, mockTrips } from '@/data/mockData';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockProfile);

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleImageUpload = () => {
    Alert.alert('Upload Photo', 'Camera/Gallery picker coming soon!');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        color={index < Math.floor(rating) ? '#FFD700' : colors.border}
        fill={index < Math.floor(rating) ? '#FFD700' : 'transparent'}
      />
    ));
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.surface }]}>
      <View style={styles.headerTop}>
        <TouchableOpacity>
          <Settings size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Share size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileImageContainer}>
        <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
        <TouchableOpacity 
          style={[styles.cameraButton, { backgroundColor: colors.primary }]}
          onPress={handleImageUpload}
        >
          <Camera size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Text style={[styles.name, { color: colors.text }]}>{profile.name}</Text>
      <View style={styles.locationRow}>
        <MapPin size={16} color={colors.textSecondary} />
        <Text style={[styles.location, { color: colors.textSecondary }]}>{profile.location}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{profile.completedTrips}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Trips</Text>
        </View>
        <View style={styles.stat}>
          <View style={styles.ratingRow}>
            {renderStars(profile.rating)}
            <Text style={[styles.rating, { color: colors.text }]}>{profile.rating}</Text>
          </View>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: colors.text }]}>{profile.reviews.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Reviews</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.editButton, { backgroundColor: isEditing ? colors.secondary : colors.primary }]}
        onPress={isEditing ? handleSave : () => setIsEditing(true)}
      >
        <Edit3 size={16} color="#FFFFFF" />
        <Text style={styles.editButtonText}>
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderBioSection = () => (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
      {isEditing ? (
        <TextInput
          style={[styles.bioInput, { color: colors.text, borderColor: colors.border }]}
          value={profile.bio}
          onChangeText={(text) => setProfile({ ...profile, bio: text })}
          multiline
          numberOfLines={4}
        />
      ) : (
        <Text style={[styles.bio, { color: colors.textSecondary }]}>{profile.bio}</Text>
      )}
    </View>
  );

  const renderSocialLinks = () => (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Social Links</Text>
      <View style={styles.socialContainer}>
        <View style={styles.socialItem}>
          <Twitter size={20} color="#1DA1F2" />
          {isEditing ? (
            <TextInput
              style={[styles.socialInput, { color: colors.text, borderColor: colors.border }]}
              value={profile.socialLinks.twitter}
              onChangeText={(text) => setProfile({ 
                ...profile, 
                socialLinks: { ...profile.socialLinks, twitter: text }
              })}
              placeholder="Twitter username"
              placeholderTextColor={colors.textSecondary}
            />
          ) : (
            <Text style={[styles.socialText, { color: colors.textSecondary }]}>
              {profile.socialLinks.twitter}
            </Text>
          )}
        </View>
        <View style={styles.socialItem}>
          <Instagram size={20} color="#E4405F" />
          {isEditing ? (
            <TextInput
              style={[styles.socialInput, { color: colors.text, borderColor: colors.border }]}
              value={profile.socialLinks.instagram}
              onChangeText={(text) => setProfile({ 
                ...profile, 
                socialLinks: { ...profile.socialLinks, instagram: text }
              })}
              placeholder="Instagram username"
              placeholderTextColor={colors.textSecondary}
            />
          ) : (
            <Text style={[styles.socialText, { color: colors.textSecondary }]}>
              {profile.socialLinks.instagram}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderTripsSection = () => (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Past Trips</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tripsContainer}
      >
        {mockTrips
          .filter(trip => trip.status === 'completed')
          .map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
      </ScrollView>
    </View>
  );

  const renderReviewsSection = () => (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews</Text>
      {profile.reviews.map((review) => (
        <View key={review.id} style={styles.reviewItem}>
          <View style={styles.reviewHeader}>
            <Image source={{ uri: review.authorImage }} style={styles.reviewAvatar} />
            <View style={styles.reviewMeta}>
              <Text style={[styles.reviewAuthor, { color: colors.text }]}>{review.author}</Text>
              <View style={styles.reviewRating}>
                {renderStars(review.rating)}
                <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>{review.date}</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.reviewText, { color: colors.textSecondary }]}>{review.text}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderBioSection()}
        {renderSocialLinks()}
        {renderTripsSection()}
        {renderReviewsSection()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 16,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
  },
  bioInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  socialContainer: {
    gap: 16,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  socialText: {
    fontSize: 16,
  },
  socialInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  tripsContainer: {
    paddingLeft: 0,
  },
  reviewItem: {
    marginBottom: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewMeta: {
    flex: 1,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewDate: {
    fontSize: 14,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
});