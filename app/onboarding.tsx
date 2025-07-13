import WalletConnectButton from "@/components/WalletConnectButton";
import { useTheme } from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  User,
  Users,
  Wallet,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PhotoResult, photoService } from "../services/photoService";

const { width } = Dimensions.get("window");

// Mock data for interests and languages
const interests = [
  "Conferences",
  "Sightseeing",
  "Festivals",
  "Co-working",
  "Adventure",
  "Culture",
  "Food",
  "Music",
  "Sports",
  "Technology",
];

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Chinese",
  "Japanese",
  "Korean",
];

// Onboarding steps
const ONBOARDING_STEPS = {
  WELCOME: 0,
  SIGNUP: 1,
  PROFILE: 2,
  LENS: 3,
  PRIVACY: 4,
  FINAL: 5,
};

const onboardingSlides = [
  {
    id: 1,
    title: "Find travelers attending the same event",
    subtitle: "Connect with people who share your travel plans and interests",
    icon: Users,
  },
  {
    id: 2,
    title: "Plan and split bookings with smart contracts",
    subtitle:
      "Secure, transparent booking management with blockchain technology",
    icon: MapPin,
  },
  {
    id: 3,
    title: "Pay with crypto or fiat",
    subtitle: "Flexible payment options for modern travelers",
    icon: Wallet,
  },
];

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(ONBOARDING_STEPS.WELCOME);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Signup form state
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    username: "",
    bio: "",
    selectedInterests: [] as string[],
    selectedLanguages: [] as string[],
  });

  // Privacy preferences state
  const [privacySettings, setPrivacySettings] = useState({
    onlyMatchesSeeProfile: false,
    allowLocationSharing: false,
    autoRejectNonVerified: true,
    storeReviewsOnChain: false,
  });

  // Lens connection state
  const [lensConnected, setLensConnected] = useState(false);
  const [lensHandle, setLensHandle] = useState("");

  // Add wallet and photo state
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<PhotoResult | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleNextStep = () => {
    // Validate current step before proceeding
    if (currentStep === ONBOARDING_STEPS.SIGNUP) {
      if (!signupData.fullName || !signupData.email || !signupData.password) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }
      if (signupData.password !== signupData.confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }
    }

    if (currentStep === ONBOARDING_STEPS.PROFILE) {
      if (!profileData.username || profileData.selectedInterests.length === 0) {
        Alert.alert(
          "Error",
          "Please enter a username and select at least one interest"
        );
        return;
      }
      // Optional: Check if wallet is connected
      if (!isWalletConnected) {
        Alert.alert(
          "Wallet Connection",
          "Please connect your wallet to continue. This enables secure payments and smart contract interactions.",
          [
            { text: "Skip for now", onPress: () => completeOnboarding() },
            { text: "Connect Wallet", style: "cancel" },
          ]
        );
        return;
      }
    }

    if (currentStep < ONBOARDING_STEPS.FINAL) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > ONBOARDING_STEPS.WELCOME) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSlideChange = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentSlide(index);
  };

  const toggleInterest = (interest: string) => {
    setProfileData((prev) => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter((i) => i !== interest)
        : [...prev.selectedInterests, interest],
    }));
  };

  const toggleLanguage = (language: string) => {
    setProfileData((prev) => ({
      ...prev,
      selectedLanguages: prev.selectedLanguages.includes(language)
        ? prev.selectedLanguages.filter((l) => l !== language)
        : [...prev.selectedLanguages, language],
    }));
  };

  const togglePrivacySetting = (setting: keyof typeof privacySettings) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleLensConnection = () => {
    // Mock Lens connection
    setLensConnected(true);
    setLensHandle("john.lens");
    Alert.alert("Success", "Lens Protocol profile connected successfully!");
  };

  // Real wallet connection handler using AppKit
  const handleWalletConnection = () => {
    // AppKit handles the connection automatically when the button is clicked
    // No need for manual handling
  };

  // Real photo upload handler
  const handlePhotoUpload = async () => {
    try {
      Alert.alert("Add Photo", "Choose photo source:", [
        {
          text: "Camera",
          onPress: async () => {
            const photo = await photoService.takePhoto();
            if (photo) setProfilePhoto(photo);
          },
        },
        {
          text: "Gallery",
          onPress: async () => {
            const photo = await photoService.pickFromGallery();
            if (photo) setProfilePhoto(photo);
          },
        },
        { text: "Cancel", style: "cancel" },
      ]);
    } catch (error: any) {
      Alert.alert("Photo Error", error.message || "Failed to add photo");
    }
  };

  const completeOnboarding = async () => {
    try {
      // Save onboarding completion status
      await AsyncStorage.setItem("hasCompletedOnboarding", "true");

      // Navigate to home page
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      // Still navigate even if saving fails
      router.replace("/(tabs)");
    }
  };

  const renderWelcomeScreen = () => (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={[styles.appTitle, { color: colors.primary }]}>CoPass</Text>
        <Text style={[styles.appTagline, { color: colors.textSecondary }]}>
          Connect with purpose-driven travelers
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleSlideChange}
        scrollEventThrottle={16}
        style={styles.carousel}
      >
        {onboardingSlides.map((slide) => {
          const IconComponent = slide.icon;
          return (
            <View key={slide.id} style={styles.slide}>
              <View
                style={[styles.slideIcon, { backgroundColor: colors.primary }]}
              >
                <IconComponent size={48} color="#FFFFFF" />
              </View>
              <Text style={[styles.slideTitle, { color: colors.text }]}>
                {slide.title}
              </Text>
              <Text
                style={[styles.slideSubtitle, { color: colors.textSecondary }]}
              >
                {slide.subtitle}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.pagination}>
        {onboardingSlides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentSlide ? colors.primary : colors.border,
                width: index === currentSlide ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={handleNextStep}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={[styles.secondaryButton, { color: colors.primary }]}>
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSignupScreen = () => (
    <View style={styles.screen}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={handlePrevStep} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: colors.text }]}>
          Create Account
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Sign Up Options
        </Text>

        {/* Email Signup */}
        <View style={styles.signupSection}>
          <Text style={[styles.subsectionTitle, { color: colors.text }]}>
            Email Signup
          </Text>

          <View style={styles.inputContainer}>
            <User size={20} color={colors.textSecondary} />
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Full Name"
              placeholderTextColor={colors.textSecondary}
              value={signupData.fullName}
              onChangeText={(text) =>
                setSignupData((prev) => ({ ...prev, fullName: text }))
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Mail size={20} color={colors.textSecondary} />
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={signupData.email}
              onChangeText={(text) =>
                setSignupData((prev) => ({ ...prev, email: text }))
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.textSecondary} />
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              value={signupData.password}
              onChangeText={(text) =>
                setSignupData((prev) => ({ ...prev, password: text }))
              }
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.textSecondary} />
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Confirm Password"
              placeholderTextColor={colors.textSecondary}
              value={signupData.confirmPassword}
              onChangeText={(text) =>
                setSignupData((prev) => ({ ...prev, confirmPassword: text }))
              }
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* OAuth Options */}
        <View style={styles.signupSection}>
          <Text style={[styles.subsectionTitle, { color: colors.text }]}>
            Quick Signup
          </Text>

          <TouchableOpacity
            style={[styles.oauthButton, { borderColor: colors.border }]}
          >
            <Text style={[styles.oauthButtonText, { color: colors.text }]}>
              Continue with Google
            </Text>
          </TouchableOpacity>
        </View>

        {/* Wallet Connection Section */}
        <View style={styles.walletSection}>
          <Text style={[styles.walletSectionTitle, { color: colors.text }]}>
            Connect Your Wallet
          </Text>
          <Text
            style={[
              styles.walletSectionDescription,
              { color: colors.textSecondary },
            ]}
          >
            Connect your wallet to enable secure payments and smart contract
            interactions
          </Text>
          <WalletConnectButton />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={handleNextStep}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProfileScreen = () => (
    <View style={styles.screen}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={handlePrevStep} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: colors.text }]}>
          Profile Setup
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Tell us a bit about your travel interests
        </Text>

        {/* Profile Picture */}
        <View style={styles.profilePictureSection}>
          <TouchableOpacity
            style={[styles.profilePicture, { borderColor: colors.border }]}
            onPress={handlePhotoUpload}
          >
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto.uri }}
                style={styles.profilePictureImage}
                resizeMode="cover"
              />
            ) : (
              <>
                <Camera size={24} color={colors.textSecondary} />
                <Text
                  style={[
                    styles.profilePictureText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Add Photo
                </Text>
              </>
            )}
          </TouchableOpacity>
          {profilePhoto && (
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={handlePhotoUpload}
            >
              <Text style={[styles.changePhotoText, { color: colors.primary }]}>
                Change Photo
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Username */}
        <View style={styles.inputContainer}>
          <User size={20} color={colors.textSecondary} />
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
            placeholder="Username"
            placeholderTextColor={colors.textSecondary}
            value={profileData.username}
            onChangeText={(text) =>
              setProfileData((prev) => ({ ...prev, username: text }))
            }
            autoCapitalize="none"
          />
        </View>

        {/* Bio */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.textArea,
              { color: colors.text, borderColor: colors.border },
            ]}
            placeholder="Short bio (up to 250 characters)"
            placeholderTextColor={colors.textSecondary}
            value={profileData.bio}
            onChangeText={(text) =>
              setProfileData((prev) => ({ ...prev, bio: text }))
            }
            multiline
            numberOfLines={3}
            maxLength={250}
          />
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={[styles.subsectionTitle, { color: colors.text }]}>
            Interests
          </Text>
          <View style={styles.chipContainer}>
            {interests.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.chip,
                  {
                    backgroundColor: profileData.selectedInterests.includes(
                      interest
                    )
                      ? colors.primary
                      : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: profileData.selectedInterests.includes(interest)
                        ? "#FFFFFF"
                        : colors.text,
                    },
                  ]}
                >
                  {interest}
                </Text>
                {profileData.selectedInterests.includes(interest) && (
                  <Check size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Languages */}
        <View style={styles.section}>
          <Text style={[styles.subsectionTitle, { color: colors.text }]}>
            Preferred Languages
          </Text>
          <View style={styles.chipContainer}>
            {languages.slice(0, 8).map((language) => (
              <TouchableOpacity
                key={language}
                style={[
                  styles.chip,
                  {
                    backgroundColor: profileData.selectedLanguages.includes(
                      language
                    )
                      ? colors.primary
                      : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => toggleLanguage(language)}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: profileData.selectedLanguages.includes(language)
                        ? "#FFFFFF"
                        : colors.text,
                    },
                  ]}
                >
                  {language}
                </Text>
                {profileData.selectedLanguages.includes(language) && (
                  <Check size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={handleNextStep}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCurrentScreen = () => {
    switch (currentStep) {
      case ONBOARDING_STEPS.WELCOME:
        return renderWelcomeScreen();
      case ONBOARDING_STEPS.SIGNUP:
        return renderSignupScreen();
      case ONBOARDING_STEPS.PROFILE:
        return renderProfileScreen();
      default:
        return renderWelcomeScreen();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderCurrentScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    textAlign: "center",
  },
  carousel: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  slideIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  slideSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  screenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
  },
  signupSection: {
    marginBottom: 32,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  oauthButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  oauthButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  walletButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  walletButtonText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
    flex: 1,
  },
  walletDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  profilePictureSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePictureImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  profilePictureText: {
    fontSize: 14,
    marginTop: 8,
  },
  changePhotoButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: "500",
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  section: {
    marginBottom: 32,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  secondaryButton: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  walletSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  walletSectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  walletSectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
});
