import { mockChats } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import { MessageCircle, Plus, Search, Shield } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ChatItem {
  id: string;
  name: string;
  profileImage: string;
  lastMessage: string;
  time: string;
  unread: number;
  isEncrypted: boolean;
  isOnline: boolean;
}

export default function ChatScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showEncryptedOnly, setShowEncryptedOnly] = useState(false);

  // Enhanced chat data with encryption status
  const enhancedChats: ChatItem[] = mockChats.map((chat) => ({
    ...chat,
    isEncrypted: true,
    isOnline: Math.random() > 0.5, // Random online status for demo
  }));

  const filteredChats = enhancedChats.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEncryption = !showEncryptedOnly || chat.isEncrypted;
    return matchesSearch && matchesEncryption;
  });

  const handleChatPress = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const handleNewChat = () => {
    Alert.alert(
      "New Chat",
      "Start a new conversation with someone you've connected with.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start Chat",
          onPress: () => {
            // Navigate to connections or match screen
            router.push("/(tabs)/match");
          },
        },
      ]
    );
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={[
        styles.chatItem,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
      ]}
      onPress={() => handleChatPress(item.id)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.profileImage }} style={styles.avatar} />
        {item.isOnline && (
          <View
            style={[
              styles.onlineIndicator,
              { backgroundColor: colors.primary },
            ]}
          />
        )}
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.chatTime, { color: colors.textSecondary }]}>
            {item.time}
          </Text>
        </View>

        <View style={styles.chatFooter}>
          <View style={styles.messageInfo}>
            {item.isEncrypted && <Shield size={12} color={colors.primary} />}
            <Text
              style={[
                styles.lastMessage,
                { color: item.unread > 0 ? colors.text : colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
          </View>

          {item.unread > 0 && (
            <View
              style={[styles.unreadBadge, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.unreadCount}>
                {item.unread > 99 ? "99+" : item.unread}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MessageCircle size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Conversations Yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Connect with travelers to start chatting
      </Text>
      <TouchableOpacity
        style={[styles.startChatButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push("/(tabs)/match")}
      >
        <Text style={styles.startChatButtonText}>Find Travelers</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Chats</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setShowEncryptedOnly(!showEncryptedOnly)}
          >
            <Shield
              size={24}
              color={showEncryptedOnly ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNewChat}>
            <Plus size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[styles.searchContainer, { backgroundColor: colors.surface }]}
      >
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search conversations..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        contentContainerStyle={styles.chatListContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {showEncryptedOnly && (
        <View
          style={[styles.encryptionFilter, { backgroundColor: colors.accent }]}
        >
          <Shield size={16} color="#FFFFFF" />
          <Text style={styles.encryptionFilterText}>
            Showing encrypted chats only
          </Text>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
  },
  chatTime: {
    fontSize: 12,
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
  },
  unreadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 20,
    alignItems: "center",
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
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
  startChatButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startChatButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  encryptionFilter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  encryptionFilterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
