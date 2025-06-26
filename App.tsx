import { LogBox, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MapView from './src/MapView'

const App = () => {
   LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();
  LogBox.ignoreLogs(['Remote debugger']);

  return (
    <MapView/>
  )
}

export default App

const styles = StyleSheet.create({})