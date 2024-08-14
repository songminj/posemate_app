import React from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet
} from 'react-native';

const { width } = Dimensions.get('window');

const CommentBox = ({ 
  bodyName = '상체',
  score = 0, 
  comment = '의견이 없습니다.' 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {bodyName} 자세는 {score}점 입니다.
      </Text>
      <Text style={styles.comment}>
        {comment}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: '#0D0D0D',
    borderWidth: 1, // borderBlockColor가 아니라 borderColor로 수정
    padding: 10,
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    width: width*0.8
  },
  comment: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default CommentBox;
