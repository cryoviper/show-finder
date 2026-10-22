import { Grid } from "./Browse.jsx";

export default function Watchlist({ saved, toggleSave }) {
  const isSaved = (id) => saved.some((s) => s.id === id);
  return (
    <section className="wrap">
      <div className="head">
        <h1>Your <em>watchlist</em></h1>
        <p>{saved.length ? `${saved.length} show${saved.length > 1 ? "s" : ""} saved on this device.` : "Shows you save will appear here."}</p>
      </div>
      {saved.length ? (
        <Grid shows={saved} isSaved={isSaved} toggleSave={toggleSave} />
      ) : (
        <div className="msg">
          <b>Nothing saved yet.</b>
          <span>Tap the bookmark on any show to add it. <a href="#/">Browse top shows →</a></span>
        </div>
      )}
    </section>
  );
}
