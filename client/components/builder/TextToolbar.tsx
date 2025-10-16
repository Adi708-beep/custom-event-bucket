import React from "react";

function exec(cmd: string) {
  try {
    document.execCommand(cmd);
  } catch (e) {}
}

export default function TextToolbar({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-md bg-white border p-2 shadow-md">
      <button className="px-2 py-1 text-sm" onMouseDown={(e) => { e.preventDefault(); exec('bold'); }}>Bold</button>
      <button className="px-2 py-1 text-sm" onMouseDown={(e) => { e.preventDefault(); exec('italic'); }}>Italic</button>
      <button className="px-2 py-1 text-sm" onMouseDown={(e) => { e.preventDefault(); exec('underline'); }}>Underline</button>
      <button className="px-2 py-1 text-sm" onMouseDown={(e) => { e.preventDefault(); const url = prompt('URL'); if (url) { try { document.execCommand('createLink', false, url); } catch {} } }}>Link</button>
    </div>
  );
}
