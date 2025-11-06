import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import { scheduleOnRN } from "react-native-worklets";

export default function MusicPlayer() {
  const progress = useProgress();
  const playBackState = usePlaybackState();
  const activeTrack = useActiveTrack();

  const togglePlayBack = async () => {
    if (playBackState.state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const nextTrack = async () => {
    try {
      await TrackPlayer.skipToNext();
      await TrackPlayer.play();
    } catch (error) {
      console.error("Error in nextTrack:", error);
      // Silently fail if there's no next track
    }
  };

  const previousTrack = async () => {
    try {
      await TrackPlayer.skipToPrevious();
      await TrackPlayer.play();
    } catch (error) {
      console.error("Error in previousTrack:", error);
      // Silently fail if there's no previous track
    }
  };

  // Swipe gesture: left/up = next, right/down = previous
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Only activate when horizontal movement exceeds 10px
    .activeOffsetY([-10, 10]) // Only activate when vertical movement exceeds 10px
    .onEnd((event) => {
      // check what is this, and why callback only work when it is in worklet, with `scheduleOnRN`
      "worklet";

      const SWIPE_THRESHOLD = 100; // Minimum swipe distance

      // Determine primary direction (whichever has greater magnitude)
      const absX = Math.abs(event.translationX);
      const absY = Math.abs(event.translationY);

      if (absX > absY) {
        // Horizontal swipe takes priority
        if (event.translationX < -SWIPE_THRESHOLD) {
          // Swipe left = next track
          scheduleOnRN(nextTrack);
        } else if (event.translationX > SWIPE_THRESHOLD) {
          // Swipe right = previous track
          scheduleOnRN(previousTrack);
        }
      } else {
        // Vertical swipe takes priority
        if (event.translationY < -SWIPE_THRESHOLD) {
          // Swipe up = next track
          scheduleOnRN(nextTrack);
        } else if (event.translationY > SWIPE_THRESHOLD) {
          // Swipe down = previous track
          scheduleOnRN(previousTrack);
        }
      }
    });

  const onSlidingComplete = async (value: number) => {
    await TrackPlayer.seekTo(value);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#222831]">
      <GestureDetector gesture={swipeGesture}>
        <Animated.View className="flex-1 items-center justify-between px-6 pb-10 pt-10">
          <View className="w-full flex-1 items-center justify-center pt-5">
            <Image
              source={
                activeTrack?.artwork
                  ? { uri: activeTrack.artwork }
                  : require("@/assets/images/icon.png")
              }
              className="mb-8 h-[280] w-[280] rounded-[20px] border-2 border-[#FFFFFF33] shadow-lg"
            />
            <Text
              className="mb-2 w-full px-5 text-center text-[22px] font-bold text-white"
              numberOfLines={1}
            >
              {activeTrack?.title ?? "No track selected"}
            </Text>
            <Text
              className="w-full px-5 text-center text-base font-normal text-[#FFFFFFB3]"
              numberOfLines={1}
            >
              {activeTrack?.preset ?? "—"}
            </Text>
          </View>

          <View className="my-8 w-full px-2">
            <Slider
              className="h-10 w-full"
              value={progress.position}
              minimumValue={0}
              maximumValue={progress.duration}
              thumbTintColor="#FFD369"
              minimumTrackTintColor="#FFD369"
              maximumTrackTintColor="#FFFFFF4D"
              onSlidingComplete={onSlidingComplete}
            />

            <View className="mt-2 w-full flex-row justify-between px-1">
              <Text className="text-xs font-medium text-[#FFFFFFCC]">
                {new Date(progress.position * 1000)
                  .toLocaleTimeString()
                  .substring(3)}
              </Text>
              <Text className="text-xs font-medium text-[#FFFFFFCC]">
                {new Date((progress.duration - progress.position) * 1000)
                  .toLocaleTimeString()
                  .substring(3)}
              </Text>
            </View>
          </View>

          <View className="w-full flex-row items-center justify-center gap-10 px-5">
            <TouchableOpacity
              onPress={previousTrack}
              className="p-2"
              activeOpacity={0.7}
            >
              <Ionicons name="play-back" size={35} color="#FFD369" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={togglePlayBack}
              className="p-2"
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  playBackState.state === State.Playing
                    ? "pause-circle"
                    : "play-circle"
                }
                size={75}
                color="#FFD369"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={nextTrack}
              className="p-2"
              activeOpacity={0.7}
            >
              <Ionicons name="play-forward" size={35} color="#FFD369" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
}
