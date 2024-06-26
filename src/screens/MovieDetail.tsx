import React, { useEffect, useState } from 'react'
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    ScrollView,
} from 'react-native'

import { API_ACCESS_TOKEN } from '@env'
import { FontAwesome } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
// import { LinearGradient } from 'react-native-linear-gradient'
import type { Movie } from '../types/app'
import MovieList from '../components/movies/MovieList'

const MovieDetail = ({ route }: any): JSX.Element => {
    const { id } = route.params
    const [movie, setMovie] = useState<Movie | null>(null)

    useEffect(() => {
        getMovieDetail()
    }, [])

    const getMovieDetail = (): void => {
        const url = `https://api.themoviedb.org/3/movie/${id}`
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_ACCESS_TOKEN}`,
            },
        }

        fetch(url, options)
            .then(async (response) => await response.json())
            .then((response) => {
                setMovie(response)
            })
            .catch((errorResponse) => {
                console.log(errorResponse)
            })
    }

    if (!movie) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        )
    }

    const renderStars = (rating: number) => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            const name = i <= rating ? 'star' : 'star-o'
            stars.push(<FontAwesome key={i} name={name} size={24} color="yellow" />)
        }
        return stars
    }

    return (
        <ScrollView>
            <ImageBackground
                source={{
                    uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
                }}
                style={styles.backgroundImage}
            >
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                >
                    <Text style={styles.title}>{movie.title}</Text>
                    <View style={styles.ratingContainer}>
                        {renderStars(Math.round(movie.vote_average / 2))}
                        <Text style={styles.ratingText}>{movie.vote_average}</Text>
                    </View>
                </LinearGradient>
            </ImageBackground>
            <View style={styles.container}>
                <Text style={styles.overview}>{movie.overview}</Text>
                <View style={styles.detailRow}>
                    <View style={styles.detailColumn}>
                        <Text style={styles.detailLabel}>Original Language</Text>
                        <Text style={styles.detailValue}>{movie.original_language}</Text>
                    </View>
                    <View style={styles.detailColumn}>
                        <Text style={styles.detailLabel}>Popularity</Text>
                        <Text style={styles.detailValue}>{movie.popularity}</Text>
                    </View>
                </View>

                <View style={styles.detailRow}>
                    <View style={styles.detailColumn}>
                        <Text style={styles.detailLabel}>Release Date</Text>
                        <Text style={styles.detailValue}>
                            {new Date(movie.release_date).toDateString()}
                        </Text>
                    </View>
                    <View style={styles.detailColumn}>
                        <Text style={styles.detailLabel}>Vote Count</Text>
                        <Text style={styles.detailValue}>{movie.vote_count}</Text>
                    </View>
                </View>
                <MovieList
                    title="Recommendations"
                    path={`movie/${id}/recommendations?language=en-US&page=1`}
                    coverType="poster"
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: 300,
        justifyContent: 'flex-end',
    },
    gradient: {
        width: '100%',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'yellow',
        marginLeft: 8,
    },
    container: {
        padding: 16,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    overview: {
        fontSize: 16,
        marginBottom: 16,
    },
    detailContainer: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    detailColumn: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    detailValue: {
        fontSize: 16,
        color: 'black',
    },
})

export default MovieDetail