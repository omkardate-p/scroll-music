import AsyncStorage from "@react-native-async-storage/async-storage";
import { RepeatMode } from "react-native-track-player";

const STORAGE_KEY = "last_played_track";

export async function savePlaybackState({
  id,
  position,
  repeatMode,
}: {
  id: string;
  position: number;
  repeatMode: RepeatMode;
}) {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ id, position, repeatMode }),
    );
  } catch (error) {
    console.error("Error saving playback state:", error);
  }
}

export async function getSavedPlaybackState(): Promise<{
  id: string;
  position: number;
  repeatMode: RepeatMode;
} | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading playback state:", error);
    return null;
  }
}
