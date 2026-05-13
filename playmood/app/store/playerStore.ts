import { create } from 'zustand';

type Song = {
  uploader: string;
  thumbnail: string | undefined;
  id: string;
  title: string;
  uri: string;
};

type PlayerState = {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;

  setCurrentSong: (song: Song) => void;
  setQueue: (songs: Song[]) => void;
  setCurrentIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: 0,

  setCurrentSong: (song) =>
    set({
      currentSong: song,
      isPlaying: true,
    }),

  setQueue: (songs) =>
    set({
      queue: songs,
    }),

  setCurrentIndex: (index) =>
    set({
      currentIndex: index,
    }),

  setIsPlaying: (playing) =>
    set({
      isPlaying: playing,
    }),
}));