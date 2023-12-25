import React, { useState } from "react";
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

const Report = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [typeReport, setTypeReport] = useState("REPORTPROBLEM");

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
          setSelectedImage(result.assets[0].uri);
          setFile({
            uri: result.assets[0].uri,
            name: `${result.assets[0].fileName}`,
            type: "image/png",
          });
          
        }
      }
    } catch (error) {
      console.error("Image library launch error:", error);
    }
  };

  const handleSubmitReport = async () => {
    if (!email || !phoneNumber || !title || !content || !typeReport) {
      Alert.alert("Incomplete Form", "Please fill in all required fields.");
      return;
    }

    const id = await AsyncStorage.getItem("id");
    if(file){
        const response = await UploadReportFile(file, id);
    if (response.success) {
      const rs = await CreateReport(
        id,
        email,
        phoneNumber,
        title,
        content,
        typeReport,
        response.data
      );
      if (rs.success) {
        Alert.alert("Success", "send report successfully!!");
      } else {
        Alert.alert("Error", "send report Fail!!");
      }
    }
    }
    else{
      const rs = await CreateReport(
        id,
        email,
        phoneNumber,
        title,
        content,
        typeReport,
        null
      );
      if (rs.success) {
        Alert.alert("Success", "send report successfully!!");
      } else {
        Alert.alert("Error", "send report Fail!!");
      }
    }
    setSelectedImage(null);
    setEmail("");
    setPhoneNumber("");
    setTitle("");
    setContent("");
    setTypeReport("REPORTPROBLEM");
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="angle-left" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Feed Back And Report</Text>
        </View>
        <Text style={styles.subTitle}>Submit Report</Text>

        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
          style={styles.additionalInput}
        />
        <View style={styles.inputContainer}>
        <TextInput
          placeholder="Content"
          multiline
          numberOfLines={6}
          value={content}
          onChangeText={(text) => setContent(text)}
          style={styles.input}
        />
        </View>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.additionalInput}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          style={styles.additionalInput}
          keyboardType="numeric"
        />

        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Select Type of Report: </Text>
          <PickerSelect
            value={typeReport}
            onValueChange={(value) => setTypeReport(value)}
            items={[
              { label: "Help", value: "HELP" },
              { label: "Report Problem", value: "REPORTPROBLEM" },
              { label: "Report User", value: "REPORTUSER" },
              { label: "Feedback", value: "FEEDBACK" },
            ]}
            style={styles.picker}
          />
        </View>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        )}
        <TouchableOpacity
          style={styles.imageButton}
          onPress={handleChooseImage}
        >
          <Text style={styles.buttonText}>Choose Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitReport}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 200,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  content: {
    flex: 5,
    paddingHorizontal: 60,
    paddingTop: 100,
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
    borderWidth: 2,
    paddingBottom: 10,
    marginBottom: 20,
    borderColor: "#ccc",
    borderRadius: 15,
  },
  input: {
    fontSize: 16,
    height: 80,
    padding: 10,
  },
  imageButton: {
    backgroundColor: "#FFA500",
    marginTop: 20,
    padding: 15,
    borderRadius: 25,
    width: 300,
    alignItems: "center",
  },
  selectedImage: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginVertical: 20,
  },
  submitButton: {
    backgroundColor: "#FFA500",
    marginTop: 20,
    padding: 15,
    borderRadius: 25,
    width: 300,
    alignItems: "center",
    opacity: 0.8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  additionalInput: {
    borderWidth: 2,
    paddingBottom: 10,
    marginBottom: 20,
    borderColor: "#ccc",
    borderRadius: 15,
    fontSize: 16,
    height: 50,
    padding: 10,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
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
