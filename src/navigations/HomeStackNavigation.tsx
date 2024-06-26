import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'
import MovieDetail from '../screens/MovieDetail'
import CategorySearchResult from '../screens/CategorySearchResult'

const Stack = createNativeStackNavigator()

const HomeStackNavigator = (): JSX.Element => (
    <Stack.Navigator>
        <Stack.Screen
            name="HomeScreen"
            component={Home}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="MovieDetail"
            component={MovieDetail}
            options={{ title: 'Movie Detail' }}
        />
        <Stack.Screen
            name="CategorySearchResult"
            component={CategorySearchResult}
            options={{ title: 'Search Results' }}
        />
    </Stack.Navigator>
)

export default HomeStackNavigator