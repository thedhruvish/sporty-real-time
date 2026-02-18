import { Calendar, Check, Clock, Eye, Plus, Radio } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Match } from "@/types/sports";
import type { ClientWsMessage } from "@sporty/inter-types/ws";

interface MatchCardProps {
  match: Match;
  onShowLiveFeed?: (match: Match) => void;
  onShowDetails?: (match: Match) => void;
  onSubscribe?: (match: Match) => void;
  isSubscribed?: boolean;
}

export function MatchCard({
  match,
  onShowLiveFeed,
  onShowDetails,
  onSubscribe,
  isSubscribed,
}: MatchCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isLive = match.status === "live" || match.status === "halftime";
  const isFinished = match.status === "finished";
  const isScheduled = match.status === "scheduled";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = () => {
    switch (match.status) {
      case "live":
        return (
          <Badge
            variant="default"
            className="animate-pulse bg-destructive text-white hover:bg-destructive/90"
          >
            <span className="mr-1.5 h-2 w-2 animate-ping rounded-full bg-white" />
            LIVE {match.currentMinute ? `'${match.currentMinute}` : ""}
          </Badge>
        );
      case "halftime":
        return (
          <Badge
            variant="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            HT
          </Badge>
        );
      case "finished":
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            FT
          </Badge>
        );
      case "postponed":
        return (
          <Badge
            variant="outline"
            className="border-warning text-warning-foreground"
          >
            Postponed
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return (
          <Badge variant="outline" className="border-primary text-primary">
            Scheduled
          </Badge>
        );
    }
  };

  const teamA = match.teamA;
  const teamB = match.teamB;
  const league = match.league;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "border border-border bg-card shadow-sm hover:shadow-lg",
        "paper-card cursor-pointer",
        isLive &&
          "ring-2 ring-destructive/50 ring-offset-2 ring-offset-background",
        isHovered && "-translate-y-1 transform",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onShowDetails?.(match)}
    >
      {/* Paper fold effect */}
      <div className="absolute top-0 right-0 h-8 w-8 bg-gradient-to-bl from-muted to-transparent" />
      <div className="absolute top-0 right-0 h-0 w-0 border-t-[32px] border-t-border border-l-[32px] border-l-transparent" />

      <CardContent className="p-0">
        {/* Header: League & Status */}
        <div className="flex items-center justify-between border-border border-b bg-gradient-to-r from-background to-muted px-4 py-3">
          <div className="flex items-center gap-2">
            {league && (
              <>
                <span className="font-medium text-foreground text-sm">
                  {league.name}
                </span>
                {league.country && (
                  <span className="text-muted-foreground text-xs">
                    • {league.country}
                  </span>
                )}
              </>
            )}
          </div>
          {getStatusBadge()}
        </div>

        {/* Match Content */}
        <div className="p-4">
          {/* Teams & Score */}
          <div className="flex items-center justify-between gap-4">
            {/* Team A */}
            <div className="flex-1 text-center">
              <TeamDisplay
                name={teamA?.name || "Team A"}
                shortCode={teamA?.shortCode || "TA"}
                logoUrl={teamA?.logoUrl}
              />
            </div>

            {/* Score */}
            <div className="flex flex-col items-center px-4">
              {isScheduled ? (
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="font-medium text-xs">
                      {formatDate(match.startTime)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-semibold text-sm">
                      {formatTime(match.startTime)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "font-bold text-3xl tabular-nums",
                      isFinished ? "text-muted-foreground" : "text-foreground",
                    )}
                  >
                    {match.score?.teamA ?? 0}
                  </span>
                  <span className="text-muted-foreground text-xl">-</span>
                  <span
                    className={cn(
                      "font-bold text-3xl tabular-nums",
                      isFinished ? "text-muted-foreground" : "text-foreground",
                    )}
                  >
                    {match.score?.teamB ?? 0}
                  </span>
                </div>
              )}
            </div>

            {/* Team B */}
            <div className="flex-1 text-center">
              <TeamDisplay
                name={teamB?.name || "Team B"}
                shortCode={teamB?.shortCode || "TB"}
                logoUrl={teamB?.logoUrl}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2 border-border border-t pt-4">
            {isLive && onShowLiveFeed && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowLiveFeed(match);
                }}
                className={cn(
                  "flex-1 bg-gradient-to-r from-destructive to-red-600",
                  "hover:from-red-600 hover:to-red-700",
                  "text-white shadow-md hover:shadow-lg",
                  "transition-all duration-200",
                )}
              >
                <Radio className="mr-2 h-4 w-4 animate-pulse" />
                Live Feed
              </Button>
            )}

            {onSubscribe && (
              <Button
                variant={isSubscribed ? "secondary" : "outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  onSubscribe(match);
                }}
                className={cn(
                  "transition-all duration-200",
                  isSubscribed
                    ? "border-green-300 bg-green-100 text-green-700 hover:bg-green-200"
                    : "border-primary text-primary hover:bg-muted",
                )}
              >
                {isSubscribed ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    Watching
                  </>
                ) : (
                  <>
                    <Plus className="mr-1 h-4 w-4" />
                    Watch
                  </>
                )}
              </Button>
            )}

            {onShowDetails && (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onShowDetails(match);
                }}
                className="border-border text-muted-foreground hover:bg-muted"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Finished match info */}
          {isFinished && (
            <div className="mt-4 border-border border-t pt-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs">
                <Clock className="h-3 w-3" />
                <span>Full Time • {formatDate(match.startTime)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TeamDisplay({
  name,
  shortCode,
  logoUrl,
}: {
  name: string;
  shortCode: string;
  logoUrl?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border bg-gradient-to-br from-background to-muted shadow-sm">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-bold text-lg text-primary">
            {shortCode.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <span className="max-w-[100px] truncate font-medium text-foreground text-sm">
        {name}
      </span>
    </div>
  );
}
