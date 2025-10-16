import { BuilderNode, NodeID } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type InspectorProps = {
  nodes: BuilderNode[];
  setNodes: (
    updater: (prev: BuilderNode[]) => BuilderNode[] | BuilderNode[],
  ) => void;
  selectedId: NodeID | null;
};

export default function Inspector({
  nodes,
  setNodes,
  selectedId,
}: InspectorProps) {
  const selected =
    nodes.find((n) => n.id === selectedId) ||
    nodes.flatMap((n) => n.children || []).find((n) => n.id === selectedId) ||
    null;

  const updateProps = (patch: Record<string, any>) => {
    setNodes((prev) => {
      const next = [...prev];
      const idx = next.findIndex((n) => n.id === selectedId);
      if (idx !== -1) {
        next[idx] = { ...next[idx], props: { ...next[idx].props, ...patch } };
        return next;
      }
      // check children of sections
      for (let i = 0; i < next.length; i++) {
        const n = next[i];
        if (n.children) {
          const cidx = n.children.findIndex((c) => c.id === selectedId);
          if (cidx !== -1) {
            const children = [...n.children];
            children[cidx] = {
              ...children[cidx],
              props: { ...children[cidx].props, ...patch },
            };
            next[i] = { ...n, children };
            return next;
          }
        }
      }
      return prev;
    });
  };

  if (!selected) {
    return (
      <aside className="hidden md:block w-80 shrink-0 border-l bg-muted/30 p-4">
        <div className="text-sm text-muted-foreground">
          Select a block to edit its properties
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden md:block w-80 shrink-0 border-l bg-muted/30 p-4">
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Inspector
        </div>
        <div className="text-lg font-semibold">{selected.type}</div>
      </div>

      <div className="mb-4 space-y-3">
        <div className="text-sm font-medium">Appearance</div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <input
              id="frameToggle"
              type="checkbox"
              checked={!!selected.props.frame}
              onChange={(e) => updateProps({ frame: e.target.checked })}
              className="h-4 w-4"
            />
            <label htmlFor="frameToggle" className="text-sm">
              Frame
            </label>
          </div>
          <div className="text-xs text-muted-foreground">
            Add border and padding
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Width</label>
          <div className="flex items-center gap-2">
            <select
              value={selected.props.width || "full"}
              onChange={(e) => updateProps({ width: e.target.value })}
              className="rounded-md border bg-background px-2 py-1 text-sm"
            >
              <option value="full">Full</option>
              <option value="3/4">3/4</option>
              <option value="2/3">2/3</option>
              <option value="1/2">1/2</option>
              <option value="custom">Custom (px)</option>
            </select>
            {selected.props.width === "custom" && (
              <Input
                type="number"
                value={selected.props.customWidth || 800}
                onChange={(e) =>
                  updateProps({ customWidth: Number(e.target.value) })
                }
                className="w-24"
              />
            )}
          </div>
        </div>
      </div>

      {selected.type === "section" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paddingY">Vertical padding</Label>
            <Select
              onValueChange={(v) => updateProps({ paddingY: v })}
              value={selected.props.paddingY}
            >
              <SelectTrigger id="paddingY">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="py-8">Compact</SelectItem>
                <SelectItem value="py-12">Comfortable</SelectItem>
                <SelectItem value="py-20">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="background">Background</Label>
            <Select
              onValueChange={(v) => updateProps({ background: v })}
              value={selected.props.background}
            >
              <SelectTrigger id="background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bg-white">White</SelectItem>
                <SelectItem value="bg-secondary/60">Subtle</SelectItem>
                <SelectItem value="bg-gradient-to-br from-primary/10 to-fuchsia-200/40">
                  Brand Gradient
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="align">Align</Label>
            <Select
              onValueChange={(v) => updateProps({ align: v })}
              value={selected.props.align}
            >
              <SelectTrigger id="align">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="items-start">Left</SelectItem>
                <SelectItem value="items-center">Center</SelectItem>
                <SelectItem value="items-end">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {selected.type === "heading" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Text</Label>
            <Input
              id="text"
              value={selected.props.text}
              onChange={(e) => updateProps({ text: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="size">Font size</Label>
              <Input
                id="size"
                type="number"
                value={selected.props.fontSize || 32}
                onChange={(e) =>
                  updateProps({ fontSize: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Select
                onValueChange={(v) => updateProps({ fontWeight: v })}
                value={String(selected.props.fontWeight || "700")}
              >
                <SelectTrigger id="weight">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="400">400</SelectItem>
                  <SelectItem value="600">600</SelectItem>
                  <SelectItem value="700">700</SelectItem>
                  <SelectItem value="800">800</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              type="color"
              value={selected.props.color || "#111827"}
              onChange={(e) => updateProps({ color: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select
              onValueChange={(v) => updateProps({ level: Number(v) })}
              value={String(selected.props.level)}
            >
              <SelectTrigger id="level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1</SelectItem>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alignH">Align</Label>
            <Select
              onValueChange={(v) => updateProps({ align: v })}
              value={selected.props.align ?? "left"}
            >
              <SelectTrigger id="alignH">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="rotate">Rotate (deg)</Label>
              <Input
                id="rotate"
                type="number"
                value={selected.props.rotate || 0}
                onChange={(e) =>
                  updateProps({ rotate: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Absolute</Label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!selected.props.absolute}
                  onChange={(e) => updateProps({ absolute: e.target.checked })}
                  className="h-4 w-4"
                />
                <span className="text-sm text-muted-foreground">
                  Enable absolute positioning
                </span>
              </div>
            </div>
          </div>

          {selected.props.absolute && (
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={selected.props.left || 0}
                onChange={(e) => updateProps({ left: Number(e.target.value) })}
              />
              <Input
                type="number"
                value={selected.props.top || 0}
                onChange={(e) => updateProps({ top: Number(e.target.value) })}
              />
            </div>
          )}
        </div>
      )}

      {selected.type === "paragraph" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="textP">Text</Label>
            <Input
              id="textP"
              value={selected.props.text}
              onChange={(e) => updateProps({ text: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alignP">Align</Label>
            <Select
              onValueChange={(v) => updateProps({ align: v })}
              value={selected.props.align ?? "left"}
            >
              <SelectTrigger id="alignP">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {selected.type === "button" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={selected.props.label}
              onChange={(e) => updateProps({ label: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="href">Link URL</Label>
            <Input
              id="href"
              value={selected.props.href}
              onChange={(e) => updateProps({ href: e.target.value })}
            />
          </div>
        </div>
      )}

      {selected.type === "image" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="src">Image URL</Label>
            <Input
              id="src"
              value={selected.props.src}
              onChange={(e) => updateProps({ src: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alt">Alt text</Label>
            <Input
              id="alt"
              value={selected.props.alt}
              onChange={(e) => updateProps({ alt: e.target.value })}
            />
          </div>
        </div>
      )}

      {selected.type === "two-column" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gap">Gap</Label>
            <Select
              onValueChange={(v) => updateProps({ gap: v })}
              value={selected.props.gap}
            >
              <SelectTrigger id="gap">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gap-4">Tight</SelectItem>
                <SelectItem value="gap-8">Comfort</SelectItem>
                <SelectItem value="gap-12">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {selected.type === "schedule" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Items (one per line: time | title | location)</Label>
            <textarea
              className="min-h-[160px] w-full rounded-md border bg-background p-2 text-sm"
              value={(selected.props.items || [])
                .map((it: any) => `${it.time} | ${it.title} | ${it.location}`)
                .join("\n")}
              onChange={(e) => {
                const items = e.target.value
                  .split(/\n+/)
                  .map((l) => l.trim())
                  .filter(Boolean)
                  .map((l) => {
                    const [time, title, location] = l
                      .split("|")
                      .map((s) => s.trim());
                    return { time, title, location };
                  });
                updateProps({ items });
              }}
            />
          </div>
        </div>
      )}

      {selected.type === "speaker" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={selected.props.name}
              onChange={(e) => updateProps({ name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={selected.props.role}
              onChange={(e) => updateProps({ role: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Photo URL</Label>
            <Input
              id="photo"
              value={selected.props.photo}
              onChange={(e) => updateProps({ photo: e.target.value })}
            />
          </div>
        </div>
      )}

      <div className="pt-6">
        <Button
          variant="outline"
          onClick={() => {
            // simple normalize call to trigger state update
            setNodes((prev) => [...prev]);
          }}
        >
          Apply Changes
        </Button>
      </div>
    </aside>
  );
}
