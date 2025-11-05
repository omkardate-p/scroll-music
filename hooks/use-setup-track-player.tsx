import podcasts from "@/utils/audio";
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
    });

    await TrackPlayer.add(podcasts);
  } catch (error) {
    console.error(error);
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
