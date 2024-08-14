import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { G, Path, Svg } from "react-native-svg";
import Pie from "paths-js/pie";

const { width } = Dimensions.get('window');

const DynamicProgressChart = ({ data, colors, width = 300, height = 300, radius = 100 }) => {
  const pies = data.map((pieData, i) => {
    const r = (height / 2 - 32) / data.length * i + radius;
    return Pie({
      r,
      R: r,
      center: [0, 0],
      data: [pieData, 1 - pieData],
      accessor(x) {
        return x;
      }
    });
  });

  return (
    <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
      <Svg
        width={width}
        height={height}
      >
        <G
          x={width / 2}
          y={height / 2}
        >
          <G>
            {pies.map((pie, i) => (
              <Path
                key={i}
                d={pie.curves[0].sector.path.print()}
                strokeWidth={16}
                stroke={colors[i]}
              />
            ))}
          </G>
        </G>
      </Svg>
    </View>
  );
};

export default DynamicProgressChart;
