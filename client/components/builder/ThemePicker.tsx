import React from "react";

export const palettes = [
  {
    id: "violet",
    name: "Violet",
    vars: {
      "--primary": "265 83% 57%",
      "--primary-foreground": "0 0% 100%",
      "--accent": "280 100% 96%",
      "--accent-foreground": "265 83% 20%",
    },
  },
  {
    id: "teal",
    name: "Teal",
    vars: {
      "--primary": "174 67% 50%",
      "--primary-foreground": "0 0% 100%",
      "--accent": "200 80% 90%",
      "--accent-foreground": "174 67% 25%",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    vars: {
      "--primary": "14 85% 60%",
      "--primary-foreground": "0 0% 100%",
      "--accent": "340 80% 90%",
      "--accent-foreground": "14 85% 30%",
    },
  },
];

export function applyPalette(p: (typeof palettes)[0]) {
  const root = document.documentElement;
  Object.entries(p.vars).forEach(([k, v]) => {
    root.style.setProperty(k, v);
  });
  localStorage.setItem("eventbucket:theme", p.id);
}

export default function ThemePicker({
  onApply,
}: {
  onApply?: (id: string) => void;
}) {
  return (
    <div className="p-3">
      <div className="text-xs font-semibold text-muted-foreground mb-2">
        Themes
      </div>
      <div className="flex gap-2">
        {palettes.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              applyPalette(p);
              onApply?.(p.id);
            }}
            className="flex items-center gap-2 rounded-md border p-2"
          >
            <div className="h-6 w-10 rounded-sm bg-gradient-to-r from-primary to-fuchsia-500" />
            <div className="text-sm">{p.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
