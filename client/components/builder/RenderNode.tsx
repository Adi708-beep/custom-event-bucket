import { BuilderNode } from "./types";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";

type SetNodes = (updater: (prev: BuilderNode[]) => BuilderNode[] | BuilderNode[]) => void;

function updatePropsInTree(prev: BuilderNode[], id: string, patch: Record<string, any>): BuilderNode[] {
  return prev.map((n) => {
    if (n.id === id) {
      return { ...n, props: { ...n.props, ...patch } };
    }
    if (n.children) {
      return { ...n, children: updatePropsInTree(n.children, id, patch) };
    }
    return n;
  });
}

function widthStyleFor(node: BuilderNode) {
  const w = node.props?.width || "full";
  if (w === "full") return "100%";
  if (w === "3/4") return "75%";
  if (w === "2/3") return "66.666%";
  if (w === "1/2") return "50%";
  if (w === "custom") return (node.props?.customWidth ? `${node.props.customWidth}px` : "800px");
  return "100%";
}

function EditableText({ id, value, className, tag: Tag = "div", onCommit, style }: { id: string; value: string; className?: string; tag?: any; onCommit: (s: string) => void; style?: React.CSSProperties }) {
  const ref = useRef<HTMLElement | null>(null);
  const [text, setText] = useState(value || "");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!editing) setText(value || "");
  }, [value, editing]);

  return (
    <Tag
      ref={(r: any) => (ref.current = r)}
      data-editable-id={id}
      tabIndex={0}
      className={className}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setEditing(true)}
      onBlur={(e) => {
        setEditing(false);
        const v = e.currentTarget.textContent || "";
        setText(v);
        onCommit(v);
      }}
      onInput={(e) => {
        setText(e.currentTarget.textContent || "");
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          // revert
          setText(value || "");
          (ref.current as any).textContent = value || "";
          (ref.current as any).blur();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          // commit
          const v = (ref.current as any).textContent || "";
          onCommit(v);
          (ref.current as any).blur();
        }
      }}
    >
      {text}
    </Tag>
  );
}

