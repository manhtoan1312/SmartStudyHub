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
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const getToken = async () => {
      const token = (await Notifications.getDevicePushTokenAsync()).data;
      console.log('token:',token)
    }
    getToken()
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
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
