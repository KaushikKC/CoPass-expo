import { mockProfile, mockTrips } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import {
  Award,
  Calendar,
  CheckCircle,
  CreditCard,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Lock,
  MapPin,
  MessageCircle,
  Plus,
  Settings,
  Shield,
  Star,
  UserPlus,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProfileSection {
  id: string;
  title: string;
  visible: boolean;
  icon: React.ReactNode;
}

export default function ProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "about" | "trips" | "bookings" | "privacy"
  >("about");
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true); // For demo, showing own profile

  // Profile sections with visibility controls
  const [profileSections, setProfileSections] = useState<ProfileSection[]>([
    { id: "bio", title: "Bio", visible: true, icon: <FileText size={16} /> },
    {
      id: "languages",
      title: "Languages",
      visible: true,
      icon: <Globe size={16} />,
    },
    {
      id: "interests",
      title: "Interests",
      visible: true,
      icon: <Award size={16} />,
    },
    {
      id: "reviews",
      title: "Reviews",
      visible: true,
      icon: <Star size={16} />,
    },
    {
      id: "bookings",
      title: "Shared Bookings",
      visible: true,
      icon: <CreditCard size={16} />,
    },
    {
      id: "lens",
      title: "Lens Profile",
      visible: true,
      icon: <CheckCircle size={16} />,
    },
  ]);

  const mockSharedBookings = [
    {
      id: "1",
      title: "Shared Hotel - Token2049",
      amount: "0.2 ETH",
      status: "active",
      counterparty: "Emma Johnson",
      date: "Mar 15-20, 2024",
      rating: 5,
    },
    {
      id: "2",
      title: "Airport Transfer",
      amount: "0.05 ETH",
      status: "completed",
      counterparty: "Alex Chen",
      date: "Feb 10, 2024",
      rating: 4,
    },
  ];

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handlePrivacySettings = () => {
    setShowPrivacyModal(true);
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setProfileSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, visible: !section.visible }
          : section
      )
    );
  };

  const renderAboutTab = () => (
    <ScrollView style={styles.tabContent}>
      {profileSections.find((s) => s.id === "bio")?.visible && (
        <View
          style={[
            styles.section,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Bio
            </Text>
            {isOwnProfile && (
              <TouchableOpacity onPress={() => setShowEditModal(true)}>
                <Edit3 size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={[styles.bioText, { color: colors.textSecondary }]}>
            {mockProfile.bio}
          </Text>
        </View>
      )}

      {profileSections.find((s) => s.id === "languages")?.visible && (
        <View
          style={[
            styles.section,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Languages
            </Text>
            {isOwnProfile && (
              <TouchableOpacity onPress={() => setShowEditModal(true)}>
                <Edit3 size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.languageTags}>
            {["English", "Spanish", "French"].map((lang, index) => (
              <View
                key={index}
                style={[styles.languageTag, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.languageText}>{lang}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {profileSections.find((s) => s.id === "interests")?.visible && (
        <View
          style={[
            styles.section,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Interests
            </Text>
            {isOwnProfile && (
              <TouchableOpacity onPress={() => setShowEditModal(true)}>
                <Edit3 size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.interestTags}>
            {["Web3", "Travel", "Photography", "Food", "Culture"].map(
              (interest, index) => (
                <View
                  key={index}
                  style={[
                    styles.interestTag,
                    { backgroundColor: colors.accent },
                  ]}
                >
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              )
            )}
          </View>
        </View>
      )}

      {profileSections.find((s) => s.id === "reviews")?.visible && (
        <View
          style={[
            styles.section,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Reviews
            </Text>
          </View>
          <View style={styles.reviewStats}>
            <View style={styles.ratingContainer}>
              <Star size={24} color={colors.primary} />
              <Text style={[styles.ratingText, { color: colors.text }]}>
                {mockProfile.rating}/5.0
              </Text>
            </View>
            <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
              {mockProfile.reviews.length} reviews
            </Text>
          </View>
          <FlatList
            data={mockProfile.reviews.slice(0, 2)}
            renderItem={({ item }) => (
              <View style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={{ uri: item.authorImage }}
                    style={styles.reviewerAvatar}
                  />
                  <View style={styles.reviewerInfo}>
                    <Text style={[styles.reviewerName, { color: colors.text }]}>
                      {item.author}
                    </Text>
                    <View style={styles.reviewRating}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          color={
                            star <= item.rating ? colors.primary : colors.border
                          }
                          fill={
                            star <= item.rating ? colors.primary : "transparent"
                          }
                        />
                      ))}
                    </View>
                  </View>
                  <Text
                    style={[styles.reviewDate, { color: colors.textSecondary }]}
                  >
                    {item.date}
                  </Text>
                </View>
                <Text
                  style={[styles.reviewText, { color: colors.textSecondary }]}
                >
                  {item.text}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      )}
    </ScrollView>
  );

  const renderTripsTab = () => (
    <ScrollView style={styles.tabContent}>
      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Active Trips
          </Text>
          {isOwnProfile && (
            <TouchableOpacity onPress={() => router.push("/add-trip")}>
              <Plus size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={mockTrips.filter((trip) => trip.status === "upcoming")}
          renderItem={({ item }) => (
            <View
              style={[
                styles.tripCard,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.tripImage} />
              <View style={styles.tripInfo}>
                <Text style={[styles.tripDestination, { color: colors.text }]}>
                  {item.destination}
                </Text>
                <Text
                  style={[styles.tripDates, { color: colors.textSecondary }]}
                >
                  {item.dates}
                </Text>
                <Text
                  style={[styles.tripPurpose, { color: colors.textSecondary }]}
                >
                  {item.purpose}
                </Text>
              </View>
              <View style={styles.tripVisibility}>
                <Globe size={16} color={colors.textSecondary} />
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Past Trips
          </Text>
        </View>
        <FlatList
          data={mockTrips.filter((trip) => trip.status === "completed")}
          renderItem={({ item }) => (
            <View
              style={[
                styles.tripCard,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Image source={{ uri: item.image }} style={styles.tripImage} />
              <View style={styles.tripInfo}>
                <Text style={[styles.tripDestination, { color: colors.text }]}>
                  {item.destination}
                </Text>
                <Text
                  style={[styles.tripDates, { color: colors.textSecondary }]}
                >
                  {item.dates}
                </Text>
                <Text
                  style={[styles.tripPurpose, { color: colors.textSecondary }]}
                >
                  {item.purpose}
                </Text>
              </View>
              <View style={styles.tripVisibility}>
                <Lock size={16} color={colors.textSecondary} />
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );

  const renderBookingsTab = () => (
    <ScrollView style={styles.tabContent}>
      {profileSections.find((s) => s.id === "bookings")?.visible ? (
        <View
          style={[
            styles.section,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Shared Bookings
            </Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Shared Bookings",
                  "View all shared bookings coming soon!"
                )
              }
            >
              <Text style={[styles.viewAllText, { color: colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={mockSharedBookings}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.bookingCard,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.bookingHeader}>
                  <Text style={[styles.bookingTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          item.status === "active"
                            ? colors.primary
                            : colors.secondary,
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.bookingDetails}>
                  <Text style={[styles.bookingAmount, { color: colors.text }]}>
                    {item.amount}
                  </Text>
                  <Text
                    style={[
                      styles.bookingCounterparty,
                      { color: colors.textSecondary },
                    ]}
                  >
                    with {item.counterparty}
                  </Text>
                  <Text
                    style={[
                      styles.bookingDate,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.date}
                  </Text>
                </View>
                {item.rating && (
                  <View style={styles.bookingRating}>
                    <Star size={16} color={colors.primary} />
                    <Text style={[styles.ratingText, { color: colors.text }]}>
                      {item.rating}/5
                    </Text>
                  </View>
                )}
              </View>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      ) : (
        <View style={styles.hiddenSection}>
          <Lock size={48} color={colors.textSecondary} />
          <Text style={[styles.hiddenText, { color: colors.textSecondary }]}>
            Shared bookings are hidden
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderPrivacyTab = () => (
    <ScrollView style={styles.tabContent}>
      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Profile Visibility
          </Text>
        </View>
        <Text
          style={[styles.sectionDescription, { color: colors.textSecondary }]}
        >
          Control what others can see on your profile
        </Text>

        {profileSections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.visibilityItem,
              { borderBottomColor: colors.border },
            ]}
            onPress={() => toggleSectionVisibility(section.id)}
          >
            <View style={styles.visibilityInfo}>
              {section.icon}
              <Text style={[styles.visibilityTitle, { color: colors.text }]}>
                {section.title}
              </Text>
            </View>
            <View style={styles.visibilityToggle}>
              {section.visible ? (
                <Eye size={20} color={colors.primary} />
              ) : (
                <EyeOff size={20} color={colors.textSecondary} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Privacy Settings
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.privacyItem, { borderBottomColor: colors.border }]}
        >
          <View style={styles.privacyInfo}>
            <Shield size={20} color={colors.text} />
            <Text style={[styles.privacyTitle, { color: colors.text }]}>
              Profile Visibility
            </Text>
          </View>
          <Text style={[styles.privacyValue, { color: colors.textSecondary }]}>
            Public
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.privacyItem, { borderBottomColor: colors.border }]}
        >
          <View style={styles.privacyInfo}>
            <Users size={20} color={colors.text} />
            <Text style={[styles.privacyTitle, { color: colors.text }]}>
              Show to Matches Only
            </Text>
          </View>
          <Text style={[styles.privacyValue, { color: colors.textSecondary }]}>
            Enabled
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Profile
        </Text>
        <View style={styles.headerActions}>
          {isOwnProfile && (
            <>
              <TouchableOpacity onPress={handleEditProfile}>
                <Edit3 size={24} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePrivacySettings}>
                <Settings size={24} color={colors.text} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View
          style={[styles.profileHeader, { backgroundColor: colors.surface }]}
        >
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: mockProfile.profileImage }}
              style={styles.profileImage}
            />
            {isOwnProfile && (
              <TouchableOpacity
                style={[
                  styles.editImageButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Edit3 size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.displayName, { color: colors.text }]}>
                {mockProfile.name}
              </Text>
              <CheckCircle size={20} color={colors.primary} />
            </View>

            <Text style={[styles.username, { color: colors.textSecondary }]}>
              @{mockProfile.socialLinks.twitter}
            </Text>

            <View style={styles.locationRow}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={[styles.location, { color: colors.textSecondary }]}>
                {mockProfile.location}
              </Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {mockProfile.completedTrips}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Trips
                </Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {mockProfile.rating}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Rating
                </Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {mockProfile.reviews.length}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Reviews
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {!isOwnProfile && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push(`/chat/1`)}
            >
              <MessageCircle size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.secondary },
              ]}
              onPress={() => router.push("/(tabs)/match")}
            >
              <UserPlus size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Connect</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.error }]}
              onPress={() =>
                Alert.alert(
                  "Block User",
                  "Are you sure you want to block this user?"
                )
              }
            >
              <Shield size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Block</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {[
            { id: "about", title: "About", icon: <FileText size={20} /> },
            { id: "trips", title: "Trips", icon: <Calendar size={20} /> },
            {
              id: "bookings",
              title: "Bookings",
              icon: <CreditCard size={20} />,
            },
            { id: "privacy", title: "Privacy", icon: <Shield size={20} /> },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && {
                  borderBottomColor: colors.primary,
                  borderBottomWidth: 2,
                },
              ]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              {tab.icon}
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab.id
                        ? colors.primary
                        : colors.textSecondary,
                  },
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === "about" && renderAboutTab()}
        {activeTab === "trips" && renderTripsTab()}
        {activeTab === "bookings" && renderBookingsTab()}
        {activeTab === "privacy" && renderPrivacyTab()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    padding: 20,
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    alignItems: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  displayName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: 32,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
  },
  languageTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  languageTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  interestTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  reviewStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  reviewCount: {
    fontSize: 14,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "600",
  },
  reviewRating: {
    flexDirection: "row",
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
  tripCard: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  tripImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  tripInfo: {
    flex: 1,
  },
  tripDestination: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  tripDates: {
    fontSize: 14,
    marginBottom: 2,
  },
  tripPurpose: {
    fontSize: 12,
  },
  tripVisibility: {
    justifyContent: "center",
  },
  bookingCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bookingDetails: {
    marginBottom: 8,
  },
  bookingAmount: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bookingCounterparty: {
    fontSize: 14,
    marginBottom: 2,
  },
  bookingDate: {
    fontSize: 12,
  },
  bookingRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  hiddenSection: {
    alignItems: "center",
    paddingVertical: 60,
  },
  hiddenText: {
    fontSize: 16,
    marginTop: 16,
  },
  visibilityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  visibilityInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  visibilityTitle: {
    fontSize: 16,
  },
  visibilityToggle: {
    padding: 4,
  },
  privacyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  privacyInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  privacyTitle: {
    fontSize: 16,
  },
  privacyValue: {
    fontSize: 14,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
