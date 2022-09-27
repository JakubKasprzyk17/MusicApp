import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";

import songs from "../../songs/data";

const { width, height } = Dimensions.get("window");

const setupPlayer = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.add(songs);
};

const togglePlayback = async (playbackState) => {
  const currentTrack = await TrackPlayer.getCurrentTrack();

  if (currentTrack === null) {
    if (playbackState == State.Paused) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};

const MusicPlayer = () => {
  const playbackState = usePlaybackState();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [songIndex, setSongIndex] = useState(0);
  const songSlider = useRef(null);

  useEffect(() => {
    setupPlayer();
    scrollX.addListener(({ value }) => {
      const index = Math.round(value / width);
      setSongIndex(index);
    });
    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  const skipForward = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };

  const skipBack = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  const renderSongs = ({ index, item }) => {
    return (
      <Animated.View
        style={{
          width: width,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.imageBox}>
          <Image style={styles.image} source={item.image} />
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: width }}>
          <Animated.FlatList
            ref={songSlider}
            renderItem={renderSongs}
            data={songs}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { x: scrollX },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
          />
        </View>
        <View>
          <Text style={styles.title}>{songs[songIndex].title}</Text>
          <Text style={styles.artist}>{songs[songIndex].artist}</Text>
        </View>
        <View>
          <Slider
            style={styles.slider}
            value={10}
            minimumValue={0}
            maximumValue={100}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#FFF"
            onSlidingComplete={() => {}}
          />
          <View style={styles.time}>
            <Text style={styles.timeText}>0:00</Text>
            <Text style={styles.timeText}>3:20</Text>
          </View>
        </View>
        <View style={styles.musicButtons}>
          <TouchableOpacity onPress={skipBack}>
            <Ionicons
              name="play-skip-back-outline"
              size={35}
              color="#FFD369"
              style={{ marginTop: 25 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePlayback(playbackState)}>
            <Ionicons
              name={
                playbackState === State.Playing
                  ? "ios-pause-circle"
                  : "ios-play-circle"
              }
              size={75}
              color="#FFD369"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipForward}>
            <Ionicons
              name="play-skip-forward-outline"
              size={35}
              color="#FFD369"
              style={{ marginTop: 25 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.buttons}>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={30} color="#777777" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="repeat" size={30} color="#777777" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={30} color="#777777" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={30} color="#777777" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MusicPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBox: {
    width: 300,
    height: 340,
    marginBottom: 25,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#eeeeee",
  },
  artist: {
    fontSize: 16,
    fontWeight: "200",
    textAlign: "center",
    color: "#eeeeee",
  },
  slider: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: "row",
  },
  time: {
    width: 340,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    color: "#FFF",
  },
  musicButtons: {
    flexDirection: "row",
    width: "60%",
    justifyContent: "space-between",
    marginTop: 15,
  },
  footer: {
    borderTopColor: "#393E46",
    borderTopWidth: 1,
    width: width,
    alignItems: "center",
    paddingVertical: 15,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});
