import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#222831]">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-3xl font-bold text-white">
          Welcome to Scroll Music
        </Text>
        <Text className="mt-4 text-center text-base text-[#FFFFFFB3]">
          Navigate to the Music tab to start playing
        </Text>
      </View>
    </SafeAreaView>
  );
}
