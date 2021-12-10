import { useState } from "react";

export function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function(mode, replace = false) {
    if (replace) {
      setMode((prev) => mode);

      const replaceHistory = [...history];
      replaceHistory[replaceHistory.length - 1] = mode;

      setHistory((prev) => replaceHistory);

    } else {
      setMode((prev) => mode);

      const newHistory = [...history];
      newHistory.push(mode);

      setHistory((prev) => newHistory);
    }
    setMode(mode);
  };

  const back = function(mode) {
    const newHistory = [...history];

    newHistory.pop(mode);
    setHistory((prev) => newHistory);

    if (history.length > 1) {
      setMode((prev) => newHistory[newHistory.length - 1])
    }
    setMode()
  };

  return { mode, transition, back };
}