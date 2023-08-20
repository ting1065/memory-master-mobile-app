import { FlatList, StyleSheet } from "react-native";
import React from "react";
import ActivityInList from "./ActivityInList";

export default function ActivityList({
  activities,
  players,
  editHandler,
  deleteHandler,
  joinHandler,
  leaveHandler,
}) {
  return (
    <FlatList
      data={activities}
      renderItem={({ item }) => (
        <ActivityInList
          activity={item}
          players={players}
          editHandler={editHandler}
          deleteHandler={deleteHandler}
          joinHandler={joinHandler}
          leaveHandler={leaveHandler}
        />
      )}
    />
  );
}