import { BuilderNode } from "./types";
import { Button } from "@/components/ui/button";
import React from "react";

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

export function RenderNode({ node, setNodes }: { node: BuilderNode; setNodes?: SetNodes }) {
  const apply = (patch: Record<string, any>) => {
    if (!setNodes) return;
    setNodes((prev) => updatePropsInTree(prev, node.id, patch));
  };

  const wrapperClasses = `${node.props?.frame ? "border p-4 rounded-md" : ""}`;
  const maxW = widthStyleFor(node);

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div data-node-id={node.id} className={`mx-auto ${wrapperClasses}`} style={{ maxWidth: maxW }}>
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
          <Tag
            data-editable-id={node.id}
            tabIndex={0}
            className={`font-extrabold tracking-tight ${alignCls} ${level === 1 ? "text-4xl md:text-6xl" : level === 2 ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`}
            contentEditable={!!setNodes}
            suppressContentEditableWarning
            onInput={(e) => apply({ text: (e.currentTarget.textContent || "").trim() })}
          >
            {text}
          </Tag>
        </Wrapper>
      );
    }
    case "paragraph": {
      const { text = "", align = "left" } = node.props || {};
      const alignCls = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
      return (
        <Wrapper>
          <p
            data-editable-id={node.id}
            tabIndex={0}
            className={`text-muted-foreground leading-relaxed ${alignCls} max-w-3xl`}
            contentEditable={!!setNodes}
            suppressContentEditableWarning
            onInput={(e) => apply({ text: e.currentTarget.textContent || "" })}
          >
            {text}
          </p>
        </Wrapper>
      );
    }
    case "button": {
      const { label = "Button", href = "#" } = node.props || {};
      return (
        <Wrapper>
          <div>
            <Button asChild>
              <a data-editable-id={node.id} tabIndex={0} href={href} contentEditable={!!setNodes} suppressContentEditableWarning onInput={(e) => apply({ label: e.currentTarget.textContent || "" })}>
                {label}
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
              <div className="font-medium" data-editable-id={node.id} tabIndex={0} contentEditable={!!setNodes} suppressContentEditableWarning onInput={(e) => apply({ name: e.currentTarget.textContent || "" })}>
                {name}
              </div>
              <div className="text-sm text-muted-foreground" data-editable-id={`${node.id}_role`} tabIndex={0} contentEditable={!!setNodes} suppressContentEditableWarning onInput={(e) => apply({ role: e.currentTarget.textContent || "" })}>
                {role}
              </div>
            </div>
          </div>
        </Wrapper>
      );
    }
    default:
      return null;
  }
}
