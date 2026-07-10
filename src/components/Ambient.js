import React, { useEffect, useRef } from 'react';

/*
 * Radium ambient layer: a drifting aurora + grain backdrop and a
 * cursor-following spotlight. Both are CSS-driven; this component only
 * feeds the pointer position into CSS variables (throttled with rAF).
 * Visibility is gated to the dark theme entirely in CSS.
 */
function Ambient() {
  const spotRef = useRef(null);

  useEffect(() => {
    const el = spotRef.current;
    if (!el) return undefined;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${e.clientX}px`);
        el.style.setProperty('--my', `${e.clientY}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="app-bg" aria-hidden="true" />
      <div className="spotlight" ref={spotRef} aria-hidden="true" />
    </>
  );
}

export default Ambient;
