import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const loading = useAuthGuard();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b1020",
        }}
      >
        <ActivityIndicator color="#ffffff" size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
