import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Ambulance,
  ArrowRight,
  CarFront,
  Clock3,
  Gauge,
  LocateFixed,
  Play,
  Radio,
  RotateCcw,
  RouteIcon,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NodeId = "A" | "B" | "C" | "D" | "E" | "F";
type TrafficLevel = "low" | "medium" | "high";
type EdgeId = "AB" | "BC" | "AD" | "BE" | "CF" | "DE" | "EF" | "BF";

type Edge = {
  id: EdgeId;
  from: NodeId;
  to: NodeId;
  base: number;
  path: string;
  labelX: number;
  labelY: number;
};

const nodes: Record<NodeId, { x: number; y: number; name: string }> = {
  A: { x: 92, y: 92, name: "North Gate" },
  B: { x: 280, y: 92, name: "Civic Square" },
  C: { x: 468, y: 92, name: "Tech Park" },
  D: { x: 92, y: 286, name: "Medical District" },
  E: { x: 280, y: 286, name: "Central Hub" },
  F: { x: 468, y: 286, name: "East Terminal" },
};

const edges: Edge[] = [
  { id: "AB", from: "A", to: "B", base: 3, path: "M 92 92 L 280 92", labelX: 186, labelY: 78 },
  { id: "BC", from: "B", to: "C", base: 3, path: "M 280 92 L 468 92", labelX: 374, labelY: 78 },
  { id: "AD", from: "A", to: "D", base: 4, path: "M 92 92 L 92 286", labelX: 70, labelY: 189 },
  { id: "BE", from: "B", to: "E", base: 2, path: "M 280 92 L 280 286", labelX: 258, labelY: 189 },
  { id: "CF", from: "C", to: "F", base: 4, path: "M 468 92 L 468 286", labelX: 490, labelY: 189 },
  { id: "DE", from: "D", to: "E", base: 3, path: "M 92 286 L 280 286", labelX: 186, labelY: 310 },
  { id: "EF", from: "E", to: "F", base: 3, path: "M 280 286 L 468 286", labelX: 374, labelY: 310 },
  { id: "BF", from: "B", to: "F", base: 5, path: "M 280 92 Q 414 178 468 286", labelX: 394, labelY: 180 },
];

const initialTraffic: Record<EdgeId, TrafficLevel> = {
  AB: "low",
  BC: "high",
  AD: "medium",
  BE: "low",
  CF: "medium",
  DE: "low",
  EF: "medium",
  BF: "low",
};

const multipliers: Record<TrafficLevel, number> = { low: 1, medium: 1.8, high: 3 };
const levels: TrafficLevel[] = ["low", "medium", "high"];

function edgeWeight(edge: Edge, traffic: Record<EdgeId, TrafficLevel>) {
  return Math.round(edge.base * multipliers[traffic[edge.id]]);
}

function calculateRoute(source: NodeId, destination: NodeId, traffic: Record<EdgeId, TrafficLevel>) {
  const ids = Object.keys(nodes) as NodeId[];
  const distances = Object.fromEntries(ids.map((id) => [id, Number.POSITIVE_INFINITY])) as Record<NodeId, number>;
  const hops = Object.fromEntries(ids.map((id) => [id, Number.POSITIVE_INFINITY])) as Record<NodeId, number>;
  const previous: Partial<Record<NodeId, NodeId>> = {};
  const visited = new Set<NodeId>();
  distances[source] = 0;
  hops[source] = 0;

  while (visited.size < ids.length) {
    const current = ids
      .filter((id) => !visited.has(id))
      .sort((a, b) => distances[a] - distances[b] || hops[a] - hops[b] || a.localeCompare(b))[0];
    if (!current || !Number.isFinite(distances[current]) || current === destination) break;
    visited.add(current);

    edges
      .filter((edge) => edge.from === current || edge.to === current)
      .forEach((edge) => {
        const neighbor = edge.from === current ? edge.to : edge.from;
        const candidate = distances[current] + edgeWeight(edge, traffic);
        const candidateHops = hops[current] + 1;
        if (candidate < distances[neighbor] || (candidate === distances[neighbor] && candidateHops < hops[neighbor])) {
          distances[neighbor] = candidate;
          hops[neighbor] = candidateHops;
          previous[neighbor] = current;
        }
      });
  }

  const path: NodeId[] = [];
  let cursor: NodeId | undefined = destination;
  while (cursor) {
    path.unshift(cursor);
    if (cursor === source) break;
    cursor = previous[cursor];
  }
  return { path: path[0] === source ? path : [], total: distances[destination] };
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlowGrid — Smart Traffic Control Center" },
      { name: "description", content: "Live smart-city traffic simulation with Dijkstra route optimization and emergency signal priority." },
      { property: "og:title", content: "FlowGrid — Smart Traffic Control Center" },
      { property: "og:description", content: "Explore live traffic, calculate fastest routes, and activate an emergency green corridor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SmartCityDemo,
});

