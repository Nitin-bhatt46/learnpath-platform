"use client";

import { useState, useEffect } from "react";
import type { Concept } from "@/lib/content";

export function ConceptView({ concept, imageUrl }: { concept: Concept; imageUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);

  // Keyboard shortcut: Escape to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setScale(1); // Reset scale on open
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 4));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => setScale(1);
  const handleDoubleClick = () => setScale((prev) => (prev === 1 ? 2 : 1));

  return (
    <section className="space-y-6 max-w-[800px] mx-auto w-full">
      {/* Textbook Figure Image Container */}
      <div className="flex flex-col items-center justify-center w-full bg-card-bg rounded-xl border border-border-color p-3 sm:p-5 shadow-3xs relative overflow-hidden group">
        <div className="relative w-full flex justify-center items-center">
          <img
            src={imageUrl}
            alt={concept.title}
            onClick={() => setIsOpen(true)}
            className="max-w-full h-auto max-h-[300px] sm:max-h-[400px] object-contain cursor-zoom-in transition-all duration-300 hover:scale-[1.01] rounded"
          />
        </div>

        {/* Action badge under the diagram */}
        <div
          onClick={() => setIsOpen(true)}
          className="mt-2.5 flex items-center gap-1.5 cursor-pointer text-[10px] font-bold uppercase tracking-wider text-text-muted hover:text-primary transition-colors duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
          <span>Expand Diagram Mode</span>
        </div>
      </div>

      {/* Learning Details */}
      <div className="space-y-5 text-sm leading-6 text-text-muted">
        <div>
          <span className="rounded bg-accent/40 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-accent-text border border-primary/10">
            Core idea
          </span>
          <h1 className="mt-2 text-2xl font-display font-bold text-text-main leading-snug">{concept.title}</h1>
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-text-main/90">{concept.content.explanation}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border-color bg-card-bg p-4 shadow-3xs">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider text-text-muted mb-1.5">Example</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-text-muted">{concept.content.example}</p>
          </div>
          <div className="rounded-xl border border-border-color bg-card-bg p-4 shadow-3xs">
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider text-text-muted mb-1.5">Analogy</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-text-muted">{concept.content.analogy}</p>
          </div>
        </div>

        <div className="rounded-xl border border-primary/35 bg-accent/10 p-4 text-text-main shadow-3xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Key takeaway</h3>
          <p className="text-xs sm:text-sm leading-relaxed">{concept.content.keyTakeaway}</p>
        </div>
      </div>

      {/* Fullscreen Interactive Diagram Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-fadeIn">
          {/* Top Control Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fullscreen Diagram Mode</p>
              <h2 className="text-sm font-bold text-white">{concept.title}</h2>
            </div>
            
            {/* Toolbar Buttons */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
                <button
                  onClick={zoomOut}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"
                  title="Zoom Out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
                  </svg>
                </button>
                <span className="text-white text-xs font-semibold px-2 min-w-[3rem] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"
                  title="Zoom In"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                  </svg>
                </button>
              </div>

              <button
                onClick={resetZoom}
                className="p-2 text-slate-400 hover:text-white rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                title="Reset Zoom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Zoomable Image Container */}
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
            className="flex-1 w-full h-full overflow-auto flex items-center justify-center p-6 cursor-zoom-out"
          >
            <div className="relative flex items-center justify-center min-w-full min-h-full">
              <img
                src={imageUrl}
                alt={concept.title}
                onDoubleClick={handleDoubleClick}
                style={{
                  transform: `scale(${scale})`,
                  transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  maxHeight: "80vh",
                  maxWidth: "90vw",
                  objectFit: "contain"
                }}
                className="select-none rounded shadow-2xl bg-slate-950 border border-white/5 cursor-zoom-in"
              />
            </div>
          </div>

          {/* Quick Help Footer */}
          <div className="py-2 text-center text-[10px] text-slate-500 bg-black/40 border-t border-white/5 select-none">
            Tip: Double-click diagram to quick-zoom. Scroll / drag scrollbar to pan around.
          </div>
        </div>
      )}
    </section>
  );
}
