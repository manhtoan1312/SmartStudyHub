import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UploadReportFile } from "../../services/Guest/UploadFile";
import PickerSelect from "react-native-picker-select";
import { CreateReport } from "../../services/Guest/ReportService";
import getRole from "../../services/RoleService";

const Report = ({ route, navigation }) => {
  const type = route.params?.reportType || "HELP";
  const uId = route.params?.id;
  const [report, setReport] = useState({
    userWasReportedId: null,
    email: null,
    phoneNumber: null,
    title: null,
    whereProblemOccur: null,
    descriptionDetail: null,
    whatHelp: null,
    howProblemAffect: null,
    thingMostSatisfy: null,
    thingToImprove: null,
    typeReport: type,
    urlFile: null,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [titleText, setTitleText] = useState("What do you need assistance?");
  const [file, setFile] = useState(null);

  useEffect(() => {
    let text;
    if (report.typeReport === "HELP") {
      text = "What do you need assistance?*";
    } else if (report.typeReport === "REPORTPROBLEM") {
      text = "What is the problem you encountered?*";
    } else {
      text = "Tilte*";
    }
    setTitleText(text);
  }, [report.typeReport]);
  const handleInputChange = (field, value) => {
    setReport({ ...report, [field]: value });
  };

  const handleChooseImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Warning", "Permission denied!");
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled) {
          if (result.assets[0].fileSize > 10485760) {
            Alert.alert("Warning!", "file size too large");
          } else {
            setSelectedImage(result.assets[0].uri);
            setFile({
              uri: result.assets[0].uri,
              name: `${result.assets[0].fileName}`,
              type: "image/jpeg",
            });
          }
        }
      }
    } catch (error) {
      console.error("Image library launch error:", error);
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
  };

  const validateForm = () => {
    const { email, phoneNumber, title, descriptionDetail, typeReport } = report;

    if (!email || !phoneNumber || !title || !descriptionDetail) {
      return false;
    }

    if (typeReport === "HELP" && !report.whatHelp) {
      return false;
    }

    if (typeReport === "REPORTPROBLEM" && !report.whereProblemOccur) {
      return false;
    }

    if (
      typeReport === "FEEDBACK" &&
      (!report.thingMostSatisfy || !report.thingToImprove)
    ) {
      return false;
    }

    return true;
  };

  const handleSubmitReport = async () => {
    if (!validateForm()) {
      Alert.alert("Incomplete Form", "Please fill in all required fields.");
      return;
    }

    let id = await AsyncStorage.getItem("id");
    if (uId) {
      id = uId;
    } else {
      const role = await getRole();
      if (role) {
        id = role.id;
      }
    }
    if (file) {
      const response = await UploadReportFile(file, id);
      if (response.success) {
        const rs = await CreateReport(id, {
          ...report,
          urlFile: response.data,
        });
        if (rs.success) {
          Alert.alert("Success", "Send report successfully!");
        } else {
          Alert.alert("Error", "Send report failed!");
          console.log(rs.message);
        }
      } else {
        Alert.alert("Error", "Update image failed!");
        console.log(response.message);
      }
    } else {
      const rs = await CreateReport(id, report);
      if (rs.success) {
        Alert.alert("Success", "Send report successfully!");
      } else {
        Alert.alert("Error", "Send report failed!");
        console.log(rs.message);
      }
    }

    setSelectedImage(null);
    setReport({
      userWasReportedId: null,
      email: null,
      phoneNumber: null,
      title: null,
      whereProblemOccur: null,
      descriptionDetail: null,
      whatHelp: null,
      howProblemAffect: null,
      thingMostSatisfy: null,
      thingToImprove: null,
      typeReport: "HELP",
      urlFile: null,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="angle-left" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Feedback And Report</Text>
        </View>

        <ScrollView style={{ height: 300 }}>
          <TextInput
            placeholder="Email*"
            value={report.email}
            onChangeText={(text) => handleInputChange("email", text)}
            style={styles.additionalInput}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Phone Number*"
            value={report.phoneNumber}
            onChangeText={(text) => handleInputChange("phoneNumber", text)}
            style={styles.additionalInput}
            keyboardType="numeric"
          />
          <TextInput
            placeholder={titleText}
            value={report.title}
            onChangeText={(text) => handleInputChange("title", text)}
            style={styles.additionalInput}
          />
          <View style={styles.inputContainer}>
            {report.typeReport === "HELP" && (
              <View>
                <TextInput
                  placeholder="Problem Details*"
                  multiline
                  numberOfLines={6}
                  value={report.descriptionDetail}
                  onChangeText={(text) =>
                    handleInputChange("descriptionDetail", text)
                  }
                  style={styles.input}
                />
                <TextInput
                  placeholder="What help do you need?"
                  value={report.whatHelp}
                  onChangeText={(text) => handleInputChange("whatHelp", text)}
                  style={styles.input}
                />
              </View>
            )}
            {report.typeReport === "REPORTPROBLEM" && (
              <View>
                <TextInput
                  placeholder="Where did the problem occur?*"
                  value={report.whereProblemOccur}
                  onChangeText={(text) =>
                    handleInputChange("whereProblemOccur", text)
                  }
                  style={styles.input}
                />
                <TextInput
                  placeholder="Process error occurred*"
                  multiline
                  numberOfLines={6}
                  value={report.descriptionDetail}
                  onChangeText={(text) =>
                    handleInputChange("descriptionDetail", text)
                  }
                  style={styles.input}
                />
                <TextInput
                  placeholder="How did the problem affect you?"
                  value={report.howProblemAffect}
                  onChangeText={(text) =>
                    handleInputChange("howProblemAffect", text)
                  }
                  style={styles.input}
                />
              </View>
            )}

            {report.typeReport === "FEEDBACK" && (
              <View>
                <TextInput
                  placeholder="What thing most satisfies you?*"
                  value={report.thingMostSatisfy}
                  onChangeText={(text) =>
                    handleInputChange("thingMostSatisfy", text)
                  }
                  style={styles.input}
                />
                <TextInput
                  placeholder="What thing needs improvement?*"
                  value={report.thingToImprove}
                  onChangeText={(text) =>
                    handleInputChange("thingToImprove", text)
                  }
                  style={styles.input}
                />
                <TextInput
                  placeholder="Describe your feelings*"
                  multiline
                  numberOfLines={6}
                  value={report.descriptionDetail}
                  onChangeText={(text) =>
                    handleInputChange("descriptionDetail", text)
                  }
                  style={styles.input}
                />
              </View>
            )}
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Select Type of Report: </Text>
            <PickerSelect
              value={report.typeReport}
              onValueChange={(value) => handleInputChange("typeReport", value)}
              items={[
                { label: "Help", value: "HELP" },
                { label: "Report Problem", value: "REPORTPROBLEM" },
                { label: "Feedback", value: "FEEDBACK" },
              ]}
              style={styles.picker}
            />
          </View>
          {!selectedImage ? (
            <View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleChooseImage}
              >
                <Text style={styles.buttonText}>Choose Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImage}
              />
              <View style={styles.optionButtons}>
                <TouchableOpacity
                  style={styles.changeButton}
                  onPress={handleChooseImage}
                >
                  <Text style={styles.buttonText}>Change Image</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteImage}
                >
                  <Text style={styles.buttonText}>Delete Image</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitReport}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
    width: 50,
    height: 40,
  },
  content: {
    padding: 60,
    justifyContent: "center",
    height: "100%",
  },
  titleContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#e27602",
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 20,
    color: "#e27602",
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },

  optionButtons: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  input: {
    fontSize: 16,
    height: 50,
    padding: 10,
    borderBottomWidth: 2,
    borderColor: "#ccc",
    marginBottom: 20,
  },
  changeButton: {
    backgroundColor: "#FFA500",
    marginTop: 20,
    padding: 15,
    borderRadius: 25,
    width: 140,
    alignItems: "center",
    opacity: 0.8,
  },
  deleteButton: {
    backgroundColor: "red",
    marginTop: 20,
    padding: 15,
    borderRadius: 25,
    width: 140,
    alignItems: "center",
    opacity: 0.8,
  },
  selectedImage: {
    width: 280,
    height: 280,
    resizeMode: "cover",
    borderRadius: 10,
    marginVertical: 20,
  },
  submitButton: {
    backgroundColor: "#FFA500",
    marginTop: 20,
    padding: 15,
    borderRadius: 25,
    width: 280,
    alignItems: "center",
    opacity: 0.8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  additionalInput: {
    fontSize: 16,
    height: 50,
    padding: 10,
    borderBottomWidth: 2,
    borderColor: "#ccc",
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  pickerLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});

export default Report;
