import { mockTravelers } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  CreditCard,
  Hotel,
  Package,
  Percent,
  Shield,
  Ticket,
  Upload,
  Users,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface BookingType {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface SplitOption {
  id: string;
  title: string;
  description: string;
  split: number[];
}

interface Currency {
  id: string;
  symbol: string;
  name: string;
  icon: string;
}

export default function NewSharedBookingScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { partnerId } = useLocalSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);

  // Form state
  const [bookingData, setBookingData] = useState({
    title: "",
    type: "",
    cost: "",
    currency: "ETH",
    splitType: "equal",
    customSplit: [50, 50],
    date: "",
    time: "",
    cancellationPolicy: "mutual",
    cancellationFee: "10",
    invoiceUrl: "",
    notes: "",
  });

  const partner = mockTravelers.find((t) => t.id === partnerId);

  const bookingTypes: BookingType[] = [
    {
      id: "hotel",
      title: "Hotel",
      icon: <Hotel size={24} />,
      description: "Shared accommodation",
    },
    {
      id: "taxi",
      title: "Taxi",
      icon: <Car size={24} />,
      description: "Airport transfer or rides",
    },
    {
      id: "event",
      title: "Event Tickets",
      icon: <Ticket size={24} />,
      description: "Concert, conference, etc.",
    },
    {
      id: "activity",
      title: "Activity",
      icon: <Package size={24} />,
      description: "Tours, experiences, etc.",
    },
    {
      id: "other",
      title: "Other",
      icon: <CreditCard size={24} />,
      description: "Custom booking type",
    },
  ];

  const splitOptions: SplitOption[] = [
    {
      id: "equal",
      title: "Equal Split",
      description: "50% each",
      split: [50, 50],
    },
    {
      id: "custom",
      title: "Custom Split",
      description: "Set your own percentages",
      split: [60, 40],
    },
  ];

  const currencies: Currency[] = [
    { id: "ETH", symbol: "ETH", name: "Ethereum", icon: "🔷" },
    { id: "USDC", symbol: "USDC", name: "USD Coin", icon: "💙" },
    { id: "USDT", symbol: "USDT", name: "Tether", icon: "💚" },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      createBooking();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const createBooking = () => {
    Alert.alert(
      "Create Shared Booking",
      "This will deploy a smart contract and hold funds in escrow. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create",
          onPress: () => {
            Alert.alert(
              "Booking Created!",
              "Smart contract deployed. Waiting for partner to accept and pay.",
              [
                {
                  text: "View Booking",
                  onPress: () => router.push("/shared-booking/history"),
                },
                { text: "OK" },
              ]
            );
          },
        },
      ]
    );
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        What are you booking together?
      </Text>

      <TextInput
        style={[
          styles.titleInput,
          { color: colors.text, borderColor: colors.border },
        ]}
        placeholder="e.g., Shared Hotel in Dubai – Token2049"
        placeholderTextColor={colors.textSecondary}
        value={bookingData.title}
        onChangeText={(text) =>
          setBookingData((prev) => ({ ...prev, title: text }))
        }
      />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Booking Type
      </Text>
      <View style={styles.bookingTypes}>
        {bookingTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.bookingTypeCard,
              {
                backgroundColor:
                  bookingData.type === type.id
                    ? colors.primary
                    : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() =>
              setBookingData((prev) => ({ ...prev, type: type.id }))
            }
          >
            <View style={styles.bookingTypeIcon}>{type.icon}</View>
            <View style={styles.bookingTypeInfo}>
              <Text
                style={[
                  styles.bookingTypeTitle,
                  {
                    color:
                      bookingData.type === type.id ? "#FFFFFF" : colors.text,
                  },
                ]}
              >
                {type.title}
              </Text>
              <Text
                style={[
                  styles.bookingTypeDescription,
                  {
                    color:
                      bookingData.type === type.id
                        ? "#FFFFFF"
                        : colors.textSecondary,
                  },
                ]}
              >
                {type.description}
              </Text>
            </View>
            {bookingData.type === type.id && (
              <CheckCircle size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Cost & Payment Details
      </Text>

      <View style={styles.costSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Total Cost
        </Text>
        <View style={styles.costInput}>
          <TextInput
            style={[styles.costTextInput, { color: colors.text }]}
            placeholder="0.0"
            placeholderTextColor={colors.textSecondary}
            value={bookingData.cost}
            onChangeText={(text) =>
              setBookingData((prev) => ({ ...prev, cost: text }))
            }
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.currencyButton, { backgroundColor: colors.accent }]}
            onPress={() => setShowCurrencyModal(true)}
          >
            <Text style={styles.currencyButtonText}>
              {bookingData.currency}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.splitSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Split Payment
        </Text>
        <View style={styles.splitOptions}>
          {splitOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.splitOptionCard,
                {
                  backgroundColor:
                    bookingData.splitType === option.id
                      ? colors.primary
                      : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => {
                setBookingData((prev) => ({
                  ...prev,
                  splitType: option.id,
                  customSplit: option.split,
                }));
                if (option.id === "custom") {
                  setShowSplitModal(true);
                }
              }}
            >
              <View style={styles.splitOptionInfo}>
                <Text
                  style={[
                    styles.splitOptionTitle,
                    {
                      color:
                        bookingData.splitType === option.id
                          ? "#FFFFFF"
                          : colors.text,
                    },
                  ]}
                >
                  {option.title}
                </Text>
                <Text
                  style={[
                    styles.splitOptionDescription,
                    {
                      color:
                        bookingData.splitType === option.id
                          ? "#FFFFFF"
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {option.description}
                </Text>
              </View>
              {bookingData.splitType === option.id && (
                <CheckCircle size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.dateTimeSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Date & Time
        </Text>
        <View style={styles.dateTimeInputs}>
          <TouchableOpacity
            style={[
              styles.dateTimeInput,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() =>
              Alert.alert("Date Picker", "Date picker coming soon!")
            }
          >
            <Calendar size={20} color={colors.textSecondary} />
            <Text
              style={[styles.dateTimeText, { color: colors.textSecondary }]}
            >
              {bookingData.date || "Select date"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dateTimeInput,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() =>
              Alert.alert("Time Picker", "Time picker coming soon!")
            }
          >
            <Clock size={20} color={colors.textSecondary} />
            <Text
              style={[styles.dateTimeText, { color: colors.textSecondary }]}
            >
              {bookingData.time || "Select time"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Cancellation & Additional Details
      </Text>

      <View style={styles.cancellationSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Cancellation Policy
        </Text>
        <View style={styles.cancellationOptions}>
          <TouchableOpacity
            style={[
              styles.cancellationOption,
              {
                backgroundColor:
                  bookingData.cancellationPolicy === "mutual"
                    ? colors.primary
                    : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() =>
              setBookingData((prev) => ({
                ...prev,
                cancellationPolicy: "mutual",
              }))
            }
          >
            <Users
              size={20}
              color={
                bookingData.cancellationPolicy === "mutual"
                  ? "#FFFFFF"
                  : colors.text
              }
            />
            <Text
              style={[
                styles.cancellationOptionText,
                {
                  color:
                    bookingData.cancellationPolicy === "mutual"
                      ? "#FFFFFF"
                      : colors.text,
                },
              ]}
            >
              Mutual Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cancellationOption,
              {
                backgroundColor:
                  bookingData.cancellationPolicy === "fee"
                    ? colors.primary
                    : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => {
              setBookingData((prev) => ({
                ...prev,
                cancellationPolicy: "fee",
              }));
              setShowCancellationModal(true);
            }}
          >
            <Percent
              size={20}
              color={
                bookingData.cancellationPolicy === "fee"
                  ? "#FFFFFF"
                  : colors.text
              }
            />
            <Text
              style={[
                styles.cancellationOptionText,
                {
                  color:
                    bookingData.cancellationPolicy === "fee"
                      ? "#FFFFFF"
                      : colors.text,
                },
              ]}
            >
              Cancel with Fee
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.additionalSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Additional Details
        </Text>

        <TouchableOpacity
          style={[
            styles.uploadButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => Alert.alert("Upload", "File upload coming soon!")}
        >
          <Upload size={20} color={colors.textSecondary} />
          <Text style={[styles.uploadText, { color: colors.textSecondary }]}>
            Upload invoice or booking confirmation
          </Text>
        </TouchableOpacity>

        <TextInput
          style={[
            styles.notesInput,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholder="Add any specific conditions or notes..."
          placeholderTextColor={colors.textSecondary}
          value={bookingData.notes}
          onChangeText={(text) =>
            setBookingData((prev) => ({ ...prev, notes: text }))
          }
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Review & Create Booking
      </Text>

      <View
        style={[
          styles.reviewCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.reviewHeader}>
          <Text style={[styles.reviewTitle, { color: colors.text }]}>
            Booking Summary
          </Text>
          <Shield size={20} color={colors.primary} />
        </View>

        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>
            Title
          </Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {bookingData.title}
          </Text>
        </View>

        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>
            Type
          </Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {bookingTypes.find((t) => t.id === bookingData.type)?.title}
          </Text>
        </View>

        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>
            Cost
          </Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {bookingData.cost} {bookingData.currency}
          </Text>
        </View>

        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>
            Split
          </Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {bookingData.customSplit[0]}% / {bookingData.customSplit[1]}%
          </Text>
        </View>

        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>
            Partner
          </Text>
          <View style={styles.partnerInfo}>
            <Image
              source={{ uri: partner?.profileImage }}
              style={styles.partnerAvatar}
            />
            <Text style={[styles.reviewValue, { color: colors.text }]}>
              {partner?.name}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.escrowInfo, { backgroundColor: colors.accent }]}>
        <AlertCircle size={20} color="#FFFFFF" />
        <Text style={styles.escrowText}>
          Funds will be held in escrow until both parties confirm completion
        </Text>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          New Shared Booking
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(currentStep / 4) * 100}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          Step {currentStep} of 4
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>{renderCurrentStep()}</ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.footerButton,
            { backgroundColor: colors.textSecondary },
          ]}
          onPress={handleBack}
        >
          <Text style={styles.footerButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.footerButton,
            {
              backgroundColor:
                currentStep === 4 ? colors.primary : colors.secondary,
            },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.footerButtonText}>
            {currentStep === 4 ? "Create Booking" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Currency Modal */}
      <Modal
        visible={showCurrencyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Currency
              </Text>
              <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.currencyOptions}>
              {currencies.map((currency) => (
                <TouchableOpacity
                  key={currency.id}
                  style={[
                    styles.currencyOption,
                    {
                      backgroundColor:
                        bookingData.currency === currency.id
                          ? colors.primary
                          : colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => {
                    setBookingData((prev) => ({
                      ...prev,
                      currency: currency.id,
                    }));
                    setShowCurrencyModal(false);
                  }}
                >
                  <Text style={styles.currencyIcon}>{currency.icon}</Text>
                  <Text
                    style={[
                      styles.currencyName,
                      {
                        color:
                          bookingData.currency === currency.id
                            ? "#FFFFFF"
                            : colors.text,
                      },
                    ]}
                  >
                    {currency.name}
                  </Text>
                  <Text
                    style={[
                      styles.currencySymbol,
                      {
                        color:
                          bookingData.currency === currency.id
                            ? "#FFFFFF"
                            : colors.textSecondary,
                      },
                    ]}
                  >
                    {currency.symbol}
                  </Text>
                </TouchableOpacity>
              ))}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 24,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E5E5EA",
    borderRadius: 2,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContent: {
    gap: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  bookingTypes: {
    gap: 12,
  },
  bookingTypeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  bookingTypeIcon: {
    marginRight: 16,
  },
  bookingTypeInfo: {
    flex: 1,
  },
  bookingTypeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  bookingTypeDescription: {
    fontSize: 14,
  },
  costSection: {
    gap: 12,
  },
  costInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  costTextInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: "600",
  },
  currencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  currencyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  splitSection: {
    gap: 12,
  },
  splitOptions: {
    gap: 12,
  },
  splitOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  splitOptionInfo: {
    flex: 1,
  },
  splitOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  splitOptionDescription: {
    fontSize: 14,
  },
  dateTimeSection: {
    gap: 12,
  },
  dateTimeInputs: {
    flexDirection: "row",
    gap: 12,
  },
  dateTimeInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  dateTimeText: {
    fontSize: 16,
  },
  cancellationSection: {
    gap: 12,
  },
  cancellationOptions: {
    flexDirection: "row",
    gap: 12,
  },
  cancellationOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  cancellationOptionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  additionalSection: {
    gap: 12,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  reviewCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  reviewItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  reviewLabel: {
    fontSize: 14,
  },
  reviewValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  partnerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  partnerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  escrowInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  escrowText: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
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
  currencyOptions: {
    gap: 12,
  },
  currencyOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  currencyIcon: {
    fontSize: 24,
  },
  currencyName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  currencySymbol: {
    fontSize: 14,
  },
});
