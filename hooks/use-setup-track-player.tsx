import podcasts from "@/utils/audio";
import { getSavedPlaybackState } from "@/utils/playback-storage";
import { useEffect, useRef } from "react";
import TrackPlayer, { Capability, RatingType } from "react-native-track-player";

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

    const saved = await getSavedPlaybackState();
    if (!saved) return;

    try {
      await TrackPlayer.skip(
        podcasts.findIndex((audio) => audio.id === saved.id),
        saved.position,
      );
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
