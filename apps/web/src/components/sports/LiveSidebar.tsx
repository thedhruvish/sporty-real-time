import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronLeft, ChevronRight, Radio } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { LiveEvent, Match } from "@/types/sports";
import { LiveFeedPanel } from "./LiveFeedPanel";

interface LiveSidebarProps {
  subscribedMatches: Match[];
  liveEvents: LiveEvent[];
  onUnsubscribe: (matchId: string) => void;
  onExpandMatch?: (match: Match) => void;
  onReorder?: (matchIds: string[]) => void;
}

interface SortablePanelProps {
  id: string;
  match: Match;
  liveEvents: LiveEvent[];
  onRemove: (matchId: string) => void;
  onExpand?: (match: Match) => void;
}

function SortablePanel({
  id,
  match,
  liveEvents,
  onRemove,
  onExpand,
}: SortablePanelProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <LiveFeedPanel
        match={match}
        liveEvents={liveEvents}
        onRemove={onRemove}
        onExpand={onExpand}
        isDragging={isDragging}
        attributes={attributes}
        listeners={listeners}
      />
    </div>
  );
}

export function LiveSidebar({
  subscribedMatches,
  liveEvents,
  onUnsubscribe,
  onExpandMatch,
  onReorder,
}: LiveSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [matchOrder, setMatchOrder] = useState<string[]>([]);

  // Initialize order when matches change
  const currentOrder = useMemo(() => {
    if (matchOrder.length === subscribedMatches.length) {
      return matchOrder;
    }
    return subscribedMatches.map((m) => m.id);
  }, [matchOrder, subscribedMatches]);

  const orderedMatches = useMemo(() => {
    return currentOrder
      .map((id) => subscribedMatches.find((m) => m.id === id))
      .filter((m): m is Match => m !== undefined);
  }, [currentOrder, subscribedMatches]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentOrder.indexOf(active.id as string);
      const newIndex = currentOrder.indexOf(over.id as string);
      const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
      setMatchOrder(newOrder);
      onReorder?.(newOrder);
    }
  }

  // Count live matches
  const liveCount = subscribedMatches.filter(
    (m) => m.status === "live" || m.status === "halftime",
  ).length;

  if (isCollapsed) {
    return (
      <div className="fixed top-1/2 right-0 z-40 -translate-y-1/2">
        <Button
          variant="outline"
          className="rounded-r-none border-border border-r-0 bg-background shadow-lg hover:bg-muted"
          onClick={() => setIsCollapsed(false)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          <Radio className="h-4 w-4 text-destructive" />
          {liveCount > 0 && (
            <span className="ml-1 rounded-full bg-destructive px-1.5 py-0.5 text-white text-xs">
              {liveCount}
            </span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed top-16 right-0 bottom-0 z-40 w-80 border-border border-l bg-background/95 shadow-xl",
        "paper-texture flex flex-col transition-all duration-300",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-border border-b bg-muted/50 p-3">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-destructive" />
          <span className="font-semibold text-foreground">Live Feeds</span>
          {liveCount > 0 && (
            <span className="rounded-full bg-destructive px-1.5 py-0.5 text-white text-xs">
              {liveCount}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:bg-secondary"
          onClick={() => setIsCollapsed(true)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-3 p-3">
          {subscribedMatches.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Radio className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p className="text-sm">No subscribed matches</p>
              <p className="mt-1 text-xs">
                Click "Subscribe" on match cards to add them here
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={orderedMatches.map((m) => m.id)}
                strategy={verticalListSortingStrategy}
              >
                {orderedMatches.map((match) => (
                  <SortablePanel
                    key={match.id}
                    id={match.id}
                    match={match}
                    liveEvents={liveEvents.filter(
                      (event) => event.matchId === match.id,
                    )}
                    onRemove={onUnsubscribe}
                    onExpand={onExpandMatch}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-border border-t bg-muted/50 p-3">
        <p className="text-center text-muted-foreground text-xs">
          Drag panels to reorder • WebSocket ready
        </p>
      </div>
    </div>
  );
}
