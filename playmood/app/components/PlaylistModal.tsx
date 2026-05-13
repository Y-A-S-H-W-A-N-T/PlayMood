import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import {
  getPlaylists,
  createPlaylist,
  addSongToPlaylists,
  getSelectedPlaylistsForSong,
  Playlist,
  Song,
} from '../utils/playlistStorage';

type Props = {
  visible: boolean;
  onClose: () => void;
  song: Song | null;
};

export default function PlaylistModal({
  visible,
  onClose,
  song,
}: Props) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  const loadData = async () => {
    const data = await getPlaylists();
    setPlaylists(data);

    if (song) {
      const existing =
        await getSelectedPlaylistsForSong(song.id);
      setSelected(existing);
    }
  };

  useEffect(() => {
    if (visible) {
      loadData();
      setShowCreate(false);
      setPlaylistName('');
    }
  }, [visible]);

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleCreate = async () => {
    if (!playlistName.trim() || !song) return;

    await createPlaylist(playlistName, song);
    await loadData();

    setPlaylistName('');
    setShowCreate(false);
  };

  const handleSave = async () => {
    if (!song) return;

    await addSongToPlaylists(selected, song);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={() => {}}
          style={{
            height: '80%',
            backgroundColor: '#121212',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20,
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
            <Text
              style={{
                color: 'white',
                fontSize: 22,
                fontWeight: '700',
              }}
            >
              Add to Playlist
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={28}
                color="white"
              />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {playlists.map((playlist) => {
              const isSelected = selected.includes(
                playlist.id
              );

              return (
                <TouchableOpacity
                  key={playlist.id}
                  onPress={() => toggleSelect(playlist.id)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#222',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                    }}
                  >
                    {playlist.name}
                  </Text>

                  <Ionicons
                    name={
                      isSelected
                        ? 'checkmark-circle'
                        : 'ellipse-outline'
                    }
                    size={24}
                    color={
                      isSelected ? '#1DB954' : '#777'
                    }
                  />
                </TouchableOpacity>
              );
            })}

            {!showCreate ? (
              <TouchableOpacity
                onPress={() => setShowCreate(true)}
                style={{ marginTop: 20 }}
              >
                <Text
                  style={{
                    color: '#1DB954',
                    fontSize: 16,
                    fontWeight: '600',
                  }}
                >
                  + Create New Playlist
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ marginTop: 20 }}>
                <TextInput
                  placeholder="Playlist name"
                  placeholderTextColor="#777"
                  value={playlistName}
                  onChangeText={setPlaylistName}
                  style={{
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                    padding: 14,
                    borderRadius: 14,
                  }}
                />

                <TouchableOpacity
                  onPress={handleCreate}
                  style={{
                    marginTop: 12,
                    backgroundColor: '#1DB954',
                    padding: 14,
                    borderRadius: 14,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '700',
                    }}
                  >
                    Create & Save
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: '#1DB954',
              padding: 16,
              borderRadius: 16,
              alignItems: 'center',
              marginTop: 15,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontWeight: '700',
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}