import { useMemo, useState } from "react";
import { blockSpecs } from "./blocks";
import { BuilderNode, NodeID } from "./types";
import { RenderNode } from "./RenderNode";
import { Button } from "@/components/ui/button";

const BLOCK_MIME = "application/x-block";
const NODE_MIME = "application/x-node";

function findSpec(type: string) {
  return blockSpecs.find((b) => b.type === type);
}

type CanvasProps = {
  nodes: BuilderNode[];
  setNodes: (
    updater: (prev: BuilderNode[]) => BuilderNode[] | BuilderNode[],
  ) => void;
  selectedId: NodeID | null;
  setSelectedId: (id: NodeID | null) => void;
  isPreview?: boolean;
};

export default function Canvas({
  nodes,
  setNodes,
  selectedId,
  setSelectedId,
  isPreview,
}: CanvasProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const onDropAt = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData(BLOCK_MIME);
    const movingId = e.dataTransfer.getData(NODE_MIME);

    if (blockType) {
      const spec = findSpec(blockType);
      if (!spec) return;
      const node = spec.defaultNode();
      setNodes((prev) => {
        const next = [...prev];
        next.splice(index, 0, node);
        return next;
      });
      setSelectedId(node.id);
      // focus editable after drop
      setTimeout(() => {
        const el = document.querySelector(
          `[data-editable-id="${node.id}"]`,
        ) as HTMLElement | null;
        if (el) {
          el.focus();
          try {
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          } catch {}
        }
      }, 50);
      setDragOverIndex(null);
      return;
    }

    if (movingId) {
      setNodes((prev) => {
        let next = [...prev];
        const fromIdx = next.findIndex((n) => n.id === movingId);
        if (fromIdx === -1) return prev;
        const [moved] = next.splice(fromIdx, 1);
        const adjIndex = index > fromIdx ? index - 1 : index;
        next.splice(adjIndex, 0, moved);
        return next;
      });
      setDragOverIndex(null);
      return;
    }
  };

  const handleInnerDropToSection = (sectionId: string, e: React.DragEvent) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData(BLOCK_MIME);
    const movingId = e.dataTransfer.getData(NODE_MIME);

    if (blockType) {
      const spec = findSpec(blockType);
      if (!spec) return;
      const node = spec.defaultNode();
      setNodes((prev) => {
        const idx = prev.findIndex((n) => n.id === sectionId);
        if (idx === -1) return prev;
        const section = prev[idx];
        const children = [...(section.children || [])];
        children.push(node);
        const updated: BuilderNode = { ...section, children };
        const next = [...prev];
        next[idx] = updated;
        return next;
      });
      setSelectedId(node.id);
      setTimeout(() => {
        const el = document.querySelector(
          `[data-editable-id="${node.id}"]`,
        ) as HTMLElement | null;
        if (el) {
          el.focus();
          try {
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          } catch {}
        }
      }, 50);
      return;
    }

    if (movingId) {
      setNodes((prev) => {
        const idx = prev.findIndex((n) => n.id === sectionId);
        if (idx === -1) return prev;
        const section = prev[idx];
        const children = [...(section.children || [])];
        const fromIdx = prev.findIndex((n) => n.id === movingId);
        if (fromIdx === -1) return prev;
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        children.push(moved);
        next[idx] = { ...section, children };
        return next;
      });
      return;
    }
  };

  const Outline = ({
    id,
    children,
  }: {
    id: string;
    children: React.ReactNode;
  }) => {
    const startResize = (e: React.MouseEvent) => {
      e.stopPropagation();
      const startX = e.clientX;
      const el = document.querySelector(
        `[data-node-id="${id}"]`,
      ) as HTMLElement | null;
      if (!el) return;
      const startWidth = el.getBoundingClientRect().width;
      const onMove = (ev: MouseEvent) => {
        const delta = ev.clientX - startX;
        const newW = Math.max(120, Math.round(startWidth + delta));
        setNodes((prev) =>
          prev.map((n) =>
            n.id === id
              ? {
                  ...n,
                  props: { ...n.props, width: "custom", customWidth: newW },
                }
              : n,
          ),
        );
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };

    return (
      <div
        draggable={!isPreview}
        onDragStart={(e) => {
          if (isPreview) return;
          e.dataTransfer.setData(NODE_MIME, id);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!isPreview) setSelectedId(id);
        }}
        className={`relative rounded-lg transition ring-offset-2 ${selectedId === id ? "ring-2 ring-primary" : "ring-0"}`}
      >
        {children}
        {selectedId === id && !isPreview && (
          <div
            onMouseDown={startResize}
            className="absolute -right-2 -bottom-2 z-20 h-4 w-4 bg-white border rounded-sm cursor-se-resize"
            title="Resize"
          />
        )}
      </div>
    );
  };

  const DropLine = ({ index }: { index: number }) => (
    <div
      onDragOver={(e) => {
        if (isPreview) return;
        e.preventDefault();
        setDragOverIndex(index);
      }}
      onDrop={(e) => onDropAt(index, e)}
      className={`h-5 transition ${dragOverIndex === index ? "bg-primary/20" : "bg-transparent"}`}
    />
  );

  return (
    <div
      className={`relative w-full overflow-auto ${isPreview ? "pointer-events-auto" : ""}`}
      onClick={() => !isPreview && setSelectedId(null)}
    >
      <div className="mx-auto w-full max-w-5xl p-6">
        {/* Top drop line */}
        {!isPreview && <DropLine index={0} />}

        {nodes.map((n, i) => (
          <div key={n.id} className="mb-4">
            <Outline id={n.id}>
              {/* Editor overlay */}
              {!isPreview && (
                <div className="absolute right-2 top-2 z-10 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNodes((prev) => {
                        const next = [...prev];
                        const at = next.findIndex((x) => x.id === n.id);
                        if (at === -1) return prev;
                        const clone = JSON.parse(
                          JSON.stringify(next[at]),
                        ) as BuilderNode;
                        clone.id = `${clone.id}_copy`;
                        next.splice(at + 1, 0, clone);
                        return next;
                      });
                    }}
                  >
                    Duplicate
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNodes((prev) => prev.filter((x) => x.id !== n.id));
                    }}
                  >
                    Delete
                  </Button>
                </div>
              )}

              {/* Inner drop area for sections */}
              {n.type === "section" ? (
                <div
                  onDragOver={(e) => {
                    if (isPreview) return;
                    e.preventDefault();
                  }}
                  onDrop={(e) => handleInnerDropToSection(n.id, e)}
                >
                  <RenderNode node={n} setNodes={setNodes} />
                  {!isPreview && (
                    <div className="mt-3 rounded-md border border-dashed bg-muted/40 p-3 text-center text-xs text-muted-foreground">
                      Drag items here to add inside this section
                    </div>
                  )}
                </div>
              ) : (
                <RenderNode node={n} setNodes={setNodes} />
              )}
            </Outline>
            {!isPreview && <DropLine index={i + 1} />}
          </div>
        ))}
      </div>
    </div>
  );
}
