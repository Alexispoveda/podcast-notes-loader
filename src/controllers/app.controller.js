const path = require('path');

const spotify = require('../config/spotify.config');

const {db} = require('../config/firebase.config');
const {auth} = require('../config/firebase.config');

exports.login = (_, res) => {

    // Auth scopes
    const scopes = [
        'user-read-playback-position'
    ];

    res.redirect(spotify.api.createAuthorizeURL(scopes));
}

exports.load = (req, res) => {

    const error = req.query.error;
    const code = req.query.code;

    if (error) {
        res.send(`Callback Error: ${error}`);
        return;
    }

    spotify.api
        .authorizationCodeGrant(code)
        .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];

        spotify.api.setAccessToken(access_token);
        spotify.api.setRefreshToken(refresh_token);

        spotify.api.getShowEpisodes("4Pppt42NPK2XzKwNIoW7BR",{limit:40})
            .then(response=>{
                // Filter extra episodes
                const normalEpisodes = response.body.items.filter(episode=>episode.name.includes('Day '));
                
                const formattedEpisodes = normalEpisodes.map(episode=>{
                    const [dia, titulo] = episode.name.split(": ");

                    return {
                        spotify: episode.external_urls.spotify, 
                        titulo: titulo, 
                        dia: parseInt(dia.replace('Day ',''))
                    }
                });

                auth.signInWithEmailAndPassword(process.env.FIREBASE_USER, process.env.FIREBASE_PASSWORD)
                    .then(() => {
                        db.collection('episodios').get()
                        .then(snapshot=>{
                            let appEpisodesLength = snapshot.docs.length;
                            const spotifyEpisodesLength = formattedEpisodes[0].dia;

                            while (appEpisodesLength < spotifyEpisodesLength) {
                                appEpisodesLength+=1
                                let addedEpisode = formattedEpisodes.find(episode => episode.dia == appEpisodesLength)
                                db.collection('episodios').add(addedEpisode)
                                    .catch(err=>res.send(`Firebase error: ${err}`));
                            }
                        })
                    })
                    .catch(error => res.send(`Login Error: ${error.code} ${error.message}`));

                // res.send(`¡La aplicación esta al día! Muchas gracias 😄`);
                res.sendFile('response.html',{root: path.join(__dirname, '../../public')});
            })
            .catch(err=>res.send(`Spotify error: ${err}`));
    });
};