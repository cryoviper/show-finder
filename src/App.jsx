import { useState } from "react";
import { useHashRoute, useLocalStorage } from "./hooks.js";
import Browse from "./components/Browse.jsx";
import ShowPage from "./components/ShowPage.jsx";
import Watchlist from "./components/Watchlist.jsx";

export default function App() {
  const route = useHashRoute();
  const [query, setQuery] = useState("");
  // Store a small snapshot of each saved show so the watchlist renders offline.
  const [saved, setSaved] = useLocalStorage("reel.watchlist", []);

  const isSaved = (id) => saved.some((s) => s.id === id);
  const toggleSave = (show) =>
    setSaved((list) =>
      list.some((s) => s.id === show.id)
        ? list.filter((s) => s.id !== show.id)
        : [{ id: show.id, name: show.name, image: show.image, premiered: show.premiered, rating: show.rating, genres: show.genres }, ...list]
    );

  const showMatch = route.match(/^\/show\/(\d+)/);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="top">
        <a className="brand" href="#/" onClick={() => setQuery("")}>
          <span className="reel" aria-hidden="true" />
          Reel
        </a>
        <form className="search" role="search" onSubmit={(e) => { e.preventDefault(); window.location.hash = "/"; }}>
          <label className="sr" htmlFor="q">Search TV shows</label>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <input
            id="q"
            type="search"
            placeholder="Search any TV show"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (showMatch || route === "/watchlist") window.location.hash = "/";
            }}
          />
        </form>
        <a className={`wl-link ${route === "/watchlist" ? "on" : ""}`} href="#/watchlist">
          Watchlist <span className="badge">{saved.length}</span>
        </a>
      </header>

      <main id="main">
        {showMatch ? (
          <ShowPage id={Number(showMatch[1])} isSaved={isSaved} toggleSave={toggleSave} />
        ) : route === "/watchlist" ? (
          <Watchlist saved={saved} toggleSave={toggleSave} />
        ) : (
          <Browse query={query} isSaved={isSaved} toggleSave={toggleSave} />
        )}
      </main>

      <footer className="foot">
        Data from <a href="https://www.tvmaze.com/api" target="_blank" rel="noopener">TVmaze</a> (CC BY-SA) · Built by{" "}
        <a href="https://github.com/cryoviper" target="_blank" rel="noopener">Praveen Sinwar</a>
      </footer>
    </>
  );
}
