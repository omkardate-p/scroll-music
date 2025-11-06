import "@/styles/global.css";

import { useSetupTrackPlayer } from "@/hooks/use-setup-track-player";
import playbackService from "@/utils/playback.service";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";

TrackPlayer.registerPlaybackService(() => playbackService);

export default function RootLayout() {
  useSetupTrackPlayer();

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
