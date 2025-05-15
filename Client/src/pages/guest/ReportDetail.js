import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { GetReportDetail } from "../../services/Guest/ReportService";

const ReportDetail = ({ route, navigation }) => {
  const { id } = route.params;

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
    typeReport: null,
    urlFile: null,
  });

  const [titleText, setTitleText] = useState("What do you need assistance?");

  useEffect(() => {
    let text;
    if (report.typeReport === "HELP") {
      text = "What do you need assistance?";
    } else if (report.typeReport === "REPORTPROBLEM") {
      text = "What is the problem you encountered?";
    } else {
      text = "Title:";
    }
    setTitleText(text);
  }, [report.typeReport]);

  const fetchData = async () => {
    const response = await GetReportDetail(id);
    if (response.success) {
      setReport(response.data);
    } else {
      Alert.alert("Error", response.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderTextItem = (label, value) => (
    <View style={styles.textItemContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

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

        <ScrollView style={{ height: 300, paddingTop: 20 }}>
          {renderTextItem("Status:", String(report.statusReport).toLowerCase())}
          {renderTextItem("Email:", report.email)}
          {renderTextItem("Phone Number:", report.phoneNumber)}
          {renderTextItem(titleText, report.title)}

          <View style={styles.inputContainer}>
            {report.typeReport === "HELP" && (
              <View>
                {renderTextItem("Problem details:", report.descriptionDetail)}
                {renderTextItem("What help do you need?", report.whatHelp)}
              </View>
            )}
            {report.typeReport === "REPORTPROBLEM" && (
              <View>
                {renderTextItem(
                  "Where did the problem occur?:",
                  report.whereProblemOccur
                )}
                {renderTextItem(
                  "Process error occurred:",
                  report.descriptionDetail
                )}
                {renderTextItem(
                  "How did the problem affect you?",
                  report.howProblemAffect
                )}
              </View>
            )}
            {report.typeReport === "FEEDBACK" && (
              <View>
                {renderTextItem(
                  "What thing most satisfies you?:",
                  report.thingMostSatisfy
                )}
                {renderTextItem(
                  "What thing needs improvement?:",
                  report.thingToImprove
                )}
                {renderTextItem(
                  "Describe your feelings",
                  report.descriptionDetail
                )}
              </View>
            )}
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>
              Type of Report: {report.typeReport}
            </Text>
          </View>
          {report?.urlFile && (
            <Image
              source={{ uri: report?.urlFile }}
              style={styles.selectedImage}
            />
          )}
        </ScrollView>
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
  textItemContainer: {
    marginBottom: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    color: "#999",
  },
  value: {
    fontSize: 16,
    color: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
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
  selectedImage: {
    width: 280,
    height: 280,
    resizeMode: "cover",
    borderRadius: 10,
    marginVertical: 20,
  },
});

export default ReportDetail;
