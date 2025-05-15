import React, { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';

const AvatarSelectionModal = ({ isVisible, onClose, onSelectImage }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied!');
      }
    })();
  }, []);

  const handleSelectCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setSelectedImage(result.uri);
        onSelectImage(result.uri);
      }
    } catch (error) {
      console.error('Camera launch error:', error);
    }

    onClose();
  };

  const handleSelectGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setSelectedImage(result.uri);
        onSelectImage(result.uri);
      }
    } catch (error) {
      console.error('Image library launch error:', error);
    }

    onClose();
  };

  return (
    <Modal transparent={true} animationType="slide" visible={isVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={handleSelectCamera} style={styles.optionButton}>
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSelectGallery} style={styles.optionButton}>
            <Text style={styles.optionText}>Choose from Library</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
  cancelButton: {
    paddingVertical: 15,
    marginTop: 10,
  },
  cancelText: {
    fontSize: 16,
    textAlign: "center",
    color: "red",
  },
});

export default AvatarSelectionModal;
