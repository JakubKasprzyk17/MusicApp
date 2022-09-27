import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MusicPlayer from "./src/components/MusicPlayer";

export default function App() {
  return (
    <View style={styles.container}>
      <MusicPlayer />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
