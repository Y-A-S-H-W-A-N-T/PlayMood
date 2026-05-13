// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   FlatList,
//   Image,
//   TextInput,
//   ActivityIndicator
// } from 'react-native';
// import * as FileSystem from 'expo-file-system';
// import TrackPlayer from 'react-native-track-player';

// export default function App() {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState<any[]>([]);
//   const [songs, setSongs] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   const folderPath = FileSystem.documentDirectory + "playmoods/";

//   useEffect(() => {
//     setupPlayer();
//     loadSongs();
//   }, []);

//   const setupPlayer = async () => {
//     await TrackPlayer.setupPlayer();
//   };

//   const loadSongs = async () => {
//     const dirInfo = await FileSystem.getInfoAsync(folderPath);

//     if (!dirInfo.exists) {
//       await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
//       setSongs([]);
//       return;
//     }

//     const files = await FileSystem.readDirectoryAsync(folderPath);
//     setSongs(files);
//   };

//   // 🔍 SEARCH
//   const searchSongs = async () => {
//     try {
//       console.log("Searching for:", query);
//       setLoading(true);
//       const res = await fetch(`http://192.168.0.10:8000/search?q=${query}`);
//       const data = await res.json();
//       console.log("Search results:", data);
//       setResults(data);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ⬇️ DOWNLOAD FLOW (NO TIMEOUT)
//   const downloadSong = async (videoUrl: string) => {
//     try {
//       setLoading(true);

//       // STEP 1 → backend downloads
//       const prepRes = await fetch(
//         `http://192.168.0.10:8000/prepare-download?url=${encodeURIComponent(videoUrl)}`
//       );

//       const prepData = await prepRes.json();

//       // STEP 2 → frontend downloads file
//       const fileName = `song_${Date.now()}.m4a`;
//       const filePath = folderPath + fileName;

//       await FileSystem.downloadAsync(
//         `http://192.168.0.7:8000/get-file?file=${prepData.file}`,
//         filePath
//       );

//       loadSongs();
//       alert("Downloaded ✅");

//     } catch (err) {
//       console.log(err);
//       alert("Download failed ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const playSong = async (fileName: string) => {
//     const uri = folderPath + fileName;

//     await TrackPlayer.reset();
//     await TrackPlayer.add({
//       id: fileName,
//       url: uri,
//       title: fileName,
//     });

//     await TrackPlayer.play();
//   };

//   return (
//     <View style={{ flex: 1, padding: 15 }}>

//       {/* 🔍 SEARCH BAR */}
//       <TextInput
//         placeholder="Search songs..."
//         value={query}
//         onChangeText={setQuery}
//         style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
//       />

//       <Button title="Search" onPress={searchSongs} />

//       {loading && <ActivityIndicator size="large" />}

//       {/* 🔍 SEARCH RESULTS */}
//       <FlatList
//         data={results}
//         keyExtractor={(item) => item.url}
//         renderItem={({ item }) => (
//           <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            
//             <Image
//               source={{ uri: item.thumbnail }}
//               style={{ width: 60, height: 60 }}
//             />

//             <View style={{ flex: 1, marginLeft: 10 }}>
//               <Text>{item.title}</Text>
//               <Text>{item.uploader}</Text>
//             </View>

//             <Button title="Download" onPress={() => downloadSong(item.url)} />
//           </View>
//         )}
//       />

//       {/* 🎧 DOWNLOADED SONGS */}
//       <Text style={{ marginTop: 20, fontSize: 18 }}>Downloaded Songs</Text>

//       <FlatList
//         data={songs}
//         keyExtractor={(item) => item}
//         renderItem={({ item }) => (
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//             <Text>{item}</Text>
//             <Button title="Play" onPress={() => playSong(item)} />
//           </View>
//         )}
//       />

//     </View>
//   );
// }

import React from 'react';
import RootNavigator from './app/navigations/RootNavigator';

export default function App() {
  return <RootNavigator />;
}