let express = require("express");
let app = express();
let port = 3000;
let db;
let sqlite3 = require("sqlite3");
let { open } = require("sqlite");
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// Connect to SQLite database
(async () => {
  db = await open({
    filename: "./BD-4.3-CW/database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) console.log("Connected to the SQLite database.");
})();
//Message
app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4.3 CW Error Handling" });
});
//node BD-4.3-CW/initDB.js
// THE ENPOINTS
//node BD-4.3-CW
//1 /movies
async function fetchAllMovies() {
  let query = "SELECT * FROM movies";
  let response = await db.all(query, []);
  return { movies: response };
}
app.get("/movies", async (req, res) => {
  try {
    let results = await fetchAllMovies();
    if (results.movies.length === 0) {
      return res.status(404).json({ message: "No movies found" });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
//2 /movies/actor/Salman%20Khan
async function filterByActor(actor) {
  let query = "SELECT * FROM movies WHERE actor = ?";
  let response = await db.all(query, [actor]);
  return { movies: response };
}
app.get("/movies/actor/:actor", async (req, res) => {
  const actor = req.params.actor;
  try {
    let results = await filterByActor(actor);
    if (results.movies.length === 0) {
      return res
        .status(404)
        .json({ message: "No movies found for actor: " + actor });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
//3 /movies/director/S.S.%20Rajamouli
async function filterByDirector(director) {
  let query = "SELECT * FROM movies WHERE director = ?";
  let response = await db.all(query, [director]);
  return { movies: response };
}
app.get("/movies/director/:director", async (req, res) => {
  let director = req.params.director;
  try {
    const results = await filterByDirector(director);
    if (results.movies.length === 0) {
      return res
        .status(404)
        .json({ message: "No movies found for director: " + director });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});