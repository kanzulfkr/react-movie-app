import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Movie } from '../types/app'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

const { width } = Dimensions.get('window')
const cardWidth = width / 3 - 12 // Menentukan lebar setiap kartu dengan margin

const Favorite = (): JSX.Element => {
    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([])
    const navigation = useNavigation()

    const getFavoriteMovies = async (): Promise<void> => {
        try {
            const favoriteMovies = await AsyncStorage.getItem('favoriteMovies')
            if (favoriteMovies !== null) {
                setFavoriteMovies(JSON.parse(favoriteMovies))
            }
        } catch (error) {
            console.log(error)
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            getFavoriteMovies()
        }, []),
    )

    useEffect(() => {
        if (favoriteMovies.length > 0 && favoriteMovies.length % 3 !== 0) {
            const fillEmpty = Array(3 - (favoriteMovies.length % 3)).fill({})
            setFavoriteMovies([...favoriteMovies, ...fillEmpty])
        }
    }, [favoriteMovies])

    const renderMovieItem = ({ item }: { item: Movie | {} }): JSX.Element =>
        'id' in item ? (
            <TouchableOpacity
                style={styles.card}
                onPress={() =>
                    navigation.navigate('MovieDetail', { id: (item as Movie).id })
                }
            >
                <ImageBackground
                    source={{
                        uri: `https://image.tmdb.org/t/p/w500${(item as Movie).poster_path}`,
                    }}
                    style={styles.cardImage}
                >
                    <View style={styles.cardOverlay}>
                        <Text style={styles.cardTitle}>{(item as Movie).title}</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        ) : (
            <View style={[styles.card, styles.emptyCard]} />
        )

    if (favoriteMovies.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text>No favorite movies found.</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={favoriteMovies}
            renderItem={renderMovieItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            contentContainerStyle={styles.container}
            columnWrapperStyle={styles.columnWrapper}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    columnWrapper: {
        justifyContent: 'space-between', // Memastikan kartu tersebar merata
    },
    card: {
        width: cardWidth,
        margin: 4,
        height: cardWidth * 1.5, // Menjaga rasio aspek tetap, bisa disesuaikan
        borderRadius: 8,
        overflow: 'hidden',
    },
    emptyCard: {
        backgroundColor: 'transparent',
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

export default Favorite