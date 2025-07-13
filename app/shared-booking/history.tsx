import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  ExternalLink,
  Shield,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SharedBooking {
  id: string;
  title: string;
  type: string;
  amount: string;
  currency: string;
  status: "pending" | "active" | "completed" | "disputed" | "cancelled";
  counterparty: {
    id: string;
    name: string;
    profileImage: string;
  };
  date: string;
  split: number[];
  contractAddress: string;
  createdAt: string;
  completionDate?: string;
  rating?: number;
}

export default function SharedBookingHistoryScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "active" | "completed"
  >("all");

  const mockBookings: SharedBooking[] = [
    {
      id: "1",
      title: "Shared Hotel - Token2049",
      type: "hotel",
      amount: "0.2",
      currency: "ETH",
      status: "active",
      counterparty: {
        id: "2",
        name: "Emma Johnson",
        profileImage:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      },
      date: "Mar 15-20, 2024",
      split: [50, 50],
      contractAddress: "0x1234...5678",
      createdAt: "2024-02-15",
    },
    {
      id: "2",
      title: "Airport Transfer",
      type: "taxi",
      amount: "0.05",
      currency: "ETH",
      status: "completed",
      counterparty: {
        id: "3",
        name: "Alex Chen",
        profileImage:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      },
      date: "Feb 10, 2024",
      split: [50, 50],
      contractAddress: "0x8765...4321",
      createdAt: "2024-01-20",
      completionDate: "2024-02-10",
      rating: 5,
    },
    {
      id: "3",
      title: "Conference Tickets",
      type: "event",
      amount: "0.1",
      currency: "ETH",
      status: "pending",
      counterparty: {
        id: "4",
        name: "Sarah Wilson",
        profileImage:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      },
      date: "Apr 5, 2024",
      split: [60, 40],
      contractAddress: "0x9876...5432",
      createdAt: "2024-02-20",
    },
    {
      id: "4",
      title: "City Tour",
      type: "activity",
      amount: "0.03",
      currency: "ETH",
      status: "disputed",
      counterparty: {
        id: "5",
        name: "Mike Davis",
        profileImage:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      },
      date: "Jan 25, 2024",
      split: [50, 50],
      contractAddress: "0x5432...1098",
      createdAt: "2024-01-10",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FF9500";
      case "active":
        return "#34C759";
      case "completed":
        return "#007AFF";
      case "disputed":
        return "#FF3B30";
      case "cancelled":
        return "#8E8E93";
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "active":
        return <Shield size={16} />;
      case "completed":
        return <CheckCircle size={16} />;
      case "disputed":
        return <AlertCircle size={16} />;
      case "cancelled":
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hotel":
        return "🏨";
      case "taxi":
        return "🚗";
      case "event":
        return "🎫";
      case "activity":
        return "🎯";
      default:
        return "💳";
    }
  };

  const filteredBookings = mockBookings.filter((booking) => {
    if (activeFilter === "all") return true;
    return booking.status === activeFilter;
  });

  const handleBookingPress = (booking: SharedBooking) => {
    Alert.alert(
      booking.title,
      `Status: ${booking.status}\nAmount: ${booking.amount} ${booking.currency}\nContract: ${booking.contractAddress}`,
      [
        {
          text: "View Details",
          onPress: () =>
            Alert.alert("Booking Details", "Detailed view coming soon!"),
        },
        { text: "Cancel" },
      ]
    );
  };

  const renderBookingCard = ({ item }: { item: SharedBooking }) => (
    <TouchableOpacity
      style={[
        styles.bookingCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={() => handleBookingPress(item)}
    >
      <View style={styles.bookingHeader}>
        <View style={styles.bookingTitleRow}>
          <Text style={styles.bookingTypeIcon}>{getTypeIcon(item.type)}</Text>
          <View style={styles.bookingTitleContainer}>
            <Text style={[styles.bookingTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.bookingDate, { color: colors.textSecondary }]}>
              {item.date}
            </Text>
          </View>
        </View>

        <View style={styles.bookingStatus}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            {getStatusIcon(item.status)}
            <Text style={styles.statusText}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.amountSection}>
          <DollarSign size={16} color={colors.textSecondary} />
          <Text style={[styles.amount, { color: colors.text }]}>
            {item.amount} {item.currency}
          </Text>
        </View>

        <View style={styles.splitSection}>
          <Users size={16} color={colors.textSecondary} />
          <Text style={[styles.splitText, { color: colors.textSecondary }]}>
            {item.split[0]}% / {item.split[1]}%
          </Text>
        </View>
      </View>

      <View style={styles.counterpartySection}>
        <Image
          source={{ uri: item.counterparty.profileImage }}
          style={styles.counterpartyAvatar}
        />
        <View style={styles.counterpartyInfo}>
          <Text style={[styles.counterpartyName, { color: colors.text }]}>
            with {item.counterparty.name}
          </Text>
          <Text
            style={[styles.contractAddress, { color: colors.textSecondary }]}
          >
            Contract: {item.contractAddress}
          </Text>
        </View>

        {item.rating && (
          <View style={styles.ratingContainer}>
            <Text style={[styles.rating, { color: colors.primary }]}>
              ⭐ {item.rating}/5
            </Text>
          </View>
        )}
      </View>

      {item.status === "active" && (
        <View style={[styles.actionBar, { backgroundColor: colors.accent }]}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert("Mark Complete", "Mark this booking as completed?")
            }
          >
            <CheckCircle size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Mark Complete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert(
                "View Contract",
                "Open contract on blockchain explorer?"
              )
            }
          >
            <ExternalLink size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>View Contract</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      {[
        { id: "all", title: "All", count: mockBookings.length },
        {
          id: "pending",
          title: "Pending",
          count: mockBookings.filter((b) => b.status === "pending").length,
        },
        {
          id: "active",
          title: "Active",
          count: mockBookings.filter((b) => b.status === "active").length,
        },
        {
          id: "completed",
          title: "Completed",
          count: mockBookings.filter((b) => b.status === "completed").length,
        },
      ].map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterTab,
            activeFilter === filter.id && { backgroundColor: colors.primary },
          ]}
          onPress={() => setActiveFilter(filter.id as any)}
        >
          <Text
            style={[
              styles.filterTabText,
              { color: activeFilter === filter.id ? "#FFFFFF" : colors.text },
            ]}
          >
            {filter.title}
          </Text>
          <View
            style={[
              styles.filterCount,
              {
                backgroundColor:
                  activeFilter === filter.id ? "#FFFFFF" : colors.accent,
              },
            ]}
          >
            <Text
              style={[
                styles.filterCountText,
                {
                  color:
                    activeFilter === filter.id ? colors.primary : colors.text,
                },
              ]}
            >
              {filter.count}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Shared Bookings
        </Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("New Booking", "New booking feature coming soon!")
          }
        >
          <CreditCard size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {renderFilterTabs()}

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <View style={styles.emptyState}>
          <CreditCard size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No shared bookings
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {activeFilter === "all"
              ? "Start by proposing a shared booking with a travel partner"
              : `No ${activeFilter} bookings found`}
          </Text>
          {activeFilter === "all" && (
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() =>
                Alert.alert("New Booking", "New booking feature coming soon!")
              }
            >
              <Text style={styles.createButtonText}>Create Shared Booking</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  filterCount: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: "600",
  },
  listContainer: {
    padding: 20,
  },
  bookingCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bookingTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bookingTypeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  bookingTitleContainer: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
  },
  bookingStatus: {
    alignItems: "flex-end",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bookingDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  amountSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  splitSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  splitText: {
    fontSize: 14,
  },
  counterpartySection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  counterpartyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  counterpartyInfo: {
    flex: 1,
  },
  counterpartyName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  contractAddress: {
    fontSize: 12,
  },
  ratingContainer: {
    alignItems: "flex-end",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionBar: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  createButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
