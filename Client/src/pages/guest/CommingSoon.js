import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ComingSoonScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Nút Back */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#FFA500" />
      </TouchableOpacity>

      <ImageBackground
        source={require('../../images/coming_soon.jpg')}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: '#FFA500' }]}>Coming Soon</Text>
          <Text style={[styles.subtitle, { color: '#FFA500' }]}>
            Exciting updates are on the way!
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.homeButton, { color: '#3498db' }]}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFA500',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  homeButton: {
    fontSize: 18,
    textDecorationLine: 'underline',
  },
});

export default ComingSoonScreen;
