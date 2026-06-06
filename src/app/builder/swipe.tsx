import { StyleSheet, Text, View } from "react-native";

export default function SwipeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Swipe</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b1020",
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },
});
