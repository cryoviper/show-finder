import { useDebounce, useAsync } from "../hooks.js";
import { searchShows, getTopShows } from "../api.js";
import ShowCard from "./ShowCard.jsx";

export function Grid({ shows, isSaved, toggleSave }) {
  return (
    <ul className="grid">
      {shows.map((s) => (
        <ShowCard key={s.id} show={s} isSaved={isSaved} toggleSave={toggleSave} />
      ))}
    </ul>
  );
}

export function SkeletonGrid({ n = 12 }) {
  return (
    <ul className="grid" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <li key={i} className="card skel-card">
          <div className="poster skel" />
          <div className="skel line" />
          <div className="skel line short" />
        </li>
      ))}
    </ul>
  );
}

export function ErrorBox({ error }) {
  return (
    <div className="msg" role="alert">
      <b>Couldn't load shows.</b>
      <span>{error.message}. Check your connection, then refresh.</span>
    </div>
  );
}

export default function Browse({ query, isSaved, toggleSave }) {
  const q = useDebounce(query.trim(), 350);
  const searching = q.length >= 2;
  const { loading, error, data } = useAsync((signal) => (searching ? searchShows(q, signal) : getTopShows(signal)), [q, searching]);

  return (
    <section className="wrap" aria-live="polite" aria-busy={loading}>
      <div className="head">
        <h1>{searching ? <>Results for <em>“{q}”</em></> : <>Top rated <em>shows</em></>}</h1>
        {!searching && <p>Highly rated series from the TVmaze catalogue. Search above to find anything else.</p>}
      </div>
      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <ErrorBox error={error} />
      ) : data.length === 0 ? (
        <div className="msg"><b>No shows found.</b><span>Try a different spelling or a shorter name.</span></div>
      ) : (
        <Grid shows={data} isSaved={isSaved} toggleSave={toggleSave} />
      )}
    </section>
  );
}
