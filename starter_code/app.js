require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });





// the routes go here:
app.get("/", (req, res) => {
    res.render("index.hbs")
})

app.get("/artist", (req, res) => {


    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log(data.body.artists.items);
            res.render("artist.hbs", {
                artists: data.body.artists.items
            })
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });

});

app.get("/albums/:artistId", (req, res, next) => {
    
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data =>{
         console.log('Artist albums', data.body.items)
         //res.send( data.body)
         res.render("albums.hbs", {albums: data.body.items})
    })
    .catch(err => {
                console.log(err);
            })
        })
  
        app.get("/tracks/:albumsId", (req, res, next) => {
    
            spotifyApi.getAlbumTracks(req.params.albumsId)
            .then(data =>{
                 console.log("Albums tracks", data.body.items)
                 //res.send( data.body)
                 res.render("tracks.hbs", {tracks: data.body.items})
            })
            .catch(err => {
                        console.log(err);
                    })
                })
          
        

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));