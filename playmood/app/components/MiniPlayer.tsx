import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import TrackPlayer from 'react-native-track-player';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { usePlayerStore } from '../store/playerStore';

export default function MiniPlayer() {
  const navigation = useNavigation<any>();

  const {
    currentSong,
    isPlaying,
    setIsPlaying,
  } = usePlayerStore();

  if (!currentSong) return null;

  const togglePlayback = async () => {
    try {
      if (isPlaying) {
        await TrackPlayer.pause();
        setIsPlaying(false);
      } else {
        await TrackPlayer.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom:20,
        left: 12,
        right: 12,
        zIndex: 999,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Player')}
        style={{
          backgroundColor: '#1c1c1c',
          borderRadius: 16,
          padding: 12,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Image
          source={{ uri: currentSong.thumbnail }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            marginRight: 12,
          }}
        />

        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              color: 'white',
              fontWeight: '600',
              fontSize: 15,
            }}
          >
            {currentSong.title}
          </Text>

          <Text
            numberOfLines={1}
            style={{
              color: '#888',
              fontSize: 12,
              marginTop: 2,
            }}
          >
            {currentSong.uploader}
          </Text>
        </View>

        <TouchableOpacity onPress={togglePlayback}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={26}
            color="white"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}