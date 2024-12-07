import React from "react";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full flex items-center justify-between px-5 py-2 bg-violet-950 text-violet-300">
      <div className="flex items-center gap-3">
        <span className="text-sm">© 2021 OpinionX</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm">Powered by OpinionX</span>
      </div>
    </footer>
  );
};
