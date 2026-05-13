import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PlaylistDetailsScreen from "../screens/PlaylistDetailsScreen";

import TabNavigator from "./TabNavigator";
import PlayerScreen from "../screens/PlayerScreen";

export type RootStackParamList = {
  Tabs: undefined;
  Player: undefined;
  PlaylistDetails: { playlist: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="Player" component={PlayerScreen} />
        <Stack.Screen
          name="PlaylistDetails"
          component={PlaylistDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