export function RenderNode({ node, setNodes }: { node: BuilderNode; setNodes?: SetNodes }) {
  const apply = (patch: Record<string, any>) => {
    if (!setNodes) return;
    setNodes((prev) => updatePropsInTree(prev, node.id, patch));
  };

  const wrapperClasses = `${node.props?.frame ? "border p-4 rounded-md" : ""}`;
  const maxW = widthStyleFor(node);

  const commonStyle: React.CSSProperties = {
    transform: node.props?.rotate ? `rotate(${node.props.rotate}deg)` : undefined,
    position: node.props?.absolute ? 'absolute' : undefined,
    left: node.props?.absolute ? node.props.left ?? undefined : undefined,
    top: node.props?.absolute ? node.props.top ?? undefined : undefined,
  } as any;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div data-node-id={node.id} className={`mx-auto ${wrapperClasses}`} style={{ maxWidth: maxW, position: node.props?.absolute ? 'relative' : undefined }}>
      {children}
    </div>
  );

  switch (node.type) {
    case "section": {
      const { paddingY = "py-12", background = "bg-white", align = "items-start" } = node.props || {};
      return (
        <section className={`${background}`}>
          <div className={`container mx-auto ${paddingY} flex flex-col ${align} gap-4`}>
            {node.children?.map((c) => (
              <RenderNode key={c.id} node={c} setNodes={setNodes} />
            ))}
          </div>
        </section>
      );
    }
    case "heading": {
      const { text = "Heading", level = 2, align = "left" } = node.props || {};
      const Tag = (level >= 1 && level <= 6 ? (`h${level}` as keyof JSX.IntrinsicElements) : "h2");
      const alignCls = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
      return (
        <Wrapper>
          <EditableText id={node.id} value={text} tag={Tag} className={`font-extrabold tracking-tight ${alignCls} ${level === 1 ? "text-4xl md:text-6xl" : level === 2 ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`} style={{ ...(node.props?.fontSize ? { fontSize: typeof node.props.fontSize === 'number' ? `${node.props.fontSize}px` : node.props.fontSize } : {}), ...(node.props?.fontWeight ? { fontWeight: node.props.fontWeight } : {}), ...(node.props?.color ? { color: node.props.color } : {}), ...commonStyle }} onCommit={(v) => apply({ text: v.trim() })} />
        </Wrapper>
      );
    }
    case "paragraph": {
      const { text = "", align = "left" } = node.props || {};
      const alignCls = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
      return (
        <Wrapper>
          <EditableText id={node.id} value={text} tag="p" className={`text-muted-foreground leading-relaxed ${alignCls} max-w-3xl`} style={{ ...(node.props?.fontSize ? { fontSize: typeof node.props.fontSize === 'number' ? `${node.props.fontSize}px` : node.props.fontSize } : {}), ...(node.props?.fontWeight ? { fontWeight: node.props.fontWeight } : {}), ...(node.props?.color ? { color: node.props.color } : {}), ...commonStyle }} onCommit={(v) => apply({ text: v })} />
        </Wrapper>
      );
    }
    case "button": {
      const { label = "Button", href = "#" } = node.props || {};
      return (
        <Wrapper>
          <div>
            <Button asChild>
              <a data-editable-id={node.id} tabIndex={0} href={href}>
                <EditableText id={node.id} value={label} tag="span" onCommit={(v) => apply({ label: v })} />
              </a>
            </Button>
          </div>
        </Wrapper>
      );
    }
    case "image": {
      const { src = "/placeholder.svg", alt = "" } = node.props || {};
      return (
        <Wrapper>
          <img src={src} alt={alt} className="rounded-lg border object-cover w-full" />
        </Wrapper>
      );
    }
    case "two-column": {
      const { gap = "gap-8" } = node.props || {};
      const [left, right] = node.children || [];
      return (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${gap}`}>
          <div className="flex flex-col gap-4">{left && <RenderNode node={left} setNodes={setNodes} />}</div>
          <div className="flex flex-col gap-4">{right && <RenderNode node={right} setNodes={setNodes} />}</div>
        </div>
      );
    }
    case "schedule": {
      const { items = [] } = node.props || {};
      return (
        <Wrapper>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <tbody>
                {items.map((it: any, i: number) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-muted/50"}>
                    <td className="px-4 py-3 font-medium text-foreground w-24 whitespace-nowrap">{it.time}</td>
                    <td className="px-4 py-3">{it.title}</td>
                    <td className="px-4 py-3 text-muted-foreground w-40 whitespace-nowrap">{it.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Wrapper>
      );
    }
    case "speaker": {
      const { name = "Guest Name", role = "", photo = "/placeholder.svg" } = node.props || {};
      return (
        <Wrapper>
          <div className="flex items-center gap-4">
            <img src={photo} alt={name} className="h-16 w-16 rounded-full border object-cover" />
            <div>
              <EditableText id={node.id} value={name} tag="div" className="font-medium" style={{ ...(node.props?.fontSize ? { fontSize: typeof node.props.fontSize === 'number' ? `${node.props.fontSize}px` : node.props.fontSize } : {}), ...(node.props?.fontWeight ? { fontWeight: node.props.fontWeight } : {}), ...(node.props?.color ? { color: node.props.color } : {}), ...commonStyle }} onCommit={(v) => apply({ name: v })} />
              <EditableText id={`${node.id}_role`} value={role} tag="div" className="text-sm text-muted-foreground" style={{ ...(node.props?.fontSize ? { fontSize: typeof node.props.fontSize === 'number' ? `${node.props.fontSize}px` : node.props.fontSize } : {}), ...(node.props?.fontWeight ? { fontWeight: node.props.fontWeight } : {}), ...(node.props?.color ? { color: node.props.color } : {}), ...commonStyle }} onCommit={(v) => apply({ role: v })} />
            </div>
          </div>
        </Wrapper>
      );
    }
    default:
      return null;
  }
}
