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
  Trophy,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { EventType, LiveEvent, Match } from "@/types/sports";

interface LiveFeedPanelProps {
  match: Match;
  liveEvents: LiveEvent[];
  onRemove: (matchId: string) => void;
  onExpand?: (match: Match) => void;
  isDragging?: boolean;
  listeners?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
}

export function LiveFeedPanel({
  match,
  liveEvents,
  onRemove,
  onExpand,
  isDragging,
  listeners,
  attributes,
}: LiveFeedPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const teamA = match.teamA;
  const teamB = match.teamB;
  const league = match.league;

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
        return <AlertTriangle className={cn(iconClass, "text-destructive")} />;
      case "substitution":
        return <ArrowLeftRight className={cn(iconClass, "text-blue-400")} />;
      case "var_decision":
        return <Video className={cn(iconClass, "text-purple-500")} />;
      case "halftime":
        return <Flag className={cn(iconClass, "text-primary")} />;
      case "match_start":
        return <Play className={cn(iconClass, "text-green-500")} />;
      case "match_end":
        return <Trophy className={cn(iconClass, "text-primary")} />;
      default:
        return <Radio className={cn(iconClass, "text-muted-foreground")} />;
    }
  };

  const isLive = match.status === "live" || match.status === "halftime";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-200",
        "paper-card",
        isDragging && "opacity-50 shadow-xl ring-2 ring-ring",
        !isLive && "opacity-60",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2",
          isLive
            ? "bg-linear-to-r from-destructive to-red-600 text-white"
            : "bg-linear-to-r from-primary/80 to-primary text-primary-foreground",
        )}
      >
        {/* Drag Handle */}
        <button
          className="-ml-1 cursor-grab rounded p-1 hover:bg-white/20 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Live Badge */}
        {isLive && (
          <div className="flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
          </div>
        )}

        {/* Match Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="truncate font-medium text-xs">
              {teamA?.shortCode} vs {teamB?.shortCode}
            </span>
            {match.currentMinute && (
              <Badge
                variant="secondary"
                className="ml-2 border-0 bg-white/20 text-white text-xs"
              >
                {match.currentMinute}'
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {onExpand && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-white/20"
              onClick={() => onExpand(match)}
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Clock className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20"
            onClick={() => onRemove(match.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Score */}
      {!isCollapsed && (
        <div className="border-border border-b bg-muted/30 px-3 py-2">
          <div className="flex items-center justify-center gap-3">
            <div className="flex flex-1 items-center justify-end gap-2">
              <span className="max-w-[80px] truncate text-right text-muted-foreground text-xs">
                {teamA?.name}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-gradient-to-br from-background to-secondary">
                <span className="font-bold text-primary text-xs">
                  {teamA?.shortCode?.slice(0, 2)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2">
              <span className="font-bold text-foreground text-xl">
                {match.score?.teamA ?? 0}
              </span>
              <span className="text-muted-foreground">-</span>
              <span className="font-bold text-foreground text-xl">
                {match.score?.teamB ?? 0}
              </span>
            </div>

            <div className="flex flex-1 items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-gradient-to-br from-background to-secondary">
                <span className="font-bold text-primary text-xs">
                  {teamB?.shortCode?.slice(0, 2)}
                </span>
              </div>
              <span className="max-w-[80px] truncate text-muted-foreground text-xs">
                {teamB?.name}
              </span>
            </div>
          </div>

          {league && (
            <div className="mt-1 text-center">
              <span className="text-muted-foreground text-xs">
                {league.name} • {league.country}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Events List */}
      {!isCollapsed && (
        <ScrollArea className="h-40">
          <div className="space-y-1 p-2">
            {liveEvents.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                <Radio className="mx-auto mb-1 h-4 w-4 opacity-50" />
                <p className="text-xs">Waiting for events...</p>
              </div>
            ) : (
              liveEvents
                .sort((a, b) => b.eventSequence - a.eventSequence)
                .slice(0, 10)
                .map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "flex items-start gap-2 rounded p-2 text-xs",
                      event.isHighlight
                        ? "border-l-2 border-l-primary bg-secondary"
                        : "hover:bg-muted/50",
                    )}
                  >
                    <div className="mt-0.5">
                      {getEventIcon(event.eventType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 flex items-center gap-1">
                        <span className="font-medium text-primary">
                          {event.eventSequence}'
                        </span>
                        <span className="text-foreground capitalize">
                          {event.eventType.replace("_", " ")}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-muted-foreground">
                        {event.message}
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
