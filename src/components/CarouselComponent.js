import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const window = Dimensions.get('window');
const PAGE_WIDTH = window.width;
const PAGE_HEIGHT = window.width * 1.2;

const imageData = [
  { id: 1, source: require('../../assets/carousel1.jpg') },
  { id: 2, source: require('../../assets/carousel2.jpg') },
  { id: 3, source: require('../../assets/carousel3.jpg') },
];

function Index() {
  const baseOptions = {
    vertical: false,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  };

  return (
    <View style={styles.container}>
      <Carousel
        {...baseOptions}
        loop
        autoPlay={true}
        withAnimation={{
          type: "spring",
          config: {
            damping: 12,
          },
        }}
        autoPlayInterval={1500}
        data={imageData}
        renderItem={({ item, index, animationValue }) => (
          <Card
            item={item}
            animationValue={animationValue}
            key={item.id}
            index={index}
          />
        )}
      />
    </View>
  );
}

const Card = ({ item, index, animationValue }) => {
  const cardStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [-0.1, 0, 1],
      [0.95, 1, 1],
      Extrapolation.CLAMP,
    );

    const translateX = interpolate(
      animationValue.value,
      [-1, -0.2, 0, 1],
      [0, styles.image.width * 0.3, 0, 0],
    );

    return {
      transform: [
        { scale },
        { translateX },
        { perspective: 200 },
        {
          rotateY: `${interpolate(
            animationValue.value,
            [-1, 0, 0.4, 1],
            [30, 0, -25, -25],
            Extrapolation.CLAMP,
          )}deg`,
        },
      ],
    };
  }, [index]);

  const imageStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0, 0, 0],
    );

    const translateY = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0, -40, -40],
    );

    const rotateZ = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [0, 0, -25],
    );

    return {
      transform: [
        { translateX },
        { translateY },
        { rotateZ: `${rotateZ}deg` },
      ],
    };
  }, [index]);

  return (
    <Animated.View style={styles.cardContainer}>
      <Animated.Image
        source={item.source}
        style={[styles.image, imageStyle, cardStyle]}
        resizeMode={"contain"}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: PAGE_WIDTH / 1.5,
    height: PAGE_HEIGHT / 1.5,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16, // 그림자 표현을 위한 속성
  },
});

export default Index;
