import { useTheme } from "@/hooks/useTheme";
import {
  Calendar,
  CheckCircle,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  Tag,
  Users,
  X,
} from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    verified: {
      lens: boolean;
      wallet: string | null;
    };
    languages: string[];
    travelStyle: string;
    socialLinks: {
      lens: string | null;
      telegram: string | null;
      discord: string | null;
    };
    sharedInterests: number;
    dateOverlap: boolean;
    requestStatus: string | null;
    requestMessage: string;
  };
  onConnect?: () => void;
  onViewProfile?: () => void;
  onPass?: () => void;
  onLike?: () => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  traveler,
  onConnect,
  onViewProfile,
  onPass,
  onLike,
}) => {
  const { colors } = useTheme();

  const renderVerificationBadges = () => {
    const badges = [];
    if (traveler.verified.lens) {
      badges.push(
        <View
          key="lens"
          style={[
            styles.verificationBadge,
            { backgroundColor: colors.primary },
          ]}
        >
          <CheckCircle size={12} color="#FFFFFF" />
          <Text style={styles.verificationText}>Lens</Text>
        </View>
      );
    }
    if (traveler.verified.wallet) {
      badges.push(
        <View
          key="wallet"
          style={[
            styles.verificationBadge,
            { backgroundColor: colors.secondary },
          ]}
        >
          <CheckCircle size={12} color="#FFFFFF" />
          <Text style={styles.verificationText}>Wallet</Text>
        </View>
      );
    }
    return badges;
  };

  const renderRequestStatus = () => {
    if (traveler.requestStatus === "pending") {
      return (
        <View
          style={[styles.requestStatus, { backgroundColor: colors.accent }]}
        >
          <Text style={styles.requestStatusText}>Request Sent</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Image
        source={{ uri: traveler.profileImage }}
        style={styles.profileImage}
      />

      {/* Verification badges overlay */}
      <View style={styles.verificationContainer}>
        {renderVerificationBadges()}
      </View>

      {/* Request status overlay */}
      {renderRequestStatus()}

      <View style={styles.overlay}>
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text }]}>
              {traveler.name}, {traveler.age}
            </Text>
            {traveler.verified.lens && (
              <CheckCircle size={16} color={colors.primary} />
            )}
          </View>

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
            {traveler.dateOverlap && (
              <View style={styles.overlapBadge}>
                <Text style={styles.overlapText}>Date Overlap</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={[styles.bio, { color: colors.textSecondary }]}>
          {traveler.bio}
        </Text>

        <View style={styles.interestsContainer}>
          {traveler.interests.slice(0, 3).map((interest, index) => (
            <View
              key={index}
              style={[styles.interestTag, { backgroundColor: colors.accent }]}
            >
              <Tag size={12} color="#FFFFFF" />
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
          {traveler.interests.length > 3 && (
            <View
              style={[styles.interestTag, { backgroundColor: colors.border }]}
            >
              <Text
                style={[styles.interestText, { color: colors.textSecondary }]}
              >
                +{traveler.interests.length - 3} more
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sharedInterestsRow}>
          <Users size={16} color={colors.primary} />
          <Text style={[styles.sharedInterestsText, { color: colors.text }]}>
            {traveler.sharedInterests} shared interests
          </Text>
        </View>

        {/* Quick action buttons */}
        {traveler.requestStatus !== "pending" && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.passButton,
                { backgroundColor: colors.error },
              ]}
              onPress={onPass}
            >
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.viewButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={onViewProfile}
            >
              <Eye size={20} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.connectButton,
                { backgroundColor: colors.secondary },
              ]}
              onPress={onConnect}
            >
              <MessageCircle size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.likeButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={onLike}
            >
              <Heart size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    height: 600,
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  verificationContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    gap: 8,
    zIndex: 10,
  },
  verificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verificationText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  requestStatus: {
    position: "absolute",
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 10,
  },
  requestStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 100,
  },
  header: {
    marginBottom: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 16,
    marginLeft: 4,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  purposeCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  purpose: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  datesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dates: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  overlapBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  overlapText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  interestTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 4,
  },
  sharedInterestsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  sharedInterestsText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passButton: {
    // Already styled
  },
  viewButton: {
    borderWidth: 1,
  },
  connectButton: {
    // Already styled
  },
  likeButton: {
    // Already styled
  },
});
