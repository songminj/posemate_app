import React from "react"
import { 
  StyleSheet,
  TextInput,
  View,
  Dimensions,
} from "react-native"
import PropTypes from 'prop-types'

const width = Dimensions.get('window').width

const Input = ({ title, placeholder, secureTextEntry }) => {
  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        placeholder={placeholder ?? title}
        placeholderTextColor={'#a3a3a3'}
        secureTextEntry={secureTextEntry} 
      />
    </View>
  )
}

Input.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool, 
}

Input.defaultProps = {
  title:'',
  secureTextEntry: false, 
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    width: width * 0.8,
  },
})

export default Input
