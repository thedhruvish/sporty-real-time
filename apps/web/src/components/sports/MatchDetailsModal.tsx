import {
  AlertTriangle,
  ArrowLeftRight,
  Award,
  Calendar,
  Clock,
  Flag,
  Goal,
  MapPin,
  Play,
  Radio,
  Trophy,
  Users,
  Video,
  X,
} from "lucide-react";
import { useCallback, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useSubscriptionsStore } from "@/stores/subscriptions-store";
import type { EventType, LiveEvent, Match } from "@/types/sports";

interface MatchDetailsModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
  liveEvents: LiveEvent[];
  onSubscribe?: (match: Match) => void;
  onUnsubscribe?: (matchId: string) => void;
}

export function MatchDetailsModal({
  match,
  isOpen,
  onClose,
  liveEvents,
  onSubscribe,
  onUnsubscribe,
}: MatchDetailsModalProps) {
  const isSubscribed = useSubscriptionsStore((state) =>
    state.isSubscribed(match?.id || ""),
  );

  // Handle subscribe toggle - must be defined before conditional return
  const handleSubscribeToggle = useCallback(() => {
    if (!match) return;
    if (isSubscribed) {
      onUnsubscribe?.(match.id);
    } else {
      onSubscribe?.(match);
    }
  }, [isSubscribed, match, onSubscribe, onUnsubscribe]);

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
  const sport = match.sport;
  const isLive = match.status === "live" || match.status === "halftime";
  const isFinished = match.status === "finished";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusDisplay = () => {
    switch (match.status) {
      case "live":
        return {
          label: "LIVE",
          minute: match.currentMinute ? `'${match.currentMinute}` : "",
          color: "text-red-500",
          bg: "bg-red-500",
        };
      case "halftime":
        return {
          label: "HALF TIME",
          minute: "",
          color: "text-orange-500",
          bg: "bg-orange-500",
        };
      case "finished":
        return {
          label: "FULL TIME",
          minute: "",
          color: "text-gray-500",
          bg: "bg-gray-400",
        };
      default:
        return {
          label: "SCHEDULED",
          minute: "",
          color: "text-orange-500",
          bg: "bg-orange-400",
        };
    }
  };

  const getEventIcon = (eventType: EventType) => {
    const iconClass = "h-4 w-4";
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

  const getEventBackground = (eventType: EventType, isHighlight: boolean) => {
    if (isHighlight) {
      switch (eventType) {
        case "goal":
          return "bg-green-50 border-l-4 border-l-green-500";
        case "penalty":
          return "bg-blue-50 border-l-4 border-l-blue-500";
        case "red_card":
          return "bg-red-50 border-l-4 border-l-red-500";
        default:
          return "bg-orange-50 border-l-4 border-l-orange-500";
      }
    }
    return "bg-white hover:bg-orange-50/50";
  };

  const status = getStatusDisplay();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative max-h-[90vh] w-full max-w-2xl overflow-hidden",
          "rounded-2xl bg-card shadow-2xl",
          "paper-card flex flex-col",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "sticky top-0 z-10 p-6 ",
            isLive
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : isFinished
                ? "bg-gradient-to-r from-gray-500 to-gray-600"
                : "bg-gradient-to-r from-primary/80 to-primary",
          )}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-8 w-8  hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* League Info */}
          <div className="mb-4 flex items-center gap-2 text-sm /80">
            {sport && (
              <>
                <Award className="h-4 w-4" />
                <span>{sport.name}</span>
                <span className="/50">•</span>
              </>
            )}
            {league && (
              <>
                <span>{league.name}</span>
                {league.country && (
                  <>
                    <span className="/50">•</span>
                    <span>{league.country}</span>
                  </>
                )}
              </>
            )}
          </div>

          {/* Status Badge */}
          <div className="mb-4 flex items-center gap-3">
            <Badge className={cn("border-0 ", status.bg)}>
              {isLive && (
                <span className="relative mr-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
              )}
              {status.label}
              {status.minute && ` ${status.minute}`}
            </Badge>
          </div>

          {/* Teams & Score */}
          <div className="flex items-center justify-between">
            {/* Team A */}
            <div className="flex flex-1 flex-col items-center">
              <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                <span className="font-bold text-2xl ">
                  {teamA?.shortCode?.slice(0, 3).toUpperCase() || "TA"}
                </span>
              </div>
              <span className="text-center font-semibold text-lg ">
                {teamA?.name || "Team A"}
              </span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-4 px-6">
              <span className="font-bold text-5xl  tabular-nums">
                {match.score?.teamA ?? 0}
              </span>
              <span className="text-2xl /50">-</span>
              <span className="font-bold text-5xl  tabular-nums">
                {match.score?.teamB ?? 0}
              </span>
            </div>

            {/* Team B */}
            <div className="flex flex-1 flex-col items-center">
              <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                <span className="font-bold text-2xl ">
                  {teamB?.shortCode?.slice(0, 3).toUpperCase() || "TB"}
                </span>
              </div>
              <span className="text-center font-semibold text-lg ">
                {teamB?.name || "Team B"}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="space-y-6 p-6">
            {/* Match Info */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground text-sm">
                <Users className="h-4 w-4" />
                Match Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-foreground">
                    {formatDate(match.startTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-foreground">
                    {formatTime(match.startTime)}
                  </span>
                </div>
                {league?.country && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{league.country}</span>
                  </div>
                )}
                {match.currentMinute && isLive && (
                  <div className="flex items-center gap-2 text-sm">
                    <Radio className="h-4 w-4 animate-pulse text-red-400" />
                    <span className="font-medium text-red-600">
                      {match.currentMinute}' played
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {isLive && (
              <div className="flex gap-3">
                <Button
                  onClick={handleSubscribeToggle}
                  className={cn(
                    "flex-1",
                    isSubscribed
                      ? "border-green-300 bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                  variant={isSubscribed ? "outline" : "default"}
                >
                  {isSubscribed ? (
                    <>
                      <Radio className="mr-2 h-4 w-4" />
                      Watching in Panel
                    </>
                  ) : (
                    <>
                      <Radio className="mr-2 h-4 w-4" />
                      Add to Watch Panel
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Live Events Timeline */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground text-sm">
                <Clock className="h-4 w-4" />
                Match Events
                <Badge
                  variant="secondary"
                  className="bg-muted text-muted-foreground text-xs"
                >
                  {liveEvents.length}
                </Badge>
              </h3>

              <Separator className="mb-4 bg-border" />

              {liveEvents.length === 0 ? (
                <div className="py-8 text-center">
                  <Radio className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">No events yet</p>
                  {isLive && (
                    <p className="mt-1 text-orange-400 text-xs">
                      Waiting for match events...
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {liveEvents
                    .sort((a, b) => b.eventSequence - a.eventSequence)
                    .map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "rounded-lg border border-orange-100 p-3 transition-colors",
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
                              <span className="font-semibold text-orange-600 text-sm">
                                {event.eventSequence}'
                              </span>
                              <Badge
                                variant="outline"
                                className="border-orange-200 text-orange-600 text-xs capitalize"
                              >
                                {event.eventType.replace("_", " ")}
                              </Badge>
                              {event.isHighlight && (
                                <Badge className="border-0 bg-orange-100 text-orange-700 text-xs">
                                  Highlight
                                </Badge>
                              )}
                            </div>
                            <p className="text-orange-800 text-sm">
                              {event.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