function SmartCityDemo() {
  const [traffic, setTraffic] = useState(initialTraffic);
  const [source, setSource] = useState<NodeId>("A");
  const [destination, setDestination] = useState<NodeId>("F");
  const [live, setLive] = useState(true);
  const [emergency, setEmergency] = useState(false);
  const [tick, setTick] = useState(42);
  const [updated, setUpdated] = useState(0);
  const route = useMemo(() => calculateRoute(source, destination, traffic), [source, destination, traffic]);
  const routeEdges = useMemo(() => {
    const active = new Set<EdgeId>();
    for (let index = 0; index < route.path.length - 1; index += 1) {
      const edge = edges.find((item) =>
        (item.from === route.path[index] && item.to === route.path[index + 1]) ||
        (item.to === route.path[index] && item.from === route.path[index + 1]),
      );
      if (edge) active.add(edge.id);
    }
    return active;
  }, [route.path]);
  const routeSvgPath = route.path
    .map((id, index) => `${index === 0 ? "M" : "L"} ${nodes[id].x} ${nodes[id].y}`)
    .join(" ");

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => (value <= 1 ? 45 : value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!live || emergency) return;
    const timer = window.setInterval(() => {
      setTraffic((current) => {
        const edge = edges[Math.floor(Math.random() * edges.length)];
        if (!edge) return current;
        const currentIndex = levels.indexOf(current[edge.id]);
        const direction = Math.random() > 0.5 ? 1 : -1;
        const nextIndex = Math.max(0, Math.min(levels.length - 1, currentIndex + direction));
        return { ...current, [edge.id]: levels[nextIndex] };
      });
      setUpdated((value) => value + 1);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [live, emergency]);

  function cycleTraffic(edgeId: EdgeId) {
    setTraffic((current) => ({
      ...current,
      [edgeId]: levels[(levels.indexOf(current[edgeId]) + 1) % levels.length],
    }));
    setUpdated((value) => value + 1);
  }

  function resetDemo() {
    setTraffic(initialTraffic);
    setSource("A");
    setDestination("F");
    setEmergency(false);
    setLive(true);
    setUpdated(0);
  }

  const congested = Object.values(traffic).filter((level) => level === "high").length;
  const efficiency = Math.max(74, 96 - congested * 4);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface/95 px-4 py-3 backdrop-blur-xl sm:px-7">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground shadow-signal">
              <LocateFixed className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold">FLOWGRID</span>
                <span className="rounded-sm border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary">CITY OS</span>
              </div>
              <p className="hidden text-xs text-muted-foreground sm:block">Intelligent traffic orchestration</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
              <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-70" /><span className="relative inline-flex size-2 rounded-full bg-success" /></span>
              All systems operational
            </div>
            <Button variant="outline" size="sm" onClick={resetDemo} aria-label="Reset simulation">
              <RotateCcw /> <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-grid px-4 py-7 sm:px-7">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              <Radio className="size-3.5" /> Live urban mobility network
            </div>
            <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight sm:text-5xl">Smart Traffic Control Center</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Monitor changing road conditions, calculate the fastest path with Dijkstra’s algorithm, and create an instant green corridor for emergency response.</p>
          </div>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border lg:min-w-[430px]">
            <Metric label="Network load" value={`${42 + congested * 7}%`} icon={<Activity />} />
            <Metric label="Flow efficiency" value={`${efficiency}%`} icon={<Gauge />} />
            <Metric label="Active roads" value="8 / 8" icon={<CarFront />} />
          </div>
        </div>
      </section>

      <section className="px-4 py-5 sm:px-7">
        <div className="mx-auto grid max-w-[1500px] gap-5 xl:grid-cols-[minmax(0,1fr)_370px]">
          <div className="overflow-hidden rounded-md border border-border bg-card shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
              <div>
                <div className="flex items-center gap-2"><h2 className="font-display font-semibold">Live Traffic Simulation</h2><span className="rounded-sm bg-success/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-success">LIVE</span></div>
                <p className="mt-0.5 text-xs text-muted-foreground">Select any road to cycle its traffic level</p>
              </div>
              <Button variant={live ? "default" : "outline"} size="sm" onClick={() => setLive((value) => !value)} disabled={emergency}>
                {live ? <Activity /> : <Play />} {live ? "Simulation running" : "Resume simulation"}
              </Button>
            </div>

            <div className="relative min-h-[430px] bg-map p-3 sm:p-6">
              <div className="absolute left-4 top-4 z-10 flex gap-3 rounded-md border border-border bg-surface/90 px-3 py-2 text-[10px] font-semibold uppercase text-muted-foreground backdrop-blur">
                {levels.map((level) => <span key={level} className="flex items-center gap-1.5"><i className={`traffic-dot traffic-${level}`} />{level}</span>)}
              </div>
              <svg viewBox="0 0 560 380" className="mx-auto h-full min-h-[390px] w-full max-w-4xl" role="img" aria-label="Interactive road network connecting six city junctions">
                <defs>
                  <filter id="route-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                {edges.map((edge) => {
                  const active = routeEdges.has(edge.id);
                  return (
                    <g key={edge.id} className="cursor-pointer" onClick={() => cycleTraffic(edge.id)} role="button" aria-label={`${edge.from} to ${edge.to}, ${traffic[edge.id]} traffic`}>
                      <path d={edge.path} className="road-base" />
                      <path d={edge.path} className={`road-flow road-${traffic[edge.id]} ${active ? (emergency ? "road-emergency" : "road-active") : ""}`} />
                      <g transform={`translate(${edge.labelX} ${edge.labelY})`}>
                        <rect x="-16" y="-10" width="32" height="20" rx="3" className="fill-surface stroke-border" />
                        <text textAnchor="middle" dominantBaseline="central" className="fill-foreground font-mono text-[10px] font-bold">{edgeWeight(edge, traffic)}m</text>
                      </g>
                    </g>
                  );
                })}
                {emergency && routeSvgPath ? (
                  <g className="ambulance-marker">
                    <circle r="15" className="fill-emergency stroke-emergency-foreground stroke-2" />
                    <text textAnchor="middle" dominantBaseline="central" className="text-[15px]">🚑</text>
                    <animateMotion dur="5s" repeatCount="indefinite" path={routeSvgPath} />
                  </g>
                ) : null}
                {(Object.keys(nodes) as NodeId[]).map((id) => {
                  const node = nodes[id];
                  const onRoute = route.path.includes(id);
                  return (
                    <g key={id} transform={`translate(${node.x} ${node.y})`}>
                      {onRoute && <circle r="29" className={emergency ? "node-halo-emergency" : "node-halo"} />}
                      <circle r="21" className={`stroke-2 ${onRoute ? "fill-primary stroke-primary-foreground" : "fill-surface stroke-border"}`} />
                      <text textAnchor="middle" dominantBaseline="central" className={`font-display text-sm font-bold ${onRoute ? "fill-primary-foreground" : "fill-foreground"}`}>{id}</text>
                      <text y="39" textAnchor="middle" className="fill-muted-foreground text-[9px] font-medium">{node.name}</text>
                    </g>
                  );
                })}
              </svg>
              <div className="absolute bottom-4 left-4 font-mono text-[10px] text-muted-foreground">UPDATE CYCLE {String(updated + 1).padStart(3, "0")} • WEIGHTS IN MINUTES</div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-md border border-border bg-card p-5 shadow-panel">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div><p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">Dijkstra engine</p><h2 className="mt-1 font-display text-xl font-semibold">Fastest Route</h2></div>
                <div className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary"><RouteIcon className="size-4" /></div>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                <NodeSelect label="Source" value={source} onChange={(value) => setSource(value)} disabledValue={destination} />
                <ArrowRight className="mb-2 size-4 text-muted-foreground" />
                <NodeSelect label="Destination" value={destination} onChange={(value) => setDestination(value)} disabledValue={source} />
              </div>
              <div className="mt-5 border-y border-border py-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Calculated path</span><span className="flex items-center gap-1 text-success"><Zap className="size-3" /> Recalculated live</span></div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {route.path.map((id, index) => <span key={id} className="contents"><span className="grid size-8 place-items-center rounded-sm bg-primary text-sm font-bold text-primary-foreground">{id}</span>{index < route.path.length - 1 && <ArrowRight className="size-3 text-primary" />}</span>)}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-md bg-secondary p-3"><p className="text-[10px] uppercase text-muted-foreground">Estimated time</p><p className="mt-1 font-display text-2xl font-bold">{route.total}<span className="ml-1 text-sm font-medium text-muted-foreground">min</span></p></div>
                <div className="rounded-md bg-secondary p-3"><p className="text-[10px] uppercase text-muted-foreground">Junctions</p><p className="mt-1 font-display text-2xl font-bold">{route.path.length}</p></div>
              </div>
            </div>

            <div className={`rounded-md border p-5 shadow-panel transition-colors ${emergency ? "border-emergency bg-emergency/5" : "border-border bg-card"}`}>
              <div className="flex items-center gap-3"><div className={`grid size-10 place-items-center rounded-md ${emergency ? "bg-emergency text-emergency-foreground animate-pulse" : "bg-secondary text-muted-foreground"}`}><Ambulance className="size-5" /></div><div><h2 className="font-display font-semibold">Emergency Vehicle Mode</h2><p className="text-xs text-muted-foreground">Priority signal override</p></div></div>
              {emergency && <div className="mt-4 flex items-start gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-xs text-success"><ShieldCheck className="mt-0.5 size-4 shrink-0" /><span><strong className="block">Emergency corridor activated</strong>Signals on {route.path.join(" → ")} are locked green.</span></div>}
              <Button className="mt-4 w-full" variant={emergency ? "destructive" : "default"} onClick={() => { setEmergency((value) => !value); setLive(false); }}>
                {emergency ? "Deactivate emergency mode" : "Activate emergency route"}
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-border bg-surface px-4 py-8 sm:px-7">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">Signal telemetry</p><h2 className="mt-1 font-display text-2xl font-bold">Junction Control</h2></div><p className="text-xs text-muted-foreground">Timers update every second • Emergency route receives green priority</p></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {(Object.keys(nodes) as NodeId[]).map((id, index) => {
              const priority = emergency && route.path.includes(id);
              const signal = priority || (tick + index * 7) % 45 > 19;
              const adjacent = edges.filter((edge) => edge.from === id || edge.to === id);
              const trafficLevel = adjacent.some((edge) => traffic[edge.id] === "high") ? "high" : adjacent.some((edge) => traffic[edge.id] === "medium") ? "medium" : "low";
              return <div key={id} className={`rounded-md border bg-card p-4 ${priority ? "border-success shadow-signal" : "border-border"}`}><div className="flex items-start justify-between"><div><p className="text-xs text-muted-foreground">Junction</p><p className="font-display text-xl font-bold">{id}</p></div><div className={`signal-light ${signal ? "signal-green" : "signal-red"}`} /></div><div className="mt-4 flex items-end justify-between"><div><p className="text-[10px] uppercase text-muted-foreground">Signal</p><p className={`text-xs font-bold ${signal ? "text-success" : "text-emergency"}`}>{signal ? "GREEN" : "RED"}</p></div><div className="text-right"><p className="text-[10px] uppercase text-muted-foreground">Timer</p><p className="font-mono text-sm font-bold">{priority ? "PRIORITY" : `${Math.max(4, (tick + index * 5) % 45)}s`}</p></div></div><div className="mt-3 h-1 overflow-hidden rounded-full bg-secondary"><div className={`h-full traffic-bar-${trafficLevel}`} /></div></div>;
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-7">
        <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div><div className="mb-3 flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary"><Sparkles className="size-5" /></div><p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">How decisions are made</p><h2 className="mt-2 font-display text-3xl font-bold">Dijkstra, translated into traffic flow.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Every road becomes an edge. Live congestion raises its travel-time weight. The engine checks the nearest unvisited junction, updates neighboring costs, and repeats until it reaches the destination.</p><div className="mt-5 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-mono text-xs"><Clock3 className="size-4 text-primary" /> Time complexity: O((V + E) log V)</div></div>
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            {["Read live traffic", "Build weighted graph", "Pick nearest node", "Update distances", "Trace fastest path", "Optimize signals"].map((step, index) => <div key={step} className="bg-card p-5"><span className="font-mono text-[10px] font-bold text-primary">0{index + 1}</span><p className="mt-3 text-sm font-semibold">{step}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{index === 0 ? "Road sensors report congestion." : index === 5 ? "Priority lights clear the corridor." : "The route engine processes this step."}</p></div>)}
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">FlowGrid Smart Traffic Management • Built for Hackathon 2026</footer>
    </main>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="bg-surface px-3 py-3 sm:px-4"><div className="flex items-center gap-1.5 text-[10px] uppercase text-muted-foreground"><span className="text-primary [&_svg]:size-3">{icon}</span>{label}</div><p className="mt-1 font-display text-xl font-bold">{value}</p></div>;
}

function NodeSelect({ label, value, onChange, disabledValue }: { label: string; value: NodeId; onChange: (value: NodeId) => void; disabledValue: NodeId }) {
  return <label><span className="mb-1.5 block text-[10px] font-semibold uppercase text-muted-foreground">{label}</span><Select value={value} onValueChange={(next) => onChange(next as NodeId)}><SelectTrigger className="h-10 bg-secondary"><SelectValue /></SelectTrigger><SelectContent>{(Object.keys(nodes) as NodeId[]).map((id) => <SelectItem key={id} value={id} disabled={id === disabledValue}>{id} — {nodes[id].name}</SelectItem>)}</SelectContent></Select></label>;
}