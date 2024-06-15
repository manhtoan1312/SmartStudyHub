import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Vibration, Platform } from "react-native";
import { Accelerometer } from "expo-sensors";

const FlipDetectionComponent = ({ isFlipPhone, isPause, workMode, stopPo }) => {
  const [alertShown, setAlertShown] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [countdownInterval, setCountdownInterval] = useState(null);

  useEffect(() => {
    let accelerometerSubscription;

    const handleFlipCheck = () => {
      accelerometerSubscription = Accelerometer.addListener(({ x, y, z }) => {
        if (z > 0.8) {
          handleFlipDetected();
        } else {
          if (!alertShown) {
            startCountdown();
          }
        }
      });
    };

    const handleFlipDetected = () => {
      if (alertShown) {
        setCountdown(10);
        clearInterval(countdownInterval);
        cancelVibration();
        setAlertShown(false);
      }
    };

    const startCountdown = () => {
      setAlertShown(true);
      setCountdown(10);
      const interval = setInterval(() => {
        startVibration();
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            cancelVibration();
            handleFlipNotDetected();
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
      setCountdownInterval(interval);
    };

    const handleFlipNotDetected = () => {
      setCountdown(10);
      setAlertShown(false);
      cancelVibration();
      clearInterval(countdownInterval);
      stopPo();
    };

    const startVibration = () => {
      if (Platform.OS === "ios") {
        Vibration.vibrate();
      } else {
        Vibration.vibrate([500, 500, 500], true);
      }
    };

    const cancelVibration = () => {
      Vibration.cancel();
    };

    if (isFlipPhone && !isPause && workMode === "work") {
      handleFlipCheck();
    } else {
      cancelVibration();
      if (alertShown) {
        setCountdown(10);
        setAlertShown(false);
        clearInterval(countdownInterval);
      }
    }

    return () => {
      if (accelerometerSubscription) {
        accelerometerSubscription.remove();
      }
    };
  }, [isFlipPhone, isPause, workMode, alertShown, stopPo]);

  return (
    <View style={styles.container}>
      {alertShown && (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            You don't put your phone face down, the pomodoro will be canceled
            after {countdown}s.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  messageBox: {
    position: "absolute",
    bottom: 80,
    left: 10,
    right: 10,
    backgroundColor: "#ccc",
    opacity: 0.8,
    padding: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  messageText: {
    color: "black",
    fontSize: 16,
  },
});

export default FlipDetectionComponent;
