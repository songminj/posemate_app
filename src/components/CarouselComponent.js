import React, { useState } from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const window = Dimensions.get('window');
const PAGE_WIDTH = window.width;
const PAGE_HEIGHT = window.width * 1.2;

// 이미지 데이터 추가
const imageData = [
  { id: 1, source: require('../../assets/carousel1.jpg') },
  { id: 2, source: require('../../assets/carousel2.jpg') },
  { id: 3, source: require('../../assets/carousel3.jpg') },
];

const colors = ["#fda282", "#fdba4e", "#800015"];

function Index() {
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const baseOptions = {
    vertical: false,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  };

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        {...baseOptions}
        loop
        autoPlay= {true}
        withAnimation={{
          type: "spring",
          config: {
            damping: 13,
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
  const WIDTH = PAGE_WIDTH / 1.5;
  const HEIGHT = PAGE_HEIGHT / 1.5;

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
      [0, WIDTH * 0.3, 0, 0],
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
      [0, 60, 60],
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
    <Animated.View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: colors[index % colors.length],
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
            width: WIDTH,
            height: HEIGHT,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.44,
            shadowRadius: 10.32,
            elevation: 16,
          },
          cardStyle,
        ]}
      />

      <Animated.Image
        source={item.source}
        style={[
          {
            width: WIDTH * 0.8,
            height: HEIGHT * 0.8,
            borderRadius: 16,
            position: "absolute",
            zIndex: 999,
          },
          imageStyle,
        ]}
        resizeMode={"contain"}
      />
    </Animated.View>
  );
};

export default Index;