import React from "react";
import { BuilderNode } from "./types";

export default function LayersPanel({
  nodes,
  selectedId,
  setSelectedId,
  setNodes,
}: {
  nodes: BuilderNode[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  setNodes: (
    updater: (prev: BuilderNode[]) => BuilderNode[] | BuilderNode[],
  ) => void;
}) {
  const renderNode = (n: BuilderNode, depth = 0) => (
    <div
      key={n.id}
      className={`flex items-center justify-between gap-2 py-1 px-2 hover:bg-muted/20 rounded ${selectedId === n.id ? "bg-muted/20" : ""}`}
    >
      <div className="flex items-center gap-2">
        <div className="text-xs text-muted-foreground">
          {Array(depth).fill("—").join("")}
        </div>
        <button
          className="text-sm text-foreground text-left"
          onClick={() => setSelectedId(n.id)}
        >
          {n.type}
        </button>
      </div>
      <div className="flex items-center gap-1">
        <button
          className="text-xs px-2 py-1 rounded border"
          onClick={(e) => {
            e.stopPropagation();
            setNodes((prev) => {
              const next = [...prev];
              const idx = next.findIndex((x) => x.id === n.id);
              if (idx > -1 && idx > 0) {
                const tmp = next[idx - 1];
                next[idx - 1] = next[idx];
                next[idx] = tmp;
              }
              return next;
            });
          }}
        >
          ▲
        </button>
        <button
          className="text-xs px-2 py-1 rounded border"
          onClick={(e) => {
            e.stopPropagation();
            setNodes((prev) => {
              const next = [...prev];
              const idx = next.findIndex((x) => x.id === n.id);
              if (idx > -1 && idx < next.length - 1) {
                const tmp = next[idx + 1];
                next[idx + 1] = next[idx];
                next[idx] = tmp;
              }
              return next;
            });
          }}
        >
          ▼
        </button>
      </div>
    </div>
  );

  return (
    <aside className="hidden md:block w-56 shrink-0 border-r bg-background/50">
      <div className="p-3">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
          Layers
        </h3>
        <div className="space-y-1">
          {nodes.map((n) => (
            <div key={n.id}>
              {renderNode(n, 0)}
              {n.children &&
                n.children.map((c) => (
                  <div key={c.id} className="ml-4">
                    {renderNode(c, 1)}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
