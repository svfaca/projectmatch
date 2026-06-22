import { palette } from "@/components/ui/projectmatch-ui";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  const loading = useAuthGuard();

  if (loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: palette.background,
          }}
        >
          <ActivityIndicator color={palette.primary} size="large" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </GestureHandlerRootView>
  );
}
