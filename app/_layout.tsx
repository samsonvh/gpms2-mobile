import { Stack } from 'expo-router'
import React from 'react'

const Layout = () => {
  return (
    <Stack>
        <Stack.Screen name='index'/>
        <Stack.Screen name='camera'/>
    </Stack>
  )
}

export default Layout