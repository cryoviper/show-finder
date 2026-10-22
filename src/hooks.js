import { useEffect, useState, useCallback } from "react";

// Hash-based routing so links work on GitHub Pages without server rewrites.
export function useHashRoute() {
  const parse = () => (window.location.hash.replace(/^#/, "") || "/");
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => {
      setRoute(parse());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

export function useDebounce(value, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage blocked */
    }
  }, [key, value]);
  return [value, setValue];
}

// Fetch helper with loading/error state and request cancellation.
export function useAsync(fn, deps) {
  const [state, setState] = useState({ loading: true, error: null, data: null });
  const run = useCallback(fn, deps); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    run(ctrl.signal)
      .then((data) => setState({ loading: false, error: null, data }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ loading: false, error, data: null });
      });
    return () => ctrl.abort();
  }, [run]);
  return state;
}
