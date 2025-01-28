import fetch from 'node-fetch';
import mongoose from 'mongoose';

async function getSpotifyToken() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch Spotify token');
    }

    const data = await response.json();
    return data.access_token;
}

const Album = mongoose.model('Album');

async function fetchAndPopulateAlbums() {
    try {
        const token = await getSpotifyToken();
        const baseUrl = 'https://api.spotify.com/v1/browse/new-releases';
        const limit = 50; 
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
            const response = await fetch(`${baseUrl}?limit=${limit}&offset=${offset}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch albums from Spotify. Status: ${response.status}`);
            }

            const data = await response.json();
            const albums = data.albums.items;

            if (albums.length === 0) {
                hasMore = false;
                break;
            }

            for (const album of albums) {
                const existingAlbum = await Album.findOne({ title: album.name, artist: album.artists[0].name });

                if (!existingAlbum) {
                    const newAlbum = {
                        title: album.name,
                        artist: album.artists[0].name,
                        releaseDate: album.release_date,
                        genre: album.genres?.[0] || 'Unknown', 
                        coverImage: album.images[0]?.url || '',
                    };

                    await Album.create(newAlbum);
                    console.log(`Added album: ${newAlbum.title}`);
                } else {
                    console.log(`Album already exists: ${album.name}`);
                }
            }

            offset += limit;

            if (albums.length < limit) {
                hasMore = false;
            }
        }

        console.log('Album population complete!');
    } catch (err) {
        console.error('Error populating albums:', err.message);
    }
}

export { fetchAndPopulateAlbums };
