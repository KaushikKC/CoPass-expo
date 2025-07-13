import { mockMessages, mockTravelers } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  File,
  Image as ImageIcon,
  Mic,
  MicOff,
  MoreVertical,
  Paperclip,
  Send,
  Shield,
  User,
  Volume2,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface Message {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  type: "text" | "voice" | "file" | "image";
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  voiceDuration?: number;
  isRead: boolean;
  isEncrypted: boolean;
}

export default function ChatScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showEncryptionInfo, setShowEncryptionInfo] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [messageExpiry, setMessageExpiry] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Find the traveler/chat partner
  const chatPartner = mockTravelers.find((traveler) => traveler.id === id);

  useEffect(() => {
    // Simulate typing indicator
    const typingTimer = setTimeout(() => {
      setIsTyping(false);
    }, 3000);

    return () => clearTimeout(typingTimer);
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      _id: Date.now().toString(),
      text: inputText,
      createdAt: new Date(),
      user: {
        _id: "1",
        name: "You",
      },
      type: "text",
      isRead: false,
      isEncrypted: isEncrypted,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replyMessage: Message = {
        _id: (Date.now() + 1).toString(),
        text: "Thanks for the message! I'll get back to you soon.",
        createdAt: new Date(),
        user: {
          _id: chatPartner?.id || "2",
          name: chatPartner?.name || "Traveler",
          avatar: chatPartner?.profileImage,
        },
        type: "text",
        isRead: true,
        isEncrypted: isEncrypted,
      };
      setMessages((prev) => [...prev, replyMessage]);
    }, 2000);
  };

  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording for 3 seconds
    setTimeout(() => {
      stopRecording();
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);

    const voiceMessage: Message = {
      _id: Date.now().toString(),
      text: "Voice message",
      createdAt: new Date(),
      user: {
        _id: "1",
        name: "You",
      },
      type: "voice",
      voiceDuration: 3,
      isRead: false,
      isEncrypted: isEncrypted,
    };

    setMessages((prev) => [...prev, voiceMessage]);
  };

  const handleFileUpload = (type: "image" | "file") => {
    const fileMessage: Message = {
      _id: Date.now().toString(),
      text: type === "image" ? "Image shared" : "File shared",
      createdAt: new Date(),
      user: {
        _id: "1",
        name: "You",
      },
      type,
      fileUrl: "https://example.com/file.pdf",
      fileName: type === "image" ? "travel_photo.jpg" : "booking_receipt.pdf",
      fileSize: type === "image" ? "2.3 MB" : "1.1 MB",
      isRead: false,
      isEncrypted: isEncrypted,
    };

    setMessages((prev) => [...prev, fileMessage]);
    setShowFilePicker(false);
  };

  const blockUser = () => {
    Alert.alert(
      "Block User",
      `Are you sure you want to block ${chatPartner?.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "User Blocked",
              "This user has been blocked and will no longer appear in your chats."
            );
            router.back();
          },
        },
      ]
    );
  };

  const reportUser = () => {
    Alert.alert("Report User", "Report this user for inappropriate behavior?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Report",
        style: "destructive",
        onPress: () =>
          Alert.alert(
            "Reported",
            "Thank you for your report. We will review it shortly."
          ),
      },
    ]);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.user._id === "1";
    const showReadReceipt = isOwnMessage && item.type === "text";

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isOwnMessage ? colors.primary : colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {item.type === "text" && (
            <Text
              style={[
                styles.messageText,
                { color: isOwnMessage ? "#FFFFFF" : colors.text },
              ]}
            >
              {item.text}
            </Text>
          )}

          {item.type === "voice" && (
            <View style={styles.voiceMessage}>
              <Volume2
                size={16}
                color={isOwnMessage ? "#FFFFFF" : colors.text}
              />
              <Text
                style={[
                  styles.voiceText,
                  { color: isOwnMessage ? "#FFFFFF" : colors.text },
                ]}
              >
                {item.voiceDuration}s voice message
              </Text>
            </View>
          )}

          {item.type === "file" && (
            <View style={styles.fileMessage}>
              <File size={20} color={isOwnMessage ? "#FFFFFF" : colors.text} />
              <View style={styles.fileInfo}>
                <Text
                  style={[
                    styles.fileName,
                    { color: isOwnMessage ? "#FFFFFF" : colors.text },
                  ]}
                >
                  {item.fileName}
                </Text>
                <Text
                  style={[
                    styles.fileSize,
                    { color: isOwnMessage ? "#FFFFFF" : colors.textSecondary },
                  ]}
                >
                  {item.fileSize}
                </Text>
              </View>
            </View>
          )}

          {item.type === "image" && (
            <View style={styles.imageMessage}>
              <ImageIcon
                size={20}
                color={isOwnMessage ? "#FFFFFF" : colors.text}
              />
              <Text
                style={[
                  styles.imageText,
                  { color: isOwnMessage ? "#FFFFFF" : colors.text },
                ]}
              >
                {item.fileName}
              </Text>
            </View>
          )}

          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.messageTime,
                { color: isOwnMessage ? "#FFFFFF" : colors.textSecondary },
              ]}
            >
              {item.createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

            {showReadReceipt && (
              <View style={styles.readReceipt}>
                {item.isRead ? (
                  <CheckCheck size={12} color="#4CAF50" />
                ) : (
                  <Check size={12} color="#FFFFFF" />
                )}
              </View>
            )}

            {item.isEncrypted && (
              <Shield
                size={10}
                color={isOwnMessage ? "#FFFFFF" : colors.textSecondary}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View
      style={[
        styles.header,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
      ]}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => router.push("/profile")}
      >
        <Image
          source={{ uri: chatPartner?.profileImage }}
          style={styles.avatar}
        />
        <View style={styles.userDetails}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {chatPartner?.name}
          </Text>
          <Text style={[styles.userStatus, { color: colors.textSecondary }]}>
            Online
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.headerActions}>
        <TouchableOpacity onPress={() => setShowEncryptionInfo(true)}>
          <Shield
            size={20}
            color={isEncrypted ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowOptions(true)}>
          <MoreVertical size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInputToolbar = () => (
    <View
      style={[
        styles.inputToolbar,
        { backgroundColor: colors.surface, borderTopColor: colors.border },
      ]}
    >
      <TouchableOpacity
        style={[styles.attachButton, { backgroundColor: colors.accent }]}
        onPress={() => setShowFilePicker(true)}
      >
        <Paperclip size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: colors.background, borderColor: colors.border },
        ]}
      >
        <TextInput
          style={[styles.textInput, { color: colors.text }]}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
      </View>

      {inputText.trim() ? (
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={sendMessage}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.micButton,
            {
              backgroundColor: isRecording ? colors.error : colors.accent,
              borderColor: colors.border,
            },
          ]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? (
            <MicOff size={20} color="#FFFFFF" />
          ) : (
            <Mic size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {renderHeader()}

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          inverted={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {isTyping && (
          <View style={styles.typingIndicator}>
            <Text style={[styles.typingText, { color: colors.textSecondary }]}>
              {chatPartner?.name} is typing...
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>

      {renderInputToolbar()}

      {/* File Picker Modal */}
      <Modal
        visible={showFilePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.filePickerModal,
              { backgroundColor: colors.surface },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Share File
              </Text>
              <TouchableOpacity onPress={() => setShowFilePicker(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.fileOptions}>
              <TouchableOpacity
                style={[styles.fileOption, { backgroundColor: colors.accent }]}
                onPress={() => handleFileUpload("image")}
              >
                <ImageIcon size={32} color="#FFFFFF" />
                <Text style={styles.fileOptionText}>Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.fileOption,
                  { backgroundColor: colors.secondary },
                ]}
                onPress={() => handleFileUpload("file")}
              >
                <File size={32} color="#FFFFFF" />
                <Text style={styles.fileOptionText}>Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Options Modal */}
      <Modal
        visible={showOptions}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.optionsModal, { backgroundColor: colors.surface }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Chat Options
              </Text>
              <TouchableOpacity onPress={() => setShowOptions(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsList}>
              <TouchableOpacity
                style={[
                  styles.optionItem,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => {
                  setShowOptions(false);
                  router.push("/profile");
                }}
              >
                <User size={20} color={colors.text} />
                <Text style={[styles.optionText, { color: colors.text }]}>
                  View Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionItem,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => {
                  setShowOptions(false);
                  setShowEncryptionInfo(true);
                }}
              >
                <Shield size={20} color={colors.text} />
                <Text style={[styles.optionText, { color: colors.text }]}>
                  Encryption Settings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionItem,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => {
                  setShowOptions(false);
                  reportUser();
                }}
              >
                <Text style={[styles.optionText, { color: colors.error }]}>
                  Report User
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionItem,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => {
                  setShowOptions(false);
                  blockUser();
                }}
              >
                <Text style={[styles.optionText, { color: colors.error }]}>
                  Block User
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Encryption Info Modal */}
      <Modal
        visible={showEncryptionInfo}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEncryptionInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.encryptionModal,
              { backgroundColor: colors.surface },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Encryption Settings
              </Text>
              <TouchableOpacity onPress={() => setShowEncryptionInfo(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.encryptionContent}>
              <View style={styles.encryptionStatus}>
                <Shield
                  size={48}
                  color={isEncrypted ? colors.primary : colors.textSecondary}
                />
                <Text style={[styles.encryptionTitle, { color: colors.text }]}>
                  {isEncrypted ? "End-to-End Encrypted" : "Encryption Disabled"}
                </Text>
                <Text
                  style={[
                    styles.encryptionDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {isEncrypted
                    ? "Messages are encrypted client-side and can only be read by you and the recipient."
                    : "Messages are not encrypted and may be visible to others."}
                </Text>
              </View>

              <View style={styles.encryptionOptions}>
                <TouchableOpacity
                  style={[
                    styles.encryptionToggle,
                    {
                      backgroundColor: isEncrypted
                        ? colors.primary
                        : colors.border,
                    },
                  ]}
                  onPress={() => setIsEncrypted(!isEncrypted)}
                >
                  <Text
                    style={[
                      styles.encryptionToggleText,
                      { color: isEncrypted ? "#FFFFFF" : colors.text },
                    ]}
                  >
                    {isEncrypted ? "Enabled" : "Disabled"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.messageExpiry}>
                  <Text style={[styles.expiryLabel, { color: colors.text }]}>
                    Message Expiry
                  </Text>
                  <View style={styles.expiryOptions}>
                    {[null, 1, 24, 168].map((hours) => (
                      <TouchableOpacity
                        key={hours || "never"}
                        style={[
                          styles.expiryOption,
                          {
                            backgroundColor:
                              messageExpiry === hours
                                ? colors.primary
                                : colors.surface,
                            borderColor: colors.border,
                          },
                        ]}
                        onPress={() => setMessageExpiry(hours)}
                      >
                        <Text
                          style={[
                            styles.expiryOptionText,
                            {
                              color:
                                messageExpiry === hours
                                  ? "#FFFFFF"
                                  : colors.text,
                            },
                          ]}
                        >
                          {hours === null
                            ? "Never"
                            : hours === 1
                            ? "1 hour"
                            : hours === 24
                            ? "24 hours"
                            : "1 week"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  userStatus: {
    fontSize: 12,
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
  },
  ownMessage: {
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
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  voiceMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  voiceText: {
    fontSize: 14,
  },
  fileMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
  },
  fileSize: {
    fontSize: 12,
  },
  imageMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  imageText: {
    fontSize: 14,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
  },
  readReceipt: {
    marginLeft: 4,
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  inputToolbar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  textInput: {
    fontSize: 16,
    maxHeight: 80,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  filePickerModal: {
    width: "80%",
    borderRadius: 16,
    padding: 20,
  },
  optionsModal: {
    width: "80%",
    borderRadius: 16,
    padding: 20,
  },
  encryptionModal: {
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
    fontSize: 18,
    fontWeight: "600",
  },
  fileOptions: {
    flexDirection: "row",
    gap: 20,
  },
  fileOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 12,
  },
  fileOptionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
  encryptionContent: {
    gap: 24,
  },
  encryptionStatus: {
    alignItems: "center",
    gap: 12,
  },
  encryptionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  encryptionDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  encryptionOptions: {
    gap: 20,
  },
  encryptionToggle: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  encryptionToggleText: {
    fontSize: 16,
    fontWeight: "600",
  },
  messageExpiry: {
    gap: 12,
  },
  expiryLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  expiryOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  expiryOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  expiryOptionText: {
    fontSize: 14,
  },
});
