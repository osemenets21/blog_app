const consoleWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0].includes("findDOMNode is deprecated") ||
    args[0].includes("Listener added for a 'DOMNodeInserted'")
  ) {
    return;
  }
  consoleWarn(...args);
};