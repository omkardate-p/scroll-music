import { Ionicons } from "@expo/vector-icons";
import { useEffect, useLayoutEffect, useState } from "react";
import { AppState, Image, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { formatDuration } from "@/utils/format-duration";
import {
  getSavedPlaybackState,
  savePlaybackState,
} from "@/utils/playback-storage";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackPlayer, {
  RepeatMode,
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import { scheduleOnRN } from "react-native-worklets";

export default function MusicPlayer() {
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);

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
    }
  };

  const previousTrack = async () => {
    try {
      await TrackPlayer.skipToPrevious();
      await TrackPlayer.play();
    } catch (error) {
      console.error("Error in previousTrack:", error);
    }
  };

  const onSlidingComplete = async (value: number) => {
    await TrackPlayer.seekTo(value);
  };

  const shuffleTracks = async () => {
    console.log("shuffleTracks");
  };

  const repeatTracks = async () => {
    const currentRepeatMode = await TrackPlayer.getRepeatMode();

    if (currentRepeatMode === RepeatMode.Off) {
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode(RepeatMode.Queue);
    } else if (currentRepeatMode === RepeatMode.Queue) {
      await TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode(RepeatMode.Track);
    } else {
      await TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode(RepeatMode.Off);
    }
  };

  // Swipe gesture: left/up = next, right/down = previous
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Only activate when horizontal movement exceeds 10px
    .activeOffsetY([-10, 10]) // Only activate when vertical movement exceeds 10px
    .onEnd((event) => {
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

  const restoreRepeatMode = async () => {
    const savedPlaybackState = await getSavedPlaybackState();
    if (!savedPlaybackState) return;

    try {
      await TrackPlayer.setRepeatMode(savedPlaybackState.repeatMode);
      setRepeatMode(savedPlaybackState.repeatMode);
    } catch (error) {
      console.error("Error restoring repeat mode:", error);
    }
  };

  useLayoutEffect(() => {
    restoreRepeatMode();
  }, []);

  // Save progress when app is backgrounded
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "background" && activeTrack) {
        savePlaybackState({
          id: activeTrack.id,
          position: progress.position,
          repeatMode,
        });
      }
    });

    if (playBackState.state === State.Playing && activeTrack) {
      savePlaybackState({
        id: activeTrack.id,
        position: progress.position,
        repeatMode,
      });
    }

    return () => {
      sub.remove();
    };
  }, [activeTrack, progress.position]);

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
                {formatDuration(progress.position)}
              </Text>
              <Text className="text-xs font-medium text-[#FFFFFFCC]">
                {formatDuration(progress.duration)}
              </Text>
            </View>
          </View>

          {/* Playback controls */}
          <View className="w-full flex-row items-center justify-center gap-4 px-5">
            {/* Shuffle tracks */}
            <TouchableOpacity
              onPress={shuffleTracks}
              className="p-2"
              activeOpacity={0.7}
            >
              <Ionicons name="shuffle" size={36} color="#FFD369" />
            </TouchableOpacity>

            {/* Previous track */}
            <TouchableOpacity
              onPress={previousTrack}
              className="p-2"
              activeOpacity={0.7}
            >
              <Ionicons name="play-back" size={36} color="#FFD369" />
            </TouchableOpacity>

            {/* Play/pause */}
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
                size={72}
                color="#FFD369"
              />
            </TouchableOpacity>

            {/* Next track */}
            <TouchableOpacity
              onPress={nextTrack}
              className="p-2"
              activeOpacity={0.7}
            >
              <Ionicons name="play-forward" size={36} color="#FFD369" />
            </TouchableOpacity>

            {/* Repeat tracks */}
            <TouchableOpacity
              onPress={repeatTracks}
              className="p-2"
              activeOpacity={0.7}
            >
              {repeatMode === RepeatMode.Track ? (
                <View className="relative items-center justify-center">
                  <Ionicons name="repeat" size={36} color="#FFD369" />
                  <Text className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-[#FFD369]">
                    1
                  </Text>
                </View>
              ) : (
                <Ionicons
                  name="repeat"
                  size={36}
                  color={
                    repeatMode === RepeatMode.Queue ? "#FFD369" : "#FFFFFF4D"
                  }
                />
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
}
