import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }
  };

  const formatFileSize = (bytes: number | undefined): string => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (
    mimeType: string | undefined,
  ): keyof typeof Ionicons.glyphMap => {
    if (!mimeType) return "document-outline";
    if (mimeType.startsWith("audio/")) return "musical-notes-outline";
    if (mimeType.startsWith("image/")) return "image-outline";
    if (mimeType.startsWith("video/")) return "videocam-outline";
    if (mimeType.includes("pdf")) return "document-text-outline";
    if (mimeType.includes("word") || mimeType.includes("document"))
      return "document-outline";
    return "document-outline";
  };

  return (
    <SafeAreaView className="flex-1 bg-[#222831]">
      <View className="flex-1 items-center justify-center px-6 py-8">
        <TouchableOpacity
          onPress={pickDocument}
          className="mb-8 rounded-xl bg-[#FFD369] px-8 py-4"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="folder-outline" size={24} color="#222831" />
            <Text className="text-lg font-semibold text-[#222831]">
              Pick a File
            </Text>
          </View>
        </TouchableOpacity>

        {selectedFile && (
          <View className="w-full rounded-2xl border-2 border-[#FFFFFF33] bg-[#2D3748] p-6">
            <View className="mb-6 items-center">
              <View className="mb-4 rounded-full bg-[#FFD369] p-4">
                <Ionicons
                  name={getFileIcon(selectedFile.mimeType)}
                  size={48}
                  color="#222831"
                />
              </View>
              <Text
                className="mb-2 text-center text-xl font-bold text-white"
                numberOfLines={2}
              >
                {selectedFile.name}
              </Text>
            </View>

            <View className="mb-6 space-y-3">
              <View className="flex-row items-center justify-between border-b border-[#FFFFFF1A] py-2">
                <Text className="text-base text-[#FFFFFFB3]">File Size</Text>
                <Text className="text-base font-medium text-white">
                  {formatFileSize(selectedFile.size)}
                </Text>
              </View>

              {selectedFile.mimeType && (
                <View className="flex-row items-center justify-between border-b border-[#FFFFFF1A] py-2">
                  <Text className="text-base text-[#FFFFFFB3]">Type</Text>
                  <Text className="text-base font-medium text-white">
                    {selectedFile.mimeType}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => setSelectedFile(null)}
              className="mt-4 flex-row items-center justify-center gap-2 rounded-xl border-2 border-[#FFFFFF33] px-6 py-3"
              activeOpacity={0.8}
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color="#FFFFFFB3"
              />
              <Text className="text-base font-medium text-[#FFFFFFB3]">
                Clear Preview
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!selectedFile && (
          <View className="mt-8 items-center">
            <Ionicons
              name="document-text-outline"
              size={64}
              color="#FFFFFF33"
            />
            <Text className="mt-4 text-center text-base text-[#FFFFFF66]">
              No file selected. Pick a file to see its preview.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
