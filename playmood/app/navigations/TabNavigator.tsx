import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import MusicSearchScreen from '../screens/MusicSearchScreen';
import PlaylistScreen from '../screens/PlaylistScreen';
import DownloadedScreen from '../screens/DownloadedScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ size, color }) => {
          let iconName: any;

          if (route.name === 'Music Search') {
            iconName = 'search';
          } else if (route.name === 'Playlist') {
            iconName = 'list';
          } else if (route.name === 'Downloaded') {
            iconName = 'download';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Music Search" component={MusicSearchScreen} />
      <Tab.Screen name="Playlist" component={PlaylistScreen} />
      <Tab.Screen name="Downloaded" component={DownloadedScreen} />
    </Tab.Navigator>
  );
}