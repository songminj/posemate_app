import React from 'react';
import { 
  StyleSheet,
  TextInput,
  View,
  Dimensions,
  Text
} from 'react-native';
import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');

const Input = ({ 
  title = '', 
  placeholder ='', 
  secureTextEntry = false, 
  onChangeText, 
  value, 
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <TextInput 
        style={styles.input}
        placeholder={placeholder || title}
        placeholderTextColor="#999999"
        secureTextEntry={secureTextEntry} 
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
};

Input.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool, 
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  style: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    width: width * 0.85,
  },
  title: {
    color: '#333333',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});

export default Input;