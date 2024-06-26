import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ImageBackground,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { API_ACCESS_TOKEN } from '@env'

const CategorySearch = (): JSX.Element => {
    const [genres, setGenres] = useState<any[]>([])
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
    const [movies, setMovies] = useState<any[]>([])
    const navigation = useNavigation()

    useEffect(() => {
        fetchGenres()
    }, [])

    useEffect(() => {
        if (selectedGenre !== null) {
            searchMoviesByGenre()
        }
    }, [selectedGenre])

    const fetchGenres = async (): Promise<void> => {
        const url = `https://api.themoviedb.org/3/genre/movie/list`
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
            setGenres(data.genres)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearch = () => {
        if (selectedGenre !== null) {
            navigation.navigate('CategorySearchResult', { genreId: selectedGenre })
        }
    }

    const searchMoviesByGenre = async (): Promise<void> => {
        const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${selectedGenre}`
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

    const renderGenreItem = ({ item }: { item: any }): JSX.Element => (
        <TouchableOpacity
            key={item.id}
            style={{
                ...styles.genreItem,
                backgroundColor: item.id === selectedGenre ? '#8978A4' : '#C0B4D5',
            }}
            onPress={() => setSelectedGenre(item.id)}
        >
            <Text style={styles.genreText}>{item.name}</Text>
        </TouchableOpacity>
    )

    return (
        <View>
            <FlatList
                data={genres}
                renderItem={renderGenreItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.genresContainer}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    genresContainer: {
        padding: 8,
    },
    genreItem: {
        flex: 1,
        margin: 4,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    genreText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '400',
        textTransform: 'capitalize',
    },
    searchButton: {
        backgroundColor: '#8978A4',
        padding: 20,
        borderRadius: 50,
        margin: 8,
    },
    searchButtonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: '400',
    },
})

export default CategorySearch