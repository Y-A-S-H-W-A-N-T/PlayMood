import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as FileSystem from "expo-file-system";
import { addDownloadedSong } from "../utils/songStorage";

type Song = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  uploader: string;
  duration: number;
};

export default function MusicSearchScreen() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [downloadingSongUrl, setDownloadingSongUrl] = useState<string | null>(
    null
  );

  const folderPath = FileSystem.documentDirectory + "playmoods/";

  const formatDuration = (seconds: number) => {
    if (!seconds) return "--";

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const searchSongs = async () => {
    if (!query.trim()) {
      Alert.alert("Enter a song name");
      return;
    }

    try {
      setSearchLoading(true);

      console.log("Searching:", query);

      const res = await fetch(
        `http://192.168.0.7:8000/search?q=${encodeURIComponent(query)}`
      );

      const data = await res.json();

      console.log("Search results:", data);

      setSongs(data);
    } catch (error) {
      console.log("Search error:", error);
      Alert.alert("Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  const downloadSong = async (song: Song) => {
    try {
      setDownloadingSongUrl(song.url);

      console.log("=== DOWNLOAD START ===");
      console.log("Downloading song:", song);

      const dirInfo = await FileSystem.getInfoAsync(folderPath);

      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(folderPath, {
          intermediates: true,
        });
      }

      const prepRes = await fetch(
        `http://192.168.0.7:8000/prepare-download?url=${encodeURIComponent(
          song.url
        )}`
      );

      const prepData = await prepRes.json();

      console.log("Prepared backend file:", prepData);

      const safeName =
        song.title.replace(/[^a-zA-Z0-9]/g, "_") +
        "_" +
        Date.now();

      const fileName = `${safeName}.m4a`;
      const filePath = folderPath + fileName;

      console.log("Saving to:", filePath);

      const result = await FileSystem.downloadAsync(
        `http://192.168.0.7:8000/get-file?file=${prepData.file}`,
        filePath
      );

      console.log("Download result:", result);

      await addDownloadedSong({
        id: song.id + "_" + Date.now(),
        title: song.title,
        uploader: song.uploader,
        duration: song.duration,
        thumbnail: song.thumbnail,
        uri: result.uri,
      });

      console.log("Metadata saved");

      Alert.alert("Downloaded successfully");
    } catch (error) {
      console.log("Download error:", error);
      Alert.alert("Download failed");
    } finally {
      setDownloadingSongUrl(null);
    }
  };

  const renderSong = ({ item }: { item: Song }) => {
    const isDownloading = downloadingSongUrl === item.url;

    return (
      <View
        style={{
          flexDirection: "row",
          padding: 12,
          backgroundColor: "#1a1a1a",
          borderRadius: 16,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={{
            width: 70,
            height: 70,
            borderRadius: 12,
          }}
        />

        <View
          style={{
            flex: 1,
            marginLeft: 12,
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              color: "white",
              fontWeight: "700",
              fontSize: 15,
            }}
          >
            {item.title}
          </Text>

          <Text
            numberOfLines={1}
            style={{
              color: "#b3b3b3",
              marginTop: 4,
            }}
          >
            {item.uploader}
          </Text>

          <Text
            style={{
              color: "#777",
              marginTop: 4,
            }}
          >
            {formatDuration(item.duration)}
          </Text>
        </View>

        {isDownloading ? (
          <ActivityIndicator color="white" />
        ) : (
          <TouchableOpacity
            onPress={() => downloadSong(item)}
            style={{
              padding: 10,
            }}
          >
            <Ionicons name="download" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0d0d0d",
        paddingHorizontal: 16,
        paddingTop: 60,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search songs..."
          placeholderTextColor="#777"
          style={{
            flex: 1,
            backgroundColor: "#1f1f1f",
            color: "white",
            paddingHorizontal: 16,
            borderRadius: 16,
            height: 54,
            fontSize: 16,
          }}
        />

        <TouchableOpacity
          onPress={searchSongs}
          style={{
            marginLeft: 10,
            width: 54,
            height: 54,
            borderRadius: 16,
            backgroundColor: "#2c2c2c",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {searchLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Ionicons name="search" size={22} color="white" />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={renderSong}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}