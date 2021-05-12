const SpotifyWebApi = require('spotify-web-api-node');

// Spotify config
const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

exports.api = spotifyApi
