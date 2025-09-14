try {
  for (const a of document.querySelectorAll("a")) {
    a.style.outline = "2px solid #ec0089";
    a.style.outlineOffset = "2px";
  }
} catch (_) {}
