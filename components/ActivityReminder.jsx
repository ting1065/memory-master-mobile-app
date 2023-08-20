import { View, Text } from 'react-native'
import React from 'react'
import * as Notifications from "expo-notifications";
import PressableButton from './PressableButton';

export default function ActivityReminder({ activityTitle, organizerName, activityId, triggerSeconds }) {

  async function verifyPermission() {
    const permissionInfo = await Notifications.getPermissionsAsync();
    if (permissionInfo.granted === true) {
      return true;
    } else {
      const response = await Notifications.requestPermissionsAsync();
      return response.granted;
    }
  }

  const notificationHandler = async () => {
    const hasPermission = await verifyPermission();
    if (!hasPermission) {
      Alert.alert("You need to give access to notifications");
      return;
    } else {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Incoming Activity Reminder",
            body: `on-site activity '${activityTitle}' organized by '${organizerName}' is about to start.`,
            data: { activityId: activityId},
          },
          trigger: { seconds: triggerSeconds },
        });
      } catch (err) {
        console.log("error while scheduling notification", err);
      }
    }
  };


  return (
    <View>
      <PressableButton onPress={notificationHandler}>
        <Text>{'<'}Remind Me{'>'}</Text>
      </PressableButton>
    </View>
  )
}