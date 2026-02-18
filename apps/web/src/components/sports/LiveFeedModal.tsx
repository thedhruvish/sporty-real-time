import { Clock, Radio, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { EventType, LiveEvent, Match } from "@/types/sports";
import { getEventIcon } from "./event-utils";

interface LiveFeedModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
  liveEvents: LiveEvent[];
}

export function LiveFeedModal({
  match,
  isOpen,
  onClose,
  liveEvents,
}: LiveFeedModalProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !match) return null;

  const teamA = match.teamA;
  const teamB = match.teamB;
  const league = match.league;

  const getEventBackground = (eventType: EventType, isHighlight: boolean) => {
    if (isHighlight) {
      switch (eventType) {
        case "goal":
          return "bg-green-50 border-l-4 border-l-green-500";
        case "penalty":
          return "bg-blue-50 border-l-4 border-l-blue-500";
        case "red_card":
          return "bg-red-50 border-l-4 border-l-destructive";
        default:
          return "bg-background border-l-4 border-l-primary";
      }
    }
    return "bg-card hover:bg-muted";
  };

  const formatEventTime = (createdAt?: string, sequence?: number) => {
    if (!createdAt) return `${sequence || 0}'`;
    const date = new Date(createdAt);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full bg-background shadow-2xl sm:max-w-lg",
          "transform transition-all duration-300",
          "paper-card",
          isMinimized
            ? "h-auto sm:rounded-lg"
            : "flex max-h-[90vh] flex-col sm:max-h-[85vh] sm:rounded-xl",
          "max-sm:max-h-[80vh] max-sm:rounded-t-2xl",
        )}
      >
        {/* Paper fold effect */}
        <div className="absolute top-0 right-0 hidden h-0 w-0 border-t-24 border-t-border border-l-24 border-l-transparent sm:block" />

        {/* Header */}
        <div className="sticky top-0 z-10 bg-linear-to-r from-destructive to-red-600 p-4 text-white sm:rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
                </span>
                <span className="font-medium text-sm">LIVE</span>
              </div>
              {match.currentMinute && (
                <Badge
                  variant="secondary"
                  className="border-white/30 bg-white/20 text-white"
                >
                  {match.currentMinute}'
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? "Expand" : "Minimize"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Match Score */}
          {!isMinimized && (
            <div className="mt-4">
              <div className="mb-2 text-center text-white/70 text-xs">
                {league?.name} • {league?.country}
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1 text-center">
                  <div className="font-medium text-sm opacity-90">
                    {teamA?.name || "Team A"}
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4">
                  <span className="font-bold text-3xl">
                    {match.score?.teamA ?? 0}
                  </span>
                  <span className="text-xl opacity-50">-</span>
                  <span className="font-bold text-3xl">
                    {match.score?.teamB ?? 0}
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <div className="font-medium text-sm opacity-90">
                    {teamB?.name || "Team B"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {!isMinimized && (
          <>
            {/* Timeline Header */}
            <div className="border-border border-b bg-card px-4 py-3">
              <div className="flex items-center gap-2 font-medium text-foreground text-sm">
                <Clock className="h-4 w-4" />
                <span>Live Events</span>
                <Badge
                  variant="secondary"
                  className="bg-secondary text-primary text-xs"
                >
                  {liveEvents.length}
                </Badge>
              </div>
            </div>

            {/* Events List */}
            <ScrollArea className="flex-1">
              <div className="space-y-2 p-4">
                {liveEvents.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <Radio className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p className="text-sm">Waiting for events...</p>
                  </div>
                ) : (
                  liveEvents
                    .sort((a, b) => b.eventSequence - a.eventSequence)
                    .map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "rounded-lg border border-border p-3 transition-colors",
                          getEventBackground(
                            event.eventType,
                            event.isHighlight,
                          ),
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getEventIcon(event.eventType)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <span className="font-medium text-primary text-xs">
                                {event.eventSequence}'
                              </span>
                              <Badge
                                variant="outline"
                                className="border-border text-foreground text-xs capitalize"
                              >
                                {event.eventType.replace("_", " ")}
                              </Badge>
                              {event.isHighlight && (
                                <Badge className="border-0 bg-secondary text-primary text-xs">
                                  Highlight
                                </Badge>
                              )}
                            </div>
                            <p className="text-foreground text-sm">
                              {event.message}
                            </p>
                          </div>
                          <span className="whitespace-nowrap text-muted-foreground text-xs">
                            {formatEventTime(
                              event.createdAt,
                              event.eventSequence,
                            )}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-border border-t bg-card p-4">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>WebSocket connection placeholder</span>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  <span>Connected</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
