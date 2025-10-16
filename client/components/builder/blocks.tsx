import { BlockType, BuilderNode } from "./types";

export type BlockSpec = {
  type: BlockType;
  title: string;
  description?: string;
  icon: (props: { className?: string }) => JSX.Element;
  defaultNode: () => BuilderNode;
};

const iconBox = (className?: string) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="4" y="4" width="16" height="16" rx="3" />
  </svg>
);
const iconText = (className?: string) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M4 7h16M4 12h10M4 17h8" />
  </svg>
);
const iconCols = (className?: string) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="4" width="8" height="16" rx="2" />
    <rect x="13" y="4" width="8" height="16" rx="2" />
  </svg>
);
const iconImage = (className?: string) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <circle cx="9" cy="9" r="2" />
    <path d="M21 16l-5-5-7 7" />
  </svg>
);
const iconCalendar = (className?: string) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="4" y="5" width="16" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M4 11h16" />
  </svg>
);
const iconUser = (className?: string) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0116 0" />
  </svg>
);
const iconButton = (className?: string) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="4" y="9" width="16" height="6" rx="3" />
  </svg>
);

let idCounter = 0;
const nid = () => `n_${Date.now().toString(36)}_${idCounter++}`;

export const blockSpecs: BlockSpec[] = [
  {
    type: "section",
    title: "Section",
    description: "Full-width container",
    icon: ({ className }) => iconBox(className),
    defaultNode: () => ({
      id: nid(),
      type: "section",
      props: {
        paddingY: "py-12",
        background: "bg-white",
        align: "items-start",
      },
      children: [],
    }),
  },
  {
    type: "heading",
    title: "Heading",
    icon: ({ className }) => iconText(className),
    defaultNode: () => ({
      id: nid(),
      type: "heading",
      props: { text: "Untitled Heading", level: 2, align: "left" },
    }),
  },
  {
    type: "paragraph",
    title: "Paragraph",
    icon: ({ className }) => iconText(className),
    defaultNode: () => ({
      id: nid(),
      type: "paragraph",
      props: {
        text: "Write something inspiring about your event.",
        align: "left",
      },
    }),
  },
  {
    type: "button",
    title: "Button",
    icon: ({ className }) => iconButton(className),
    defaultNode: () => ({
      id: nid(),
      type: "button",
      props: { label: "Register Now", href: "#" },
    }),
  },
  {
    type: "image",
    title: "Image",
    icon: ({ className }) => iconImage(className),
    defaultNode: () => ({
      id: nid(),
      type: "image",
      props: { src: "/placeholder.svg", alt: "Image" },
    }),
  },
  {
    type: "two-column",
    title: "Two Columns",
    icon: ({ className }) => iconCols(className),
    defaultNode: () => ({
      id: nid(),
      type: "two-column",
      props: { gap: "gap-8" },
      children: [
        {
          id: nid(),
          type: "paragraph",
          props: { text: "Left column content", align: "left" },
        },
        {
          id: nid(),
          type: "paragraph",
          props: { text: "Right column content", align: "left" },
        },
      ],
    }),
  },
  {
    type: "schedule",
    title: "Schedule",
    icon: ({ className }) => iconCalendar(className),
    defaultNode: () => ({
      id: nid(),
      type: "schedule",
      props: {
        items: [
          { time: "09:00", title: "Opening Ceremony", location: "Auditorium" },
          { time: "10:30", title: "Tech Talk: AI Campus", location: "Hall A" },
          { time: "13:00", title: "Hackathon Kickoff", location: "Lab 2" },
        ],
      },
    }),
  },
  {
    type: "speaker",
    title: "Speaker",
    icon: ({ className }) => iconUser(className),
    defaultNode: () => ({
      id: nid(),
      type: "speaker",
      props: { name: "Guest Name", role: "Keynote", photo: "/placeholder.svg" },
    }),
  },
];
