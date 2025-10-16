import { blockSpecs } from "./blocks";

type SidebarProps = {
  onDragStartBlock: (type: string) => void;
};

export default function Sidebar({ onDragStartBlock }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 shrink-0 border-r bg-muted/30">
      <div className="p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Blocks
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
          {blockSpecs.map((b) => (
            <button
              key={b.type}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/x-block", b.type);
                onDragStartBlock(b.type);
              }}
              className="group flex items-center gap-3 rounded-md border bg-background p-3 text-left transition hover:shadow-sm hover:bg-white"
            >
              <b.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              <div>
                <div className="text-sm font-medium">{b.title}</div>
                {b.description && (
                  <div className="text-xs text-muted-foreground">
                    {b.description}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
