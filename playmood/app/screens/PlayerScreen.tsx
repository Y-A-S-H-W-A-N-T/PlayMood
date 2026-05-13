import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import TrackPlayer, {
  useProgress,
  usePlaybackState,
  State,
} from 'react-native-track-player';

import Slider from '@react-native-community/slider';
import Ionicons from '@expo/vector-icons/Ionicons';
import { usePlayerStore } from '../store/playerStore';
import PlaylistModal from '../components/PlaylistModal';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';

export default function PlayerScreen() {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    queue,
    currentIndex,
    setCurrentSong,
    setCurrentIndex,
  } = usePlayerStore();

  const { position, duration } = useProgress(250);
  const playbackState = usePlaybackState();
  const [playlistModalVisible, setPlaylistModalVisible] =
  React.useState(false);
  const navigation = useNavigation<any>();

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayback = async () => {
    try {
      if (playbackState.state === State.Playing) {
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

  const playSong = async (song: any, index: number) => {
    await TrackPlayer.reset();

    await TrackPlayer.add({
      id: song.id,
      url: song.uri,
      title: song.title,
      artist: 'Downloaded Song',
    });

    await TrackPlayer.play();

    setCurrentSong(song);
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const playNext = async () => {
    if (currentIndex >= queue.length - 1) return;
    await playSong(queue[currentIndex + 1], currentIndex + 1);
  };

  const playPrevious = async () => {
    if (currentIndex <= 0) return;
    await playSong(queue[currentIndex - 1], currentIndex - 1);
  };

  const skipForward = async () => {
    try {
      const newPosition = Math.min(position + 5, duration);
      await TrackPlayer.seekTo(newPosition);
    } catch (err) {
      console.log(err);
    }
  };

  const skipBackward = async () => {
    try {
      const newPosition = Math.max(position - 5, 0);
      await TrackPlayer.seekTo(newPosition);
    } catch (err) {
      console.log(err);
    }
  };

  if (!currentSong) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#0d0d0d',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white' }}>No song selected</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#0d0d0d',
      }}
    >
        
      <View
        style={{
          flex: 1,
          padding: 20,
          justifyContent: 'center',
        }}
      >
        <View
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  }}
>
  <View />
  <View
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
    marginTop: 50
  }}
>
  {/* PLUS ICON - TOP LEFT */}
  <TouchableOpacity
    onPress={() => setPlaylistModalVisible(true)}
  >
    <Ionicons
      name="add-circle-outline"
      size={30}
      color="white"
    />
  </TouchableOpacity>

  {/* CLOSE ICON - TOP RIGHT */}
  <TouchableOpacity onPress={() => navigation.goBack()}
    style={{
      marginLeft: '80%',
    }}
    >
    <Ionicons
      name="close"
      size={30}
      color="white"
    />
  </TouchableOpacity>
</View>
</View>
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 220,
              height: 220,
              borderRadius: 20,
              backgroundColor: '#1c1c1c',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
  source={{ uri: currentSong.thumbnail }}
  style={{
    width: 260,
    height: 260,
    borderRadius: 20,
    alignSelf: 'center',
  }}
/>
          </View>

          <Text
            style={{
              color: 'white',
              fontSize: 22,
              fontWeight: '700',
              marginTop: 30,
              textAlign: 'center',
            }}
          >
            {currentSong.title}
          </Text>
        </View>
        <Text
  style={{
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 16,
  }}
>
  {currentSong.uploader}
</Text>

        {/* SLIDER */}
        <View
          style={{
            marginTop: 10,
            paddingHorizontal: 10,
          }}
        >
          <Slider
            minimumValue={0}
            maximumValue={duration || 1}
            value={position}
            onSlidingComplete={(value) => {
              TrackPlayer.seekTo(value);
            }}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="#444"
            thumbTintColor="#ffffff"
            style={{
              width: '100%',
              height: 50,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 6,
            }}
          >
            <Text style={{ color: '#aaa' }}>
              {formatTime(position)}
            </Text>

            <Text style={{ color: '#aaa' }}>
              {formatTime(duration)}
            </Text>
          </View>
        </View>

        {/* +5 / -5 Buttons */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={skipBackward}
            style={{
              backgroundColor: '#1f1f1f',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 12,
              marginRight: 15,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              -5 sec
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={skipForward}
            style={{
              backgroundColor: '#1f1f1f',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              +5 sec
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONTROLS */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}
        >
          <TouchableOpacity onPress={playPrevious}>
            <Ionicons
              name="play-skip-back"
              size={50}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={togglePlayback}
            style={{ marginHorizontal: 30 }}
          >
            <Ionicons
              name={
                playbackState.state === State.Playing
                  ? 'pause-circle'
                  : 'play-circle'
              }
              size={90}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={playNext}>
            <Ionicons
              name="play-skip-forward"
              size={50}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
      <PlaylistModal
  visible={playlistModalVisible}
  onClose={() => setPlaylistModalVisible(false)}
  song={currentSong}
/>
    </SafeAreaView>
  );
}