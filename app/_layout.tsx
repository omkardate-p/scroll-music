import "@/styles/global.css";

import { useSetupTrackPlayer } from "@/hooks/use-setup-track-player";
import playbackService from "@/utils/playback.service";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";

TrackPlayer.registerPlaybackService(() => playbackService);

export default function RootLayout() {
  useSetupTrackPlayer();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
