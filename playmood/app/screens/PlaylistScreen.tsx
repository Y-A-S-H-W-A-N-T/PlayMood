import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { getPlaylists, Playlist } from "../utils/playlistStorage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert } from "react-native";
import { deletePlaylist } from "../utils/playlistStorage";

export default function PlaylistScreen() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const navigation = useNavigation<any>();

  const loadPlaylists = async () => {
    const data = await getPlaylists();
    setPlaylists(data);
  };

  const handleDeletePlaylist = (playlist: Playlist) => {
    Alert.alert("Delete Playlist", `Delete "${playlist.name}" permanently?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deletePlaylist(playlist.id);
          loadPlaylists();
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      loadPlaylists();
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0d0d0d",
        paddingHorizontal: 16,
        paddingTop: 60,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 24,
          fontWeight: "700",
          marginBottom: 20,
        }}
      >
        Playlists
      </Text>

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PlaylistDetails", {
                playlist: item,
              })
            }
            style={{
              backgroundColor: "#1a1a1a",
              padding: 18,
              borderRadius: 18,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                {item.name}
              </Text>

              <Text
                style={{
                  color: "#888",
                  marginTop: 6,
                }}
              >
                {item.songs.length} songs
              </Text>
            </View>

            <TouchableOpacity onPress={() => handleDeletePlaylist(item)}>
              <Ionicons name="trash-outline" size={24} color="#ff4d4d" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
