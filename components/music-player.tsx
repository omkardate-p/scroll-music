import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";

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
    await TrackPlayer.skipToNext();
    await TrackPlayer.play();
  };

  const previousTrack = async () => {
    await TrackPlayer.skipToPrevious();
    await TrackPlayer.play();
  };

  const onSlidingComplete = async (value: number) => {
    await TrackPlayer.seekTo(value);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#222831]">
      <View className="flex-1 items-center justify-between px-6 pb-10 pt-10">
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
      </View>
    </SafeAreaView>
  );
}
