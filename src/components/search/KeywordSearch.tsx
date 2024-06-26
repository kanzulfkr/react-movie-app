import React, { useState } from 'react'
import {
    View,
    TextInput,
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { API_ACCESS_TOKEN } from '@env'

const KeywordSearch = (): JSX.Element => {
    const [keyword, setKeyword] = useState<string>('')
    const [movies, setMovies] = useState<any[]>([])
    const navigation = useNavigation()

    const searchMovies = async (): Promise<void> => {
        if (keyword.trim() === '') {
            return
        }

        const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}`
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_ACCESS_TOKEN}`,
            },
        }

        try {
            const response = await fetch(url, options)
            const data = await response.json()
            setMovies(data.results)
        } catch (error) {
            console.log(error)
        }
    }

    const renderMovieItem = ({ item }: { item: any }): JSX.Element => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('MovieDetail', { id: item.id })}
        >
            <ImageBackground
                source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                style={styles.cardImage}
            >
                <View style={styles.cardOverlay}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )

    return (
        <View>
            <TextInput
                style={styles.input}
                value={keyword}
                onChangeText={setKeyword}
                placeholder="Search movies..."
                onSubmitEditing={searchMovies}
            />
            <FlatList
                data={movies}
                renderItem={renderMovieItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                contentContainerStyle={styles.resultsContainer}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 8,
        paddingHorizontal: 8,
        borderRadius: 20,
    },
    resultsContainer: {
        padding: 8,
    },
    card: {
        flex: 1,
        margin: 4,
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
    },
    cardImage: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    cardOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 8,
    },
    cardTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
})

export default KeywordSearch