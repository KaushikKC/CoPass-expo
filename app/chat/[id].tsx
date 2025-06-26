import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, IMessage, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Phone, Video, MoveHorizontal as MoreHorizontal, Send as SendIcon } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { mockMessages } from '@/data/mockData';

export default function ChatDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<IMessage[]>(mockMessages);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: colors.primary,
          },
          left: {
            backgroundColor: colors.surface,
          },
        }}
        textStyle={{
          right: {
            color: '#FFFFFF',
          },
          left: {
            color: colors.text,
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={[
          styles.inputToolbar,
          { 
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          }
        ]}
        textInputStyle={[
          styles.textInput,
          { color: colors.text }
        ]}
      />
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send {...props}>
        <View style={[styles.sendButton, { backgroundColor: colors.primary }]}>
          <SendIcon size={20} color="#FFFFFF" />
        </View>
      </Send>
    );
  };

  const handleCall = () => {
    Alert.alert('Voice Call', 'Voice calling feature coming soon!');
  };

  const handleVideoCall = () => {
    Alert.alert('Video Call', 'Video calling feature coming soon!');
  };

  const handleMore = () => {
    Alert.alert('More Options', 'Additional options coming soon!');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: colors.text }]}>Emma Johnson</Text>
          <Text style={[styles.headerStatus, { color: colors.textSecondary }]}>Online</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleCall} style={styles.headerButton}>
            <Phone size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleVideoCall} style={styles.headerButton}>
            <Video size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMore} style={styles.headerButton}>
            <MoreHorizontal size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: '1',
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        placeholder="Type a message..."
        showUserAvatar={false}
        alwaysShowSend
        scrollToBottom
        messagesContainerStyle={[
          styles.messagesContainer,
          { backgroundColor: colors.background }
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
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
    fontWeight: '600',
  },
  headerStatus: {
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  headerButton: {
    padding: 8,
  },
  messagesContainer: {
    paddingHorizontal: 8,
  },
  inputToolbar: {
    borderTopWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    ...Platform.select({
      web: {
        paddingBottom: 8,
      },
    }),
  },
  textInput: {
    fontSize: 16,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 6,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
});