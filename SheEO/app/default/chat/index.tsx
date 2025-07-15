import React, { useState, useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView, Platform, Keyboard,
  StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Ionicons } from '@expo/vector-icons';
import { getFontFamily } from '../../../components/FontConfig';
import AteAiIcon from '../../../assets/icons/ate-ai.svg';
import AteAiProfileIcon from '../../../assets/icons/ate-ai-icon.svg';
import { AIAssistant } from '../../../lib/AI/aiAssistant';
import { getMessages, ChatMessage } from '../../../lib/aiStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';


const STORAGE_KEY = 'assistant_Message_History';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp?: Date;
}

interface ChatProps {
  fontsLoaded?: boolean;
  onNavigateToShare?: () => void;
}
;
const Chat: React.FC<ChatProps> = ({ fontsLoaded = true, onNavigateToShare }) => {
  const [message, setMessage] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  // Animation values
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const messageAnimations = useRef<{ [key: number]: Animated.Value }>({}).current;
  const inputAnimation = useRef(new Animated.Value(0)).current;
  const typingAnimation = useRef(new Animated.Value(0)).current;

  // Initial chat messages - easy to modify
  const initialMessages: Message[] = [
    {
      id: 1,
      text: "Hello! I'm Ate A.I., your personal business assistant. 🤖\n\nI can help you with:\n\n- **Inventory management** (e.g., \"How many apples do I have left?\")\n- **Sales tracking** (e.g., \"What were my total sales yesterday?\")\n- **Business advice** (e.g., \"How can I attract more customers?\")\n\nWhat can I help you with today?",
      isBot: true,
      timestamp: new Date()
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);


  // Initialize animations for existing messages
  useEffect(() => {
    messages.forEach((msg) => {
      if (!messageAnimations[msg.id]) {
        messageAnimations[msg.id] = new Animated.Value(0);
      }
    });
  }, [messages]);

  // Header entrance animation
  useEffect(() => {
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Animate messages with staggered delay
    messages.forEach((msg, index) => {
      if (!messageAnimations[msg.id]) {
        messageAnimations[msg.id] = new Animated.Value(0);
      }

      Animated.timing(messageAnimations[msg.id], {
        toValue: 1,
        duration: 600,
        delay: 300 + (index * 200),
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }).start();
    });

    // Input animation
    Animated.timing(inputAnimation, {
      toValue: 1,
      duration: 600,
      delay: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);


  // Typing indicator animation
  useEffect(() => {
    if (isTyping) {
      const animate = () => {
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isTyping) animate();
        });
      };
      animate();
    }
  }, [isTyping]);

  useEffect(() => {
    const loadStoredMessages = async () => {
      const stored: ChatMessage[] = await getMessages(STORAGE_KEY);


      const filtered = stored.filter((msg) => msg.role !== 'system');

      const formatted: Message[] = filtered.map((msg, index) => ({
        id: index + 2, // +2 because id:1 is reserved for initialMessage
        text: msg.content,
        isBot: msg.role === 'assistant',
        timestamp: new Date(),
      }));

      setMessages([initialMessages[0], ...formatted]);
      formatted.forEach((msg) => {
      if (!messageAnimations[msg.id]) {
        messageAnimations[msg.id] = new Animated.Value(0);
        Animated.timing(messageAnimations[msg.id], {
          toValue: 1,
          duration: 400,
          delay: 200 + msg.id * 100,
          useNativeDriver: true,
        }).start();
      }
    });
  };
    loadStoredMessages();
}, []);

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: message.trim(),
        isBot: false,
        timestamp: new Date()
      };

      const tempMessage = message;

      // Initialize animation for new message
      messageAnimations[newMessage.id] = new Animated.Value(0);

      setMessages([...messages, newMessage]);
      setMessage('');

      // Animate new message
      Animated.timing(messageAnimations[newMessage.id], {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }).start();

      // Simulate bot typing
      setIsTyping(true);
      const res = await AIAssistant(message);
      setTimeout(() => {
        setIsTyping(false);
        // Add bot response (optional)
        const botResponse: Message = {
          id: messages.length + 2,
          text: res,
          isBot: true,
          timestamp: new Date()
        };

        messageAnimations[botResponse.id] = new Animated.Value(0);
        setMessages(prev => [...prev, botResponse]);

        Animated.timing(messageAnimations[botResponse.id], {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }).start();
      }, 1500);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      sendMessage();
    }
  };

  const AnimatedMessage = ({ msg }: { msg: Message }) => {
    const animValue = messageAnimations[msg.id] || new Animated.Value(1);

    return (
      <Animated.View
        style={[
          styles.messageWrapper,
          msg.isBot ? styles.botMessageWrapper : styles.userMessageWrapper,
          {
            opacity: animValue,
            transform: [
              {
                translateY: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
              {
                scale: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        {msg.isBot && (
          <Animated.View
            style={[
              styles.profileIcon,
              {
                opacity: animValue,
                transform: [
                  {
                    scale: animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <AteAiProfileIcon
              width={40}
              height={40}
            />
          </Animated.View>
        )}
        <Animated.View
          style={[
            styles.messageBubble,
            msg.isBot ? styles.botBubble : styles.userBubble,
            {
              transform: [
                {
                  scale: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Markdown
            style={{
              body: {
                fontFamily: getFontFamily('regular', fontsLoaded),
                fontSize: 18,
                color: msg.isBot ? '#333' : '#FFFFFF',
                lineHeight: 24,
              },
              strong: {
                fontFamily: getFontFamily('bold', fontsLoaded),
                fontWeight: 'bold',
                color: msg.isBot ? '#333' : '#FFFFFF',
              },
              em: {
                fontStyle: 'italic',
                color: msg.isBot ? '#333' : '#FFFFFF',
              },
              bullet_list: {
                paddingLeft: 10,
                marginVertical: 4,
              },
              list_item: {
                flexDirection: 'row',
                alignItems: 'flex-start',
              },
              paragraph: {
                marginBottom: 8,
              },
            }}
          >
            {msg.text}
          </Markdown>
        </Animated.View>
      </Animated.View>
    );
  };

const TypingIndicator = () => (
  <View style={[styles.messageWrapper, styles.botMessageWrapper]}>
    <View style={styles.profileIcon}>
      <AteAiProfileIcon width={40} height={40} />
    </View>
    <View style={[styles.messageBubble, styles.botBubble]}>
      <View style={styles.typingContainer}>
        <Animated.View
          style={[
            styles.typingDot,
            {
              opacity: typingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.typingDot,
            {
              opacity: typingAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.3, 1, 0.3],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.typingDot,
            {
              opacity: typingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.3],
              }),
            },
          ]}
        />
      </View>
    </View>
  </View>
);

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnimation,
            transform: [
              {
                translateY: headerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                opacity: headerAnimation,
                transform: [
                  {
                    scale: headerAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <AteAiIcon
              width={80}
              height={80}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.headerText,
              {
                opacity: headerAnimation,
                transform: [
                  {
                    translateX: headerAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.headerTitle, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
              Hello, I'm Ate A.I!
            </Text>
            <Text style={[styles.headerSubtitle, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
              Ask me Anything!
            </Text>
          </Animated.View>
        </View>
      </Animated.View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 90} // Adjusted for header height
      >
        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <AnimatedMessage key={msg.id} msg={msg} />
          ))}
          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Animated Input Area */}
        <Animated.View
          style={[
            styles.inputContainer,
            {
              opacity: inputAnimation,
              transform: [
                {
                  translateY: inputAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              { fontFamily: getFontFamily('regular', fontsLoaded) },
              isInputFocused && styles.textInputFocused
            ]}
            placeholder="Message"
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            multiline
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: message.trim() ? 1 : 0.5 }
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 40, // Reduced from 60px
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    color: '#4D0045',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  messageWrapper: {
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  botMessageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userMessageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  profileIcon: {
    marginRight: 10,
    alignSelf: 'flex-end'
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  botBubble: {
    backgroundColor: '#E8D5E8',
    borderBottomLeftRadius: 5,
  },
  userBubble: {
    backgroundColor: '#4D0045',
    borderBottomRightRadius: 5,
  },
  messageText: {
    fontSize: 18,
    lineHeight: 24,
  },
  botText: {
    color: '#333',
  },
  userText: {
    color: '#FFFFFF',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginHorizontal: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 18,
    maxHeight: 100,
    backgroundColor: '#F8F8F8',
  },
  textInputFocused: {
    borderColor: '#4D0045',
    borderWidth: 2,
    shadowColor: '#4D0045',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButton: {
    backgroundColor: '#4D0045',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    shadowColor: '#4D0045',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
