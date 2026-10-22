import { year } from "../api.js";

export function Poster({ show, className = "" }) {
  const src = show.image?.medium;
  return src ? (
    <img className={`poster ${className}`} src={src} alt="" loading="lazy" decoding="async" width="210" height="295" />
  ) : (
    <div className={`poster no-img ${className}`} aria-hidden="true">
      <span>{show.name.slice(0, 1)}</span>
    </div>
  );
}

export function SaveButton({ show, isSaved, toggleSave, big = false }) {
  const on = isSaved(show.id);
  return (
    <button
      type="button"
      className={`save ${on ? "on" : ""} ${big ? "big" : ""}`}
      aria-pressed={on}
      aria-label={on ? `Remove ${show.name} from watchlist` : `Add ${show.name} to watchlist`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSave(show);
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z" /></svg>
      {big && <span>{on ? "In watchlist" : "Add to watchlist"}</span>}
    </button>
  );
}

export default function ShowCard({ show, isSaved, toggleSave }) {
  return (
    <li className="card">
      <a href={`#/show/${show.id}`} className="card-link">
        <div className="poster-wrap">
          <Poster show={show} />
          {show.rating?.average ? <span className="rating">★ {show.rating.average.toFixed(1)}</span> : null}
        </div>
        <h3>{show.name}</h3>
        <p>{[year(show), show.genres?.slice(0, 2).join(", ")].filter(Boolean).join(" · ")}</p>
      </a>
      <SaveButton show={show} isSaved={isSaved} toggleSave={toggleSave} />
    </li>
  );
}
