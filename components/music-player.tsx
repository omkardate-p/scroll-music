import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";

function MusicPlayer() {
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
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.songInfoContainer}>
          <Image
            source={
              activeTrack?.artwork
                ? { uri: activeTrack.artwork }
                : require("@/assets/images/icon.png")
            }
            style={styles.imageWrapper}
          />
          <Text style={styles.songTitle} numberOfLines={1}>
            {activeTrack?.title ?? "No track selected"}
          </Text>
          <Text style={styles.songArtist} numberOfLines={1}>
            {activeTrack?.preset ?? "—"}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <Slider
            style={styles.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#FFFFFF4D"
            onSlidingComplete={onSlidingComplete}
          />

          <View style={styles.progressLevelDuraiton}>
            <Text style={styles.progressLabelText}>
              {new Date(progress.position * 1000)
                .toLocaleTimeString()
                .substring(3)}
            </Text>
            <Text style={styles.progressLabelText}>
              {new Date((progress.duration - progress.position) * 1000)
                .toLocaleTimeString()
                .substring(3)}
            </Text>
          </View>
        </View>

        <View style={styles.musicControlsContainer}>
          <TouchableOpacity
            onPress={previousTrack}
            style={styles.controlButton}
            activeOpacity={0.7}
          >
            <Ionicons name="play-back" size={35} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={togglePlayBack}
            style={styles.controlButton}
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
            style={styles.controlButton}
            activeOpacity={0.7}
          >
            <Ionicons name="play-forward" size={35} color="#FFD369" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default MusicPlayer;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#222831",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: "space-between",
    alignItems: "center",
  },
  songInfoContainer: {
    alignItems: "center",
    width: "100%",
    flex: 1,
    justifyContent: "center",
    paddingTop: 20,
  },
  imageWrapper: {
    width: 280,
    height: 280,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF33",
    marginBottom: 32,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  songTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 20,
    width: "100%",
  },
  songArtist: {
    fontSize: 16,
    fontWeight: "400",
    color: "#FFFFFFB3",
    textAlign: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  progressContainer: {
    width: "100%",
    paddingHorizontal: 8,
    marginVertical: 32,
  },
  progressBar: {
    width: "100%",
    height: 40,
  },
  progressLevelDuraiton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 8,
  },
  progressLabelText: {
    color: "#FFFFFFCC",
    fontSize: 12,
    fontWeight: "500",
  },
  musicControlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    gap: 40,
  },
  controlButton: {
    padding: 8,
  },
});
