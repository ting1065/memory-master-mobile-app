import { View, Text, StyleSheet  } from 'react-native'
import React from 'react'
import { colors } from '../Colors'

const Card = ({children, width, height, backgroundColor}) => {
  return (
        <View style={[styles.card, {width: width}, {height: height}, {backgroundColor: backgroundColor}]}>
           {children} 
        </View>
  )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 10,
        // Add platform-specific shadow
        ...Platform.select({
          ios: {
            shadowColor: colors.shadowColor,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
          },
          android: {
            elevation: 6,
          },
        }),
    }
});

export default Card