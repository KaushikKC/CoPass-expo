import { useTheme } from "@/hooks/useTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  MoveHorizontal as MoreHorizontal,
  Phone,
  Send as SendIcon,
  Video,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
}

export default function ChatDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! Are you going to the conference next week?",
      sender: "other",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      text: "Yes! I'm really excited about it. Are you?",
      sender: "user",
      timestamp: new Date(Date.now() - 1800000),
    },
    {
      id: "3",
      text: "Absolutely! We should meet up there.",
      sender: "other",
      timestamp: new Date(Date.now() - 900000),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    }
  };

  const handleCall = () => {
    Alert.alert("Voice Call", "Voice calling feature coming soon!");
  };

  const handleVideoCall = () => {
    Alert.alert("Video Call", "Video calling feature coming soon!");
  };

  const handleMore = () => {
    Alert.alert("More Options", "Additional options coming soon!");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerName, { color: colors.text }]}>
              Emma Johnson
            </Text>
            <Text
              style={[styles.headerStatus, { color: colors.textSecondary }]}
            >
              Online
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleCall} style={styles.headerButton}>
              <Phone size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleVideoCall}
              style={styles.headerButton}
            >
              <Video size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMore} style={styles.headerButton}>
              <MoreHorizontal size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={[
            styles.messagesContainer,
            { backgroundColor: colors.background },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.sender === "user"
                  ? styles.userMessage
                  : styles.otherMessage,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  {
                    backgroundColor:
                      message.sender === "user"
                        ? colors.primary
                        : colors.surface,
                    alignSelf:
                      message.sender === "user" ? "flex-end" : "flex-start",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    {
                      color:
                        message.sender === "user" ? "#FFFFFF" : colors.text,
                    },
                  ]}
                >
                  {message.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    {
                      color:
                        message.sender === "user"
                          ? "rgba(255,255,255,0.7)"
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.surface, borderTopColor: colors.border },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              { color: colors.text, backgroundColor: colors.background },
            ]}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: newMessage.trim()
                  ? colors.primary
                  : colors.border,
              },
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <SendIcon
              size={20}
              color={newMessage.trim() ? "#FFFFFF" : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerStatus: {
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 4,
  },
  headerButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessage: {
    alignItems: "flex-end",
  },
  otherMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
