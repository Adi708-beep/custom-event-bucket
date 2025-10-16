export type BlockType =
  | "section"
  | "heading"
  | "paragraph"
  | "button"
  | "image"
  | "two-column"
  | "schedule"
  | "speaker";

export type NodeID = string;

export interface NodeBase {
  id: NodeID;
  type: BlockType;
  props: Record<string, any>;
  children?: BuilderNode[];
}

export type BuilderNode = NodeBase;
