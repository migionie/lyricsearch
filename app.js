import express from "express";
import axios from "axios";
import aimastering from "aimastering";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

const API_URL = "https://api.lyrics.ovh/v1";
const APP_TITLE = "Lyric Search V.1.0";

let searchHistory = [];

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

app.get("/", (req, res) => {
  res.render("index.ejs", {
    title: APP_TITLE,
  });
});

function addSearch(search) {
  searchHistory.unshift(search.songname + " by " + search.artist);

  console.log(searchHistory);

  if (searchHistory.length === 6) {
    searchHistory.splice(searchHistory.length - 1);
  }
}

app.post("/search-lyrics", async (req, res) => {
  let artistName = req.body.artist;
  let songName = req.body.songname;

  try {
    let result = await axios(`${API_URL}/${artistName}/${songName}`);
    let data = result.data.lyrics.replaceAll("\n", "<br>");

    addSearch({
      songname: songName,
      artist: artistName,
    });

    res.render("index.ejs", {
      title: APP_TITLE,
      artist: artistName,
      songname: songName,
      searchHistory: searchHistory,
      data: data,
    });
  } catch (error) {
    res.render("index.ejs", {
      title: APP_TITLE,
      artist: artistName,
      songname: songName,
      data: `Ups... No lyrics found for ${songName} by ${artistName}`,
    });
  }
});
