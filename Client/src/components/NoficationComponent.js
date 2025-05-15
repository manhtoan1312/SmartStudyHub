import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const NotificationComponent = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let interval;

    // Đếm ngược và cập nhật giá trị countdown
    interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Clear interval khi component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Do not leave the application while the clock is running.
      </Text>
      <Text style={styles.text}>
        The clock will be reset after {countdown} seconds.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "red", // Màu nền của thông báo
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white", // Màu chữ
    fontSize: 16,
  },
});

export default NotificationComponent;
