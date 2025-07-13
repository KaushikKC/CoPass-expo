import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Car,
  Check,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Home,
  MapPin,
  Plus,
  Target,
  Users,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TripData {
  destination: {
    name: string;
    coordinates: { lat: number; lng: number } | null;
  };
  dates: {
    start: Date | null;
    end: Date | null;
    flexible: boolean;
  };
  purpose: string[];
  description: string;
  visibility: "public" | "matches" | "private";
  preferences: {
    ageRange: { min: number; max: number };
    gender: string[];
    languages: string[];
    shareRoom: boolean;
    shareTransport: boolean;
  };
}

const purposeOptions = [
  "Conference",
  "Tourism",
  "Festival",
  "Remote Work",
  "Business",
  "Adventure",
  "Culture",
  "Food",
  "Music",
  "Sports",
];

const genderOptions = ["Male", "Female", "Non-binary", "Any"];
const languageOptions = [
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

export default function AddTripScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showCustomPurpose, setShowCustomPurpose] = useState(false);
  const [customPurpose, setCustomPurpose] = useState("");
  const [showCustomDateInput, setShowCustomDateInput] = useState(false);
  const [customDateInput, setCustomDateInput] = useState("");
  const [customDateType, setCustomDateType] = useState<"start" | "end">(
    "start"
  );

  const [tripData, setTripData] = useState<TripData>({
    destination: {
      name: "",
      coordinates: null,
    },
    dates: {
      start: null,
      end: null,
      flexible: false,
    },
    purpose: [],
    description: "",
    visibility: "public",
    preferences: {
      ageRange: { min: 18, max: 65 },
      gender: ["Any"],
      languages: ["English"],
      shareRoom: false,
      shareTransport: false,
    },
  });

  const handleDestinationSearch = (text: string) => {
    setTripData((prev) => ({
      ...prev,
      destination: { ...prev.destination, name: text },
    }));
  };

  const handleDateSelect = (type: "start" | "end") => {
    // Interactive date picker implementation
    Alert.alert(
      `Select ${type === "start" ? "Start" : "End"} Date`,
      "Choose a date:",
      [
        {
          text: "Today",
          onPress: () => {
            const today = new Date();
            setTripData((prev) => ({
              ...prev,
              dates: {
                ...prev.dates,
                [type]: today,
              },
            }));
          },
        },
        {
          text: "Tomorrow",
          onPress: () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setTripData((prev) => ({
              ...prev,
              dates: {
                ...prev.dates,
                [type]: tomorrow,
              },
            }));
          },
        },
        {
          text: "Next Week",
          onPress: () => {
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            setTripData((prev) => ({
              ...prev,
              dates: {
                ...prev.dates,
                [type]: nextWeek,
              },
            }));
          },
        },
        {
          text: "Next Month",
          onPress: () => {
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            setTripData((prev) => ({
              ...prev,
              dates: {
                ...prev.dates,
                [type]: nextMonth,
              },
            }));
          },
        },
        {
          text: "Custom Date",
          onPress: () => {
            setCustomDateType(type);
            setCustomDateInput("");
            setShowCustomDateInput(true);
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const handleCustomDateSubmit = () => {
    if (!customDateInput.trim()) {
      Alert.alert("Error", "Please enter a date");
      return;
    }

    // Try multiple date formats
    const dateFormats = [
      /^\d{1,2}\/\d{1,2}\/\d{4}$/, // MM/DD/YYYY
      /^\d{4}-\d{1,2}-\d{1,2}$/, // YYYY-MM-DD
      /^\d{1,2}-\d{1,2}-\d{4}$/, // MM-DD-YYYY
    ];

    let customDate: Date | null = null;

    for (const format of dateFormats) {
      if (format.test(customDateInput)) {
        customDate = new Date(customDateInput);
        break;
      }
    }

    if (!customDate || isNaN(customDate.getTime())) {
      Alert.alert("Error", "Please enter a valid date in MM/DD/YYYY format");
      return;
    }

    // Validate that the date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (customDate < today) {
      Alert.alert("Error", "Please select a future date");
      return;
    }

    setTripData((prev) => ({
      ...prev,
      dates: {
        ...prev.dates,
        [customDateType]: customDate,
      },
    }));

    setShowCustomDateInput(false);
    setCustomDateInput("");
  };

  const togglePurpose = (purpose: string) => {
    setTripData((prev) => ({
      ...prev,
      purpose: prev.purpose.includes(purpose)
        ? prev.purpose.filter((p) => p !== purpose)
        : [...prev.purpose, purpose],
    }));
  };

  const addCustomPurpose = () => {
    if (customPurpose.trim()) {
      // Add to both the trip data and the purpose options list
      const newPurpose = customPurpose.trim();
      setTripData((prev) => ({
        ...prev,
        purpose: [...prev.purpose, newPurpose],
      }));

      // Also add to the global purpose options if it's not already there
      if (!purposeOptions.includes(newPurpose)) {
        purposeOptions.push(newPurpose);
      }

      setCustomPurpose("");
      setShowCustomPurpose(false);
      Alert.alert(
        "Success",
        `Custom purpose "${newPurpose}" added successfully!`
      );
    } else {
      Alert.alert("Error", "Please enter a purpose name");
    }
  };

  const togglePreference = (
    type: keyof TripData["preferences"],
    value: any
  ) => {
    setTripData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [type]: value,
      },
    }));
  };

  const handleSaveTrip = () => {
    if (!tripData.destination.name) {
      Alert.alert("Error", "Please enter a destination");
      return;
    }
    if (!tripData.dates.start || !tripData.dates.end) {
      Alert.alert("Error", "Please select start and end dates");
      return;
    }
    if (tripData.purpose.length === 0) {
      Alert.alert("Error", "Please select at least one purpose");
      return;
    }

    Alert.alert(
      "Trip Saved!",
      "Your trip has been created successfully. Redirecting to Find Matches...",
      [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/match"),
        },
      ]
    );
  };

  const renderDestinationSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MapPin size={24} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Destination
        </Text>
      </View>

      <View
        style={[
          styles.mapContainer,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.mapPlaceholder, { color: colors.textSecondary }]}>
          🗺️ Interactive Map View
        </Text>
        <Text style={[styles.mapSubtext, { color: colors.textSecondary }]}>
          Click on map or search below
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <MapPin size={20} color={colors.textSecondary} />
        <TextInput
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholder="Search destination (e.g., Dubai)"
          placeholderTextColor={colors.textSecondary}
          value={tripData.destination.name}
          onChangeText={handleDestinationSearch}
        />
      </View>
    </View>
  );

  const renderDatesSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Calendar size={24} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Dates</Text>
      </View>

      <View style={styles.dateContainer}>
        <TouchableOpacity
          style={[
            styles.dateButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => handleDateSelect("start")}
        >
          <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>
            Start Date
          </Text>
          <Text style={[styles.dateValue, { color: colors.text }]}>
            {tripData.dates.start
              ? tripData.dates.start.toLocaleDateString()
              : "Select date"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.dateButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => handleDateSelect("end")}
        >
          <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>
            End Date
          </Text>
          <Text style={[styles.dateValue, { color: colors.text }]}>
            {tripData.dates.end
              ? tripData.dates.end.toLocaleDateString()
              : "Select date"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.flexibleToggle,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={() =>
          setTripData((prev) => ({
            ...prev,
            dates: { ...prev.dates, flexible: !prev.dates.flexible },
          }))
        }
      >
        <Text style={[styles.flexibleText, { color: colors.text }]}>
          Flexible dates
        </Text>
        <View
          style={[
            styles.toggle,
            {
              backgroundColor: tripData.dates.flexible
                ? colors.primary
                : colors.border,
            },
          ]}
        >
          {tripData.dates.flexible && <View style={styles.toggleThumb} />}
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderPurposeSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Target size={24} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Purpose
        </Text>
      </View>

      <View style={styles.chipContainer}>
        {purposeOptions.map((purpose) => (
          <TouchableOpacity
            key={purpose}
            style={[
              styles.chip,
              {
                backgroundColor: tripData.purpose.includes(purpose)
                  ? colors.primary
                  : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => togglePurpose(purpose)}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: tripData.purpose.includes(purpose)
                    ? "#FFFFFF"
                    : colors.text,
                },
              ]}
            >
              {purpose}
            </Text>
            {tripData.purpose.includes(purpose) && (
              <Check size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        ))}

        {/* Show selected custom purposes */}
        {tripData.purpose
          .filter((p) => !purposeOptions.includes(p))
          .map((purpose) => (
            <TouchableOpacity
              key={purpose}
              style={[
                styles.chip,
                {
                  backgroundColor: colors.primary,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => togglePurpose(purpose)}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: "#FFFFFF",
                  },
                ]}
              >
                {purpose}
              </Text>
              <Check size={16} color="#FFFFFF" />
            </TouchableOpacity>
          ))}
      </View>

      <TouchableOpacity
        style={[styles.addCustomButton, { borderColor: colors.border }]}
        onPress={() => setShowCustomPurpose(true)}
      >
        <Plus size={16} color={colors.primary} />
        <Text style={[styles.addCustomText, { color: colors.primary }]}>
          Add Custom Purpose
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDescriptionSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <FileText size={24} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Description
        </Text>
      </View>

      <TextInput
        style={[
          styles.textArea,
          { color: colors.text, borderColor: colors.border },
        ]}
        placeholder="Describe your trip and what you're looking for..."
        placeholderTextColor={colors.textSecondary}
        value={tripData.description}
        onChangeText={(text) =>
          setTripData((prev) => ({ ...prev, description: text }))
        }
        multiline
        numberOfLines={4}
        maxLength={500}
      />
    </View>
  );

  const renderVisibilitySection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Eye size={24} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Visibility
        </Text>
      </View>

      <View style={styles.visibilityContainer}>
        {[
          {
            key: "public",
            icon: Globe,
            title: "Public",
            description: "Anyone can see this trip",
          },
          {
            key: "matches",
            icon: Users,
            title: "Matches Only",
            description: "Only matched users can see",
          },
          {
            key: "private",
            icon: EyeOff,
            title: "Private",
            description: "Used only for planning",
          },
        ].map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.visibilityOption,
              {
                backgroundColor:
                  tripData.visibility === option.key
                    ? colors.primary
                    : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() =>
              setTripData((prev) => ({
                ...prev,
                visibility: option.key as any,
              }))
            }
          >
            <option.icon
              size={20}
              color={
                tripData.visibility === option.key ? "#FFFFFF" : colors.text
              }
            />
            <View style={styles.visibilityText}>
              <Text
                style={[
                  styles.visibilityTitle,
                  {
                    color:
                      tripData.visibility === option.key
                        ? "#FFFFFF"
                        : colors.text,
                  },
                ]}
              >
                {option.title}
              </Text>
              <Text
                style={[
                  styles.visibilityDescription,
                  {
                    color:
                      tripData.visibility === option.key
                        ? "rgba(255,255,255,0.8)"
                        : colors.textSecondary,
                  },
                ]}
              >
                {option.description}
              </Text>
            </View>
            {tripData.visibility === option.key && (
              <Check size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPreferencesSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Users size={24} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Matching Preferences
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Want to improve your matching?
        </Text>
      </View>

      <View style={styles.preferencesContainer}>
        <View style={[styles.preferenceItem, { borderColor: colors.border }]}>
          <Text style={[styles.preferenceTitle, { color: colors.text }]}>
            Age Range
          </Text>
          <Text
            style={[styles.preferenceValue, { color: colors.textSecondary }]}
          >
            {tripData.preferences.ageRange.min} -{" "}
            {tripData.preferences.ageRange.max} years
          </Text>
        </View>

        <View style={[styles.preferenceItem, { borderColor: colors.border }]}>
          <Text style={[styles.preferenceTitle, { color: colors.text }]}>
            Gender Preference
          </Text>
          <Text
            style={[styles.preferenceValue, { color: colors.textSecondary }]}
          >
            {tripData.preferences.gender.join(", ")}
          </Text>
        </View>

        <View style={[styles.preferenceItem, { borderColor: colors.border }]}>
          <Text style={[styles.preferenceTitle, { color: colors.text }]}>
            Languages
          </Text>
          <Text
            style={[styles.preferenceValue, { color: colors.textSecondary }]}
          >
            {tripData.preferences.languages.join(", ")}
          </Text>
        </View>

        <View style={[styles.preferenceItem, { borderColor: colors.border }]}>
          <View style={styles.preferenceRow}>
            <Home size={20} color={colors.text} />
            <Text style={[styles.preferenceTitle, { color: colors.text }]}>
              Share Room
            </Text>
            <TouchableOpacity
              style={[
                styles.toggle,
                {
                  backgroundColor: tripData.preferences.shareRoom
                    ? colors.primary
                    : colors.border,
                },
              ]}
              onPress={() =>
                togglePreference("shareRoom", !tripData.preferences.shareRoom)
              }
            >
              {tripData.preferences.shareRoom && (
                <View style={styles.toggleThumb} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.preferenceItem, { borderColor: colors.border }]}>
          <View style={styles.preferenceRow}>
            <Car size={20} color={colors.text} />
            <Text style={[styles.preferenceTitle, { color: colors.text }]}>
              Share Transportation
            </Text>
            <TouchableOpacity
              style={[
                styles.toggle,
                {
                  backgroundColor: tripData.preferences.shareTransport
                    ? colors.primary
                    : colors.border,
                },
              ]}
              onPress={() =>
                togglePreference(
                  "shareTransport",
                  !tripData.preferences.shareTransport
                )
              }
            >
              {tripData.preferences.shareTransport && (
                <View style={styles.toggleThumb} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTripPreview = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Trip Preview
      </Text>

      <View style={[styles.previewCard, { backgroundColor: colors.surface }]}>
        <View style={styles.previewHeader}>
          <MapPin size={20} color={colors.primary} />
          <Text style={[styles.previewDestination, { color: colors.text }]}>
            {tripData.destination.name || "Destination"}
          </Text>
        </View>

        <View style={styles.previewDates}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text
            style={[styles.previewDateText, { color: colors.textSecondary }]}
          >
            {tripData.dates.start && tripData.dates.end
              ? `${tripData.dates.start.toLocaleDateString()} - ${tripData.dates.end.toLocaleDateString()}`
              : "Dates not set"}
          </Text>
        </View>

        <View style={styles.previewPurposes}>
          {tripData.purpose.slice(0, 3).map((purpose, index) => (
            <View
              key={index}
              style={[styles.previewChip, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.previewChipText, { color: "#FFFFFF" }]}>
                {purpose}
              </Text>
            </View>
          ))}
          {tripData.purpose.length > 3 && (
            <Text style={[styles.previewMore, { color: colors.textSecondary }]}>
              +{tripData.purpose.length - 3} more
            </Text>
          )}
        </View>

        {tripData.description && (
          <Text
            style={[styles.previewDescription, { color: colors.textSecondary }]}
          >
            {tripData.description}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Add Trip
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderDestinationSection()}
        {renderDatesSection()}
        {renderPurposeSection()}
        {renderDescriptionSection()}
        {renderVisibilitySection()}
        {renderPreferencesSection()}
        {renderTripPreview()}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSaveTrip}
        >
          <Text style={styles.saveButtonText}>Save Trip</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Purpose Modal */}
      <Modal
        visible={showCustomPurpose}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomPurpose(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Add Custom Purpose
              </Text>
              <TouchableOpacity onPress={() => setShowCustomPurpose(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.modalInput,
                { color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Enter custom purpose"
              placeholderTextColor={colors.textSecondary}
              value={customPurpose}
              onChangeText={setCustomPurpose}
            />

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={addCustomPurpose}
            >
              <Text style={styles.modalButtonText}>Add Purpose</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Custom Date Input Modal */}
      <Modal
        visible={showCustomDateInput}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomDateInput(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Enter Date
              </Text>
              <TouchableOpacity onPress={() => setShowCustomDateInput(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.modalInput,
                { color: colors.text, borderColor: colors.border },
              ]}
              placeholder="Enter date (MM/DD/YYYY)"
              placeholderTextColor={colors.textSecondary}
              value={customDateInput}
              onChangeText={setCustomDateInput}
              keyboardType="numeric"
              maxLength={10}
            />

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handleCustomDateSubmit}
            >
              <Text style={styles.modalButtonText}>Set Date</Text>
            </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginLeft: 12,
    marginTop: 4,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  mapPlaceholder: {
    fontSize: 18,
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dateLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  flexibleToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  flexibleText: {
    fontSize: 16,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
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
  addCustomButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  addCustomText: {
    fontSize: 16,
    fontWeight: "500",
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  visibilityContainer: {
    gap: 12,
  },
  visibilityOption: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  visibilityText: {
    flex: 1,
    marginLeft: 12,
  },
  visibilityTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  visibilityDescription: {
    fontSize: 14,
  },
  preferencesContainer: {
    gap: 12,
  },
  preferenceItem: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  preferenceValue: {
    fontSize: 14,
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  previewCard: {
    borderRadius: 12,
    padding: 16,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  previewDestination: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  previewDates: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  previewDateText: {
    fontSize: 14,
    marginLeft: 8,
  },
  previewPurposes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  previewChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewChipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  previewMore: {
    fontSize: 12,
    alignSelf: "center",
  },
  previewDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
