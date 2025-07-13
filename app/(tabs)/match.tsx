import { SwipeCard } from "@/components/SwipeCard";
import { mockTravelers } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import {
  CheckCircle,
  Filter,
  Heart,
  RotateCcw,
  Send,
  Sparkles,
  Users,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.7;

export default function MatchScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardStack, setCardStack] = useState(mockTravelers);
  const [showFilters, setShowFilters] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedTraveler, setSelectedTraveler] = useState<any>(null);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"discover" | "requests">(
    "discover"
  );
  const [pendingRequests, setPendingRequests] = useState(
    mockTravelers.filter((t) => t.requestStatus === "pending")
  );

  const handleSwipe = (direction: "left" | "right") => {
    const currentTraveler = cardStack[currentIndex];

    if (direction === "right") {
      if (Math.random() > 0.7) {
        Alert.alert(
          "🎉 It's a Match!",
          `You and ${currentTraveler.name} both want to connect!`,
          [
            { text: "Send Message", style: "default" },
            { text: "Keep Swiping", style: "cancel" },
          ]
        );
      }
    }

    if (currentIndex < cardStack.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert(
        "No More Travelers",
        "Check back later for more potential connections!"
      );
    }
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleConnect = (traveler: any) => {
    setSelectedTraveler(traveler);
    setConnectionMessage(
      `Hey! I'm also attending ${traveler.purpose} – want to connect?`
    );
    setShowConnectionModal(true);
  };

  const handleViewProfile = (traveler: any) => {
    setSelectedTraveler(traveler);
    setShowProfileModal(true);
  };

  const sendConnectionRequest = () => {
    if (!selectedTraveler) return;

    const updatedStack = cardStack.map((traveler) =>
      traveler.id === selectedTraveler.id
        ? {
            ...traveler,
            requestStatus: "pending",
            requestMessage: connectionMessage,
          }
        : traveler
    );
    setCardStack(updatedStack);

    setPendingRequests((prev) => [
      ...prev,
      {
        ...selectedTraveler,
        requestStatus: "pending",
        requestMessage: connectionMessage,
      },
    ]);

    setShowConnectionModal(false);
    setConnectionMessage("");
    setSelectedTraveler(null);

    Alert.alert("Request Sent!", "Your connection request has been sent.");
  };

  const handleRequestAction = (
    travelerId: string,
    action: "accept" | "reject" | "block"
  ) => {
    const updatedRequests = pendingRequests.filter(
      (req) => req.id !== travelerId
    );
    setPendingRequests(updatedRequests);

    if (action === "accept") {
      router.push(`/chat/${travelerId}`);
    } else if (action === "block") {
      Alert.alert(
        "User Blocked",
        "This user has been blocked and will no longer appear in your feed."
      );
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
          },
        ]}
      >
        <SwipeCard
          traveler={traveler}
          onConnect={() => handleConnect(traveler)}
          onViewProfile={() => handleViewProfile(traveler)}
          onPass={() => handleSwipe("left")}
          onLike={() => handleSwipe("right")}
        />
      </View>
    );
  };

  const renderRequestItem = ({ item }: { item: any }) => (
    <View
      style={[
        styles.requestItem,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Image source={{ uri: item.profileImage }} style={styles.requestImage} />

      <View style={styles.requestContent}>
        <View style={styles.requestHeader}>
          <Text style={[styles.requestName, { color: colors.text }]}>
            {item.name}, {item.age}
          </Text>
          {item.verified.lens && (
            <CheckCircle size={16} color={colors.primary} />
          )}
        </View>

        <Text style={[styles.requestMessage, { color: colors.textSecondary }]}>
          {item.requestMessage}
        </Text>

        <View style={styles.requestActions}>
          <TouchableOpacity
            style={[
              styles.requestButton,
              styles.acceptButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={() => handleRequestAction(item.id, "accept")}
          >
            <Text style={styles.requestButtonText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.requestButton,
              styles.rejectButton,
              { backgroundColor: colors.error },
            ]}
            onPress={() => handleRequestAction(item.id, "reject")}
          >
            <Text style={styles.requestButtonText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.requestButton,
              styles.blockButton,
              { backgroundColor: colors.textSecondary },
            ]}
            onPress={() => handleRequestAction(item.id, "block")}
          >
            <Text style={styles.requestButtonText}>Block</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {activeTab === "discover" ? "Discover" : "Requests"}
        </Text>
        <View style={styles.headerActions}>
          {activeTab === "discover" && (
            <TouchableOpacity onPress={() => setShowFilters(true)}>
              <Filter size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity>
            <Sparkles size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "discover" && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab("discover")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "discover"
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
          >
            Discover
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "requests" && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab("requests")}
        >
          <View style={styles.tabWithBadge}>
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "requests"
                      ? colors.primary
                      : colors.textSecondary,
                },
              ]}
            >
              Requests
            </Text>
            {pendingRequests.length > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>{pendingRequests.length}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {activeTab === "discover" ? (
        <>
          <View style={styles.cardStack}>
            {currentIndex >= cardStack.length ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  No More Travelers
                </Text>
                <Text
                  style={[
                    styles.emptySubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Check back later for more potential connections!
                </Text>
              </View>
            ) : (
              cardStack.map((traveler, index) => renderCard(traveler, index))
            )}
          </View>

          <View style={[styles.actions, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.passButton,
                { backgroundColor: colors.error },
              ]}
              onPress={() => handleSwipe("left")}
              disabled={currentIndex >= cardStack.length}
            >
              <X size={32} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.undoButton,
                { backgroundColor: colors.textSecondary },
              ]}
              onPress={handleUndo}
              disabled={currentIndex === 0}
            >
              <RotateCcw size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.likeButton,
                { backgroundColor: colors.secondary },
              ]}
              onPress={() => handleSwipe("right")}
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
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        </>
      ) : (
        <FlatList
          data={pendingRequests}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id}
          style={styles.requestsList}
          contentContainerStyle={styles.requestsContent}
          ListEmptyComponent={
            <View style={styles.emptyRequests}>
              <Users size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyRequestsTitle, { color: colors.text }]}>
                No Pending Requests
              </Text>
              <Text
                style={[
                  styles.emptyRequestsSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                When you send connection requests, they'll appear here
              </Text>
            </View>
          }
        />
      )}

      {/* Connection Request Modal */}
      <Modal
        visible={showConnectionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowConnectionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.connectionModal,
              { backgroundColor: colors.surface },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Send Connection Request
              </Text>
              <TouchableOpacity onPress={() => setShowConnectionModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.connectionContent}>
              <View style={styles.connectionPreview}>
                <Image
                  source={{ uri: selectedTraveler?.profileImage }}
                  style={styles.connectionImage}
                />
                <Text style={[styles.connectionName, { color: colors.text }]}>
                  {selectedTraveler?.name}, {selectedTraveler?.age}
                </Text>
                <Text
                  style={[
                    styles.connectionPurpose,
                    { color: colors.textSecondary },
                  ]}
                >
                  {selectedTraveler?.purpose}
                </Text>
              </View>

              <Text style={[styles.messageLabel, { color: colors.text }]}>
                Message (optional):
              </Text>
              <TextInput
                style={[
                  styles.messageInput,
                  { color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Add a personal message..."
                placeholderTextColor={colors.textSecondary}
                value={connectionMessage}
                onChangeText={setConnectionMessage}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.connectionActions}>
              <TouchableOpacity
                style={[
                  styles.connectionButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={sendConnectionRequest}
              >
                <Send size={20} color="#FFFFFF" />
                <Text style={styles.connectionButtonText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  tabWithBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardStack: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  cardContainer: {
    position: "absolute",
    width: width - 40,
    height: CARD_HEIGHT,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 24,
    gap: 20,
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
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
    backgroundColor: "#E5E5EA",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  requestsList: {
    flex: 1,
  },
  requestsContent: {
    padding: 20,
  },
  requestItem: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  requestImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  requestContent: {
    flex: 1,
  },
  requestHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  requestName: {
    fontSize: 16,
    fontWeight: "600",
  },
  requestMessage: {
    fontSize: 14,
    marginBottom: 12,
  },
  requestActions: {
    flexDirection: "row",
    gap: 8,
  },
  requestButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  requestButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  acceptButton: {
    // Already styled
  },
  rejectButton: {
    // Already styled
  },
  blockButton: {
    // Already styled
  },
  emptyRequests: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyRequestsTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyRequestsSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  connectionModal: {
    width: "90%",
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  connectionContent: {
    marginBottom: 20,
  },
  connectionPreview: {
    alignItems: "center",
    marginBottom: 20,
  },
  connectionImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  connectionName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  connectionPurpose: {
    fontSize: 14,
  },
  messageLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  connectionActions: {
    flexDirection: "row",
    gap: 12,
  },
  connectionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  connectionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
