import type { ServerWsEvent } from "@sporty/inter-types/ws";
import {
  AlertTriangle,
  ArrowLeftRight,
  Flag,
  Goal,
  Play,
  Radio,
  Trophy,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventType } from "@/types/sports";

export const getEventIcon = (eventType: EventType | ServerWsEvent) => {
  const iconClass = "h-3 w-3";
  switch (eventType) {
    case "goal":
    case "GOAL":
      return <Goal className={cn(iconClass, "text-green-500")} />;
    case "penalty":
    case "PENALTY":
      return <Goal className={cn(iconClass, "text-blue-500")} />;
    case "yellow_card":
    case "YELLOW_CARD":
      return <AlertTriangle className={cn(iconClass, "text-yellow-500")} />;
    case "red_card":
    case "RED_CARD":
      return <AlertTriangle className={cn(iconClass, "text-red-500")} />;
    case "substitution":
    case "SUBSTITUTION":
      return <ArrowLeftRight className={cn(iconClass, "text-blue-400")} />;
    case "var_decision":
    case "VAR_DECISION":
      return <Video className={cn(iconClass, "text-purple-500")} />;
    case "halftime":
    case "HALFTIME":
      return <Flag className={cn(iconClass, "text-orange-500")} />;
    case "match_start":
    case "MATCH_START":
    case "SECOND_HALF_START":
      return <Play className={cn(iconClass, "text-green-500")} />;
    case "match_end":
    case "MATCH_END":
      return <Trophy className={cn(iconClass, "text-orange-500")} />;
    default:
      return <Radio className={cn(iconClass, "text-gray-400")} />;
  }
};
