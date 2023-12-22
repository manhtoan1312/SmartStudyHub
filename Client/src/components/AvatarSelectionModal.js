import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const AvatarSelectionModal = ({ isVisible, onClose, onSelectImage }) => {
  const handleSelectCamera = () => {
    launchCamera({ mediaType: 'photo' }, handleImageSelection);
  };

  const handleSelectGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, handleImageSelection);
  };

  const handleImageSelection = (response) => {
    if (response.didCancel || response.error) {
      console.log('Image selection cancelled or error:', response.error);
    } else {
      // Pass the selected image URI to the parent component
      onSelectImage(response.uri);
    }

    // Close the modal
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 15,
    marginTop: 10,
  },
  cancelText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
  },
});

export default AvatarSelectionModal;
