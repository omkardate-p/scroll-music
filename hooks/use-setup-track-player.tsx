import podcasts from "@/utils/audio";
import { getSavedPlaybackState } from "@/utils/playback-storage";
import { useEffect, useRef } from "react";
import TrackPlayer, {
  Capability,
  RatingType,
  RepeatMode,
} from "react-native-track-player";

const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer({
      maxCacheSize: 1024 * 10,
    });

    await TrackPlayer.updateOptions({
      ratingType: RatingType.Heart,
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      compactCapabilities: [Capability.Play, Capability.Pause],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
    });

    await TrackPlayer.add(podcasts);

    const savedPlaybackState = await getSavedPlaybackState();
    if (!savedPlaybackState) return;

    try {
      await TrackPlayer.skip(
        podcasts.findIndex((audio) => audio.id === savedPlaybackState.id),
        savedPlaybackState.position,
      );

      switch (savedPlaybackState.repeatMode) {
        case RepeatMode.Queue:
          await TrackPlayer.setRepeatMode(RepeatMode.Queue);
          break;
        case RepeatMode.Track:
          await TrackPlayer.setRepeatMode(RepeatMode.Track);
          break;
        default:
          await TrackPlayer.setRepeatMode(RepeatMode.Off);
          break;
      }
    } catch (error) {
      console.error("Error restoring playback:", error);
    }
  } catch (error) {
    console.error("Error setting up player:", error);
  }
};

export const useSetupTrackPlayer = () => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;

    setupPlayer()
      .then(() => {
        isInitialized.current = true;
      })
      .catch((error) => {
        isInitialized.current = false;
        console.error(error);
      });
  }, []);
};
