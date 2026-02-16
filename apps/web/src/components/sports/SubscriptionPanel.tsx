import {
  AlertTriangle,
  ArrowLeftRight,
  Clock,
  Flag,
  Goal,
  GripVertical,
  Maximize2,
  Play,
  Radio,
  Trash2,
  Trophy,
  Video,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSubscriptionsStore } from "@/stores/subscriptions-store";
import type { EventType, LiveEvent, Match } from "@/types/sports";

interface SubscriptionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  liveEvents: LiveEvent[];
  onShowMatchDetails?: (match: Match) => void;
}

export function SubscriptionPanel({
  isOpen,
  onClose,
  liveEvents,
  onShowMatchDetails,
}: SubscriptionPanelProps) {
  const { subscribedMatches, unsubscribe, reorderMatches } =
    useSubscriptionsStore();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      const dragIndex = Number.parseInt(
        e.dataTransfer.getData("text/plain"),
        10,
      );

      if (dragIndex !== dropIndex) {
        reorderMatches(dragIndex, dropIndex);
      }

      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [reorderMatches],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full w-80 md:w-96",
        "border-orange-200 border-l bg-orange-50/98 backdrop-blur-sm",
        "z-40 flex flex-col shadow-2xl",
        "transform transition-transform duration-300",
        "paper-texture",
      )}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            <span className="font-semibold">Watching</span>
            <Badge
              variant="secondary"
              className="border-white/30 bg-white/20 text-white"
            >
              {subscribedMatches.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <p className="mt-1 text-white/70 text-xs">
          Drag to reorder • Click to expand
        </p>
      </div>

      {/* Match List */}
      <ScrollArea className="flex-1">
        <div className="space-y-3 p-3">
          {subscribedMatches.length === 0 ? (
            <div className="py-12 text-center">
              <Radio className="mx-auto mb-3 h-12 w-12 text-orange-300" />
              <p className="text-orange-600 text-sm">
                No matches being watched
              </p>
              <p className="mt-1 text-orange-400 text-xs">
                Click "Watch" on a live match to add it here
              </p>
            </div>
          ) : (
            subscribedMatches.map((subscription, index) => {
              const matchEvents = liveEvents.filter(
                (e) => e.matchId === subscription.match.id,
              );

              return (
                <DraggableMatchPanel
                  key={subscription.match.id}
                  match={subscription.match}
                  events={matchEvents}
                  index={index}
                  isDragging={draggedIndex === index}
                  isDragOver={dragOverIndex === index}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  onUnsubscribe={() => unsubscribe(subscription.match.id)}
                  onShowDetails={() => onShowMatchDetails?.(subscription.match)}
                />
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-orange-200 border-t bg-white/50 p-3">
        <div className="flex items-center justify-between text-orange-600 text-xs">
          <span>WebSocket placeholder</span>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span>Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DraggableMatchPanelProps {
  match: Match;
  events: LiveEvent[];
  index: number;
  isDragging: boolean;
  isDragOver: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onUnsubscribe: () => void;
  onShowDetails: () => void;
}

function DraggableMatchPanel({
  match,
  events,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onUnsubscribe,
  onShowDetails,
}: DraggableMatchPanelProps) {
  const teamA = match.teamA;
  const teamB = match.teamB;
  const isLive = match.status === "live" || match.status === "halftime";

  const getEventIcon = (eventType: EventType) => {
    const iconClass = "h-3 w-3";
    switch (eventType) {
      case "goal":
        return <Goal className={cn(iconClass, "text-green-500")} />;
      case "penalty":
        return <Goal className={cn(iconClass, "text-blue-500")} />;
      case "yellow_card":
        return <AlertTriangle className={cn(iconClass, "text-yellow-500")} />;
      case "red_card":
        return <AlertTriangle className={cn(iconClass, "text-red-500")} />;
      case "substitution":
        return <ArrowLeftRight className={cn(iconClass, "text-blue-400")} />;
      case "var_decision":
        return <Video className={cn(iconClass, "text-purple-500")} />;
      case "halftime":
        return <Flag className={cn(iconClass, "text-orange-500")} />;
      case "match_start":
        return <Play className={cn(iconClass, "text-green-500")} />;
      case "match_end":
        return <Trophy className={cn(iconClass, "text-orange-500")} />;
      default:
        return <Radio className={cn(iconClass, "text-gray-400")} />;
    }
  };

  return (
    <div
      role="t"
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={cn(
        "overflow-hidden rounded-lg border border-orange-100 bg-white shadow-sm",
        "transition-all duration-200",
        isDragging && "scale-[0.98] opacity-50",
        isDragOver && "ring-2 ring-orange-400 ring-offset-1",
      )}
    >
      {/* Drag Handle & Header */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2",
          isLive
            ? "bg-linear-to-r from-red-500 to-red-600 text-white"
            : "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800",
        )}
      >
        <GripVertical className="h-4 w-4 cursor-grab opacity-60 active:cursor-grabbing" />
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
            )}
            <span className="font-medium text-xs">
              {match.currentMinute
                ? `${match.currentMinute}'`
                : match.status.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6",
                isLive
                  ? "text-white hover:bg-white/20"
                  : "text-orange-600 hover:bg-orange-100",
              )}
              onClick={onShowDetails}
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6",
                isLive
                  ? "text-white hover:bg-white/20"
                  : "text-orange-600 hover:bg-orange-100",
              )}
              onClick={onUnsubscribe}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="border-orange-50 border-b px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700 text-xs">
              {teamA?.shortCode?.slice(0, 2) || "TA"}
            </div>
            <span className="truncate font-medium text-orange-900 text-sm">
              {teamA?.name || "Team A"}
            </span>
          </div>
          <span className="px-2 font-bold text-lg text-orange-900 tabular-nums">
            {match.score?.teamA ?? 0}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700 text-xs">
              {teamB?.shortCode?.slice(0, 2) || "TB"}
            </div>
            <span className="truncate font-medium text-orange-900 text-sm">
              {teamB?.name || "Team B"}
            </span>
          </div>
          <span className="px-2 font-bold text-lg text-orange-900 tabular-nums">
            {match.score?.teamB ?? 0}
          </span>
        </div>
      </div>

      {/* Recent Events */}
      <div className="p-2">
        <div className="mb-2 flex items-center gap-1 text-orange-600 text-xs">
          <Clock className="h-3 w-3" />
          <span>Recent Events</span>
        </div>
        {events.length === 0 ? (
          <p className="py-2 text-center text-orange-400 text-xs">
            No events yet...
          </p>
        ) : (
          <div className="scrollbar-paper max-h-32 space-y-1 overflow-y-auto">
            {events
              .sort((a, b) => b.eventSequence - a.eventSequence)
              .slice(0, 5)
              .map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "flex items-center gap-2 rounded p-1.5 text-xs",
                    event.isHighlight ? "bg-orange-50" : "bg-white",
                  )}
                >
                  {getEventIcon(event.eventType)}
                  <span className="font-medium text-orange-600">
                    {event.eventSequence}'
                  </span>
                  <span className="flex-1 truncate text-orange-800">
                    {event.message.length > 40
                      ? `${event.message.slice(0, 40)}...`
                      : event.message}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
