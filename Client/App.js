import React, { useEffect, useState, useRef } from 'react';
import { Alert, Platform, StyleSheet, View, Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Provider } from 'react-redux';
import { registerRootComponent } from 'expo';
import MainPage from './src/pages/MainPage';
import store from './src/stores';
// Configure the notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      console.log('Expo Push Token:', token);
      setExpoPushToken(token);
    });

    const getToken = async () => {
      const token = (await Notifications.getDevicePushTokenAsync()).data;
      console.log('token:',token)
    }
    getToken()


    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user interacts with a notification (taps it)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <Provider store={store}>
      <MainPage />
      {notification && (
        <View style={styles.notificationContainer}>
          <Text>Notification Received:</Text>
          <Text>{JSON.stringify(notification.request.content)}</Text>
        </View>
      )}
    </Provider>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  if (!Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    margin: 20,
  },
});

export default App;

registerRootComponent(App);
