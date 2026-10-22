import { useEffect, useState } from "react";
import { useAsync } from "../hooks.js";
import { getShow, getEpisodes, plainText, year } from "../api.js";
import { Poster, SaveButton } from "./ShowCard.jsx";
import { ErrorBox } from "./Browse.jsx";

function Episodes({ season }) {
  const { loading, error, data } = useAsync((signal) => getEpisodes(season.id, signal), [season.id]);
  if (loading) return <p className="muted">Loading episodes…</p>;
  if (error) return <p className="muted">Couldn't load episodes.</p>;
  if (!data.length) return <p className="muted">No episodes listed yet.</p>;
  return (
    <ol className="eps">
      {data.map((ep) => (
        <li key={ep.id}>
          <span className="ep-n">{ep.number ?? "Sp"}</span>
          <div>
            <b>{ep.name}</b>
            <small>
              {[ep.airdate && new Date(ep.airdate + "T00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }), ep.runtime && `${ep.runtime} min`, ep.rating?.average && `★ ${ep.rating.average}`]
                .filter(Boolean)
                .join(" · ")}
            </small>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function ShowPage({ id, isSaved, toggleSave }) {
  const { loading, error, data: show } = useAsync((signal) => getShow(id, signal), [id]);
  const [seasonIdx, setSeasonIdx] = useState(0);
  useEffect(() => setSeasonIdx(0), [id]);
  useEffect(() => {
    if (show) document.title = `${show.name} · Reel`;
    return () => { document.title = "Reel · Show Finder"; };
  }, [show]);

  if (loading) return <section className="wrap"><div className="detail skel-detail"><div className="poster skel" /><div className="skel line" /></div></section>;
  if (error) return <section className="wrap"><ErrorBox error={error} /></section>;

  const seasons = show._embedded?.seasons || [];
  const cast = (show._embedded?.cast || []).slice(0, 12);
  const summary = plainText(show.summary);
  const facts = [
    ["Status", show.status],
    ["Network", show.network?.name || show.webChannel?.name],
    ["Schedule", show.schedule?.days?.length ? `${show.schedule.days.join(", ")}${show.schedule.time ? " at " + show.schedule.time : ""}` : null],
    ["Runtime", show.averageRuntime ? `${show.averageRuntime} min` : null],
    ["Language", show.language],
  ].filter(([, v]) => v);

  return (
    <article className="wrap">
      <a className="back" href="#/" onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }}>← Back</a>
      <div className="detail">
        {show.image?.original && <div className="backdrop" style={{ backgroundImage: `url(${show.image.medium})` }} aria-hidden="true" />}
        <Poster show={show} className="lg" />
        <div className="info">
          <p className="eyebrow">{[year(show), show.type, show.genres?.join(" · ")].filter(Boolean).join(" · ")}</p>
          <h1>{show.name}</h1>
          <div className="row">
            {show.rating?.average && <span className="score">★ {show.rating.average.toFixed(1)}<small>/10</small></span>}
            <SaveButton show={show} isSaved={isSaved} toggleSave={toggleSave} big />
            {show.officialSite && <a className="ghost-btn" href={show.officialSite} target="_blank" rel="noopener">Official site ↗</a>}
          </div>
          {summary && <p className="summary">{summary}</p>}
          <dl className="facts">
            {facts.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>

      {seasons.length > 0 && (
        <section className="block" aria-labelledby="eps-h">
          <div className="block-head">
            <h2 id="eps-h">Episodes</h2>
            <div className="tabs" role="tablist" aria-label="Seasons">
              {seasons.map((s, i) => (
                <button key={s.id} role="tab" type="button" aria-selected={i === seasonIdx} onClick={() => setSeasonIdx(i)}>
                  S{s.number}
                </button>
              ))}
            </div>
          </div>
          <Episodes season={seasons[seasonIdx]} />
        </section>
      )}

      {cast.length > 0 && (
        <section className="block" aria-labelledby="cast-h">
          <h2 id="cast-h">Cast</h2>
          <ul className="cast">
            {cast.map(({ person, character }) => (
              <li key={person.id + "-" + character.id}>
                {person.image?.medium ? <img src={person.image.medium} alt="" loading="lazy" width="64" height="64" /> : <span className="avatar">{person.name[0]}</span>}
                <div><b>{person.name}</b><small>{character.name}</small></div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
