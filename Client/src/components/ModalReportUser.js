import React from 'react';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Modal, View, Text, Pressable, ScrollView, StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const ModalReportUser = ({ visible, id, onClose, onSubmit }) => {
  const option = [
    "Hateful language",
    "Sexual messages",
    "Violence",
    "Harassment",
    "Unauthorized sales",
    "Impersonation of another",
    "Fraud or deception",
    "Fake accounts",
    "Fake names",
    "I can not access my account",
    "Other issues",
  ];

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <Pressable style={styles.modalBackground} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Report User</Text>
            <Pressable onPress={onClose}>
              <AntDesign name="close" size={24} color="#333" />
            </Pressable>
          </View>
          <View style={styles.body}>
            <Text style={styles.title}>Please select the issue to continue</Text>
            <Text style={styles.subtitle}>You can report the user after selecting the report issue.</Text>
          </View>
          <ScrollView style={styles.scrollView}>
            {option.map((item, index) => (
              <Pressable
                key={index}
                style={styles.option}
                onPress={() => onSubmit(item)}
              >
                <Text style={styles.optionText}>{item}</Text>
                <MaterialIcons name="navigate-next" size={24} color="black" />
              </Pressable>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    height: height * 0.67,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'space-between',
    paddingBottom:40,
    width:'100%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    marginVertical: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  scrollView: {
    marginVertical: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
});

export default ModalReportUser;
