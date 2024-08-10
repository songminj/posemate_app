// // 
// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// 기본 설정 가져오기
const defaultConfig = getDefaultConfig(__dirname);

module.exports = mergeConfig(defaultConfig, {
  resolver: {
    // 아래의 blacklistRE를 사용하여 중복된 폰트 파일이 있는 경로를 제외
    blacklistRE: /.*\/(android\/app\/build\/intermediates\/|android\/app\/src\/main\/assets\/fonts\/).*/,
    // blacklistRE 대신 blockList를 사용할 수도 있습니다.
  },
});
