import "@/styles/global.css";

import { useSetupTrackPlayer } from "@/hooks/use-setup-track-player";
import playbackService from "@/utils/playback.service";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";

TrackPlayer.registerPlaybackService(() => playbackService);

export default function RootLayout() {
  useSetupTrackPlayer();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#FFD369",
            tabBarStyle: {
              backgroundColor: "#222831",
              borderTopColor: "#FFFFFF33",
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color, size }) => (
                <Entypo name="home" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="music"
            options={{
              title: "Music",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="music-box"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </Tabs>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
