import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/builder/Sidebar";
import LayersPanel from "@/components/builder/LayersPanel";
import TextToolbar from "@/components/builder/TextToolbar";
import Canvas from "@/components/builder/Canvas";
import Inspector from "@/components/builder/Inspector";
import { blockSpecs } from "@/components/builder/blocks";
import { BuilderNode, NodeID } from "@/components/builder/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ThemePicker, { palettes, applyPalette } from "@/components/builder/ThemePicker";

const STORAGE_KEY = "eventbucket:page";

function sampleEventTemplate(): BuilderNode[] {
  const sectionHero = blockSpecs.find((b) => b.type === "section")!.defaultNode();
  sectionHero.props = {
    paddingY: "py-20",
    background: "bg-gradient-to-br from-primary/10 to-fuchsia-200/40",
    align: "items-center",
  };
  sectionHero.children = [
    { id: `${sectionHero.id}_h1`, type: "heading", props: { text: "EVENT BUCKET Presents: Campus Fest 2025", level: 1, align: "center" } },
    { id: `${sectionHero.id}_p1`, type: "paragraph", props: { text: "A week of innovation, culture, and community. Join workshops, talks, and celebrations across campus.", align: "center" } },
    { id: `${sectionHero.id}_b1`, type: "button", props: { label: "Register Now", href: "#register" } },
  ];

  const sectionSchedule = blockSpecs.find((b) => b.type === "section")!.defaultNode();
  sectionSchedule.children = [
    { id: `${sectionSchedule.id}_h2`, type: "heading", props: { text: "Schedule", level: 2 } },
    blockSpecs.find((b) => b.type === "schedule")!.defaultNode(),
  ];

  const sectionSpeakers = blockSpecs.find((b) => b.type === "section")!.defaultNode();
  sectionSpeakers.children = [
    { id: `${sectionSpeakers.id}_h2`, type: "heading", props: { text: "Speakers", level: 2 } },
    { id: `${sectionSpeakers.id}_c1`, type: "two-column", props: { gap: "gap-8" }, children: [
      { id: `${sectionSpeakers.id}_s1`, type: "speaker", props: { name: "Alex Kumar", role: "Keynote", photo: "/placeholder.svg" } },
      { id: `${sectionSpeakers.id}_s2`, type: "speaker", props: { name: "Priya Shah", role: "Panelist", photo: "/placeholder.svg" } },
    ] },
  ];

  return [sectionHero, sectionSchedule, sectionSpeakers];
}

export default function Index() {
  const [nodes, setNodes] = useState<BuilderNode[]>([]);
  const [selectedId, setSelectedId] = useState<NodeID | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as BuilderNode[];
        setNodes(parsed);
        return;
      } catch {}
    }
    setNodes(sampleEventTemplate());

    // load theme
    const theme = localStorage.getItem('eventbucket:theme');
    if (theme) {
      const p = palettes.find((x)=> x.id === theme);
      if (p) applyPalette(p);
    }
  }, []);

  const doSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
    const theme = localStorage.getItem('eventbucket:theme') || palettes[0].id;
    localStorage.setItem('eventbucket:theme', theme);
    toast.success("Page saved");
  };
  const doLoad = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return toast.error("No saved page found");
    try {
      setNodes(JSON.parse(saved));
      toast.success("Loaded saved page");
    } catch {
      toast.error("Failed to load saved page");
    }
  };
  const doNew = () => {
    setNodes(sampleEventTemplate());
    setSelectedId(null);
  };
  const doExportJson = () => {
    const blob = new Blob([JSON.stringify(nodes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eventbucket-page.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {!isPreview && (
        <Sidebar onDragStartBlock={() => {}} />
      )}

      <div className="flex-1 flex flex-col">
        <div className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-14 items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Build your event page with drag & drop</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={doNew}>New</Button>
              <Button variant="outline" onClick={doLoad}>Load</Button>
              <Button variant="secondary" onClick={doSave}>Save</Button>
              <Button variant="outline" onClick={doExportJson}>Export JSON</Button>
              <Button onClick={() => setIsPreview((v) => !v)}>{isPreview ? "Exit Preview" : "Preview"}</Button>

              <div className="hidden md:flex items-center gap-2">
                <div className="relative">
                  <button className="rounded-md border bg-background px-3 py-2 text-sm" onClick={() => {
                    const t1 = sampleEventTemplate();
                    setNodes(t1);
                    toast.success("Loaded template: Campus Fest");
                  }}>Template: Campus</button>
                </div>
                <div className="relative">
                  <button className="rounded-md border bg-background px-3 py-2 text-sm" onClick={() => {
                    // simple alternative template
                    const nodes = [
                      blockSpecs.find((b)=> b.type === 'section')!.defaultNode(),
                      blockSpecs.find((b)=> b.type === 'section')!.defaultNode(),
                    ];
                    nodes[0].children = [
                      { id: `${nodes[0].id}_h`, type: 'heading', props: { text: 'Club Meet 2025', level: 1, align: 'center' } },
                      { id: `${nodes[0].id}_p`, type: 'paragraph', props: { text: 'Join your campus club for a meetup and fun activities.', align: 'center' } }
                    ];
                    nodes[1].children = [ { id: `${nodes[1].id}_h2`, type: 'heading', props: { text: 'Workshops', level: 2 } } ];
                    setNodes(nodes);
                    toast.success('Loaded template: Club Meet');
                  }}>Template: Club</button>
                </div>
                <div className="relative">
                  <button className="rounded-md border bg-background px-3 py-2 text-sm" onClick={() => {
                    // speaker focused
                    const s = blockSpecs.find((b)=> b.type === 'section')!.defaultNode();
                    s.children = [ { id: `${s.id}_h`, type: 'heading', props: { text: 'Speakers Lineup', level: 1 } }, blockSpecs.find((b)=> b.type === 'speaker')!.defaultNode() ];
                    setNodes([s]);
                    toast.success('Loaded template: Speakers');
                  }}>Template: Speakers</button>
                </div>

                <ThemePicker onApply={(id)=> toast.success(`Applied theme ${id}`)} />
              </div>

            </div>
          </div>
        </div>

        <div className="bg-secondary/5 border-b p-4">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">
              Tip: Drag blocks from the left into the canvas. Click a block to edit on the right. Use Save to persist in your browser.
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => { setNodes(sampleEventTemplate()); setSelectedId(null); }}>Load Template</Button>
              <Button onClick={() => { navigator.clipboard?.writeText(location.href); toast.success("Shareable link copied"); }}>Copy Share Link</Button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <Canvas
            nodes={nodes}
            setNodes={(updater) =>
              setNodes((prev) => (typeof updater === "function" ? (updater as any)(prev) : updater))
            }
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            isPreview={isPreview}
          />
        </div>
      </div>

      {!isPreview && (
        <Inspector nodes={nodes} setNodes={(updater) => setNodes((prev) => (typeof updater === "function" ? (updater as any)(prev) : updater))} selectedId={selectedId} />
      )}
    </div>
  );
}
