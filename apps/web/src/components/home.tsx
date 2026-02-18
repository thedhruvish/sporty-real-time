import {
  ClientWstEvent,
  ServerWsEvent,
  type ServerWsMessage,
} from "@sporty/inter-types/ws";
import { useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle,
  PanelRightOpen,
  Radio,
  Trophy,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type DashboardResponse,
  dashboardKey,
  useGetHomeDashboard,
} from "@/api/dashboard-api";
import {
  Footer,
  Header,
  MatchCard,
  MatchDetailsModal,
  SubscriptionPanel,
} from "@/components/sports";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWebSocket } from "@/hooks/use-websocket";
import { cn } from "@/lib/utils";
import { useSubscriptionsStore } from "@/stores/subscriptions-store";
import type { LiveEvent, Match } from "@/types/sports";
import { MatchCardSkeleton } from "./match-card-skeleton";
import { getEventIcon } from "./sports/event-utils";

export function Home({
  panelOpen,
  togglePanel,
}: {
  panelOpen: boolean;
  togglePanel: () => void;
}) {
  const queryClient = useQueryClient();

  const { sendMessage, status } = useWebSocket({
    onMessage: (data: ServerWsMessage) => {
      if (
        data.event === ServerWsEvent.GOAL ||
        data.event === ServerWsEvent.RED_CARD ||
        data.event === ServerWsEvent.YELLOW_CARD ||
        data.event === ServerWsEvent.PENALTY ||
        data.event === ServerWsEvent.VAR_DECISION ||
        data.event === ServerWsEvent.MATCH_END ||
        data.event === ServerWsEvent.HALFTIME ||
        data.event === ServerWsEvent.SCORE_UPDATE ||
        data.data.isHighlight
      ) {
        // Find match details for better toast message
        const match = matches.find((m) => m.id === data.data.matchId);
        const teamNames =
          match?.teamA && match?.teamB
            ? `${match.teamA.shortCode} vs ${match.teamB.shortCode}`
            : "Match Update";

        toast(data.data.payload.message || "New likely event", {
          description: teamNames,
          icon: getEventIcon(data.event),
        });

        // Update Query Cache
        queryClient.setQueryData<DashboardResponse>(
          dashboardKey.home(),
          (old) => {
            if (!old) return old;

            const payload = data.data.payload;
            let newScore: string | undefined;
            let displayMessage = payload.message;

            // Handle object message structure (user specific)
            if (
              typeof payload.message === "object" &&
              payload.message !== null
            ) {
              if (payload.message.score) newScore = payload.message.score;
              if (payload.message.message)
                displayMessage = payload.message.message;
            } else if (payload.meta?.score) {
              // Fallback to meta
              newScore = payload.meta.score as string;
            }

            // Update Matches if score exists
            const updatedMatches = old.matches.map((m) => {
              if (m.id === data.data.matchId && newScore) {
                const parts = newScore.split("-");
                if (parts.length === 2) {
                  const scoreA = Number.parseInt(parts[0], 10);
                  const scoreB = Number.parseInt(parts[1], 10);
                  if (!Number.isNaN(scoreA) && !Number.isNaN(scoreB)) {
                    return {
                      ...m,
                      score: { teamA: scoreA, teamB: scoreB },
                    };
                  }
                }
              }
              return m;
            });

            // Create clean event object
            const cleanEvent: LiveEvent = {
              ...(data.data.payload as LiveEvent),
              message:
                typeof displayMessage === "string"
                  ? displayMessage
                  : JSON.stringify(displayMessage),
            };

            return {
              ...old,
              matches: updatedMatches,
              liveEvents: [cleanEvent, ...old.liveEvents].slice(0, 50),
            };
          },
        );
      }

      if (data.event === ServerWsEvent.MATCH_UPDATE) {
        const match = data.data.payload as Match;
        toast.info(`Match Status Updated: ${match.status.toUpperCase()}`, {
          description: `${match.teamA?.shortCode} vs ${match.teamB?.shortCode}`,
          icon: <Trophy className="h-4 w-4 text-orange-500" />,
        });

        queryClient.setQueryData<DashboardResponse>(
          dashboardKey.home(),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              matches: old.matches.map((m) =>
                m.id === match.id ? { ...m, status: match.status } : m,
              ),
            };
          },
        );
      }
    },
    reconnect: true,
    reconnectInterval: 5000,
  });
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { subscribe, unsubscribe, isSubscribed } = useSubscriptionsStore();

  const { data, isLoading, refetch } = useGetHomeDashboard();

  const matches = data?.matches || [];
  const liveEvents = data?.liveEvents || [];

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  // Sync subscriptions with available matches
  useEffect(() => {
    if (matches.length > 0) {
      const { subscribedMatches, unsubscribe } =
        useSubscriptionsStore.getState();
      subscribedMatches.forEach((sm) => {
        const matchExists = matches.find((m) => m.id === sm.match.id);
        if (!matchExists) {
          unsubscribe(sm.match.id);
        }
      });
    }
  }, [matches]);

  const handleShowDetails = useCallback(
    (match: Match) => {
      sendMessage({
        event: ClientWstEvent.SUBSCRIBE_MATCH,
        data: {
          matchId: match.id,
        },
      });
      setSelectedMatch(match);
      setIsDetailsModalOpen(true);
    },
    [sendMessage],
  );

  const handleCloseDetailsModal = useCallback(() => {
    if (!selectedMatch) return;
    sendMessage({
      event: ClientWstEvent.UNSUBSCRIBE_MATCH,
      data: {
        matchId: selectedMatch?.id || "",
      },
    });
    setIsDetailsModalOpen(false);
    setSelectedMatch(null);
  }, [selectedMatch, sendMessage]);

  const handleSubscribe = useCallback(
    (match: Match) => {
      const { subscribedMatches } = useSubscriptionsStore.getState();

      if (subscribedMatches.length >= 3) {
        toast.error("Only three subscrible are the allowed ...");
        return;
      }
      const matchEvents = liveEvents.filter((e) => e.matchId === match.id);
      subscribe(match, matchEvents);
      sendMessage({
        event: ClientWstEvent.SUBSCRIBE_MATCH,
        data: {
          matchId: match.id,
        },
      });
    },
    [liveEvents, subscribe, sendMessage],
  );

  const handleUnsubscribe = useCallback(
    (matchId: string) => {
      unsubscribe(matchId);
      sendMessage({
        event: ClientWstEvent.UNSUBSCRIBE_MATCH,
        data: {
          matchId,
        },
      });
    },
    [unsubscribe, sendMessage],
  );

  const getMatchEvents = useCallback(
    (matchId: string) => {
      return liveEvents.filter((event) => event.matchId === matchId);
    },
    [liveEvents],
  );

  // Filter matches by status
  const liveMatches = matches.filter(
    (m) => m.status === "live" || m.status === "halftime",
  );
  const scheduledMatches = matches.filter((m) => m.status === "scheduled");
  const finishedMatches = matches.filter((m) => m.status === "finished");

  return (
    <div className="paper-texture flex min-h-screen flex-col bg-orange-50/50">
      <Header
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        isPanelOpen={panelOpen}
        onTogglePanel={togglePanel}
      />

      <main className={cn("flex-1 transition-all duration-300")}>
        <div className="container mx-auto px-4 py-6">
          {/* Page Title */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-bold font-serif text-2xl text-orange-900 md:text-3xl">
                  Live Sports Scores {status}
                </h1>
                <p className="mt-1 text-orange-600">
                  Stay updated with real-time match scores and events
                </p>
              </div>

              {/* Toggle Panel Button - Mobile */}
              <Button
                variant="outline"
                className="border-orange-200 text-orange-700 lg:hidden"
                onClick={togglePanel}
              >
                <PanelRightOpen className="mr-2 h-4 w-4" />
                Watch Panel
              </Button>
            </div>
          </div>

          {/* Tabs for different match statuses */}
          <Tabs defaultValue="live" className="w-full">
            <TabsList className="mb-6 border border-orange-200 bg-orange-100/50 p-1">
              <TabsTrigger
                value="live"
                className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Radio className="h-4 w-4" />
                Live
                {liveMatches.length > 0 && (
                  <Badge
                    variant="default"
                    className="ml-1 bg-red-500 text-white"
                  >
                    {liveMatches.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="scheduled"
                className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Calendar className="h-4 w-4" />
                Scheduled
                {scheduledMatches.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-orange-100 text-orange-700"
                  >
                    {scheduledMatches.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="finished"
                className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <CheckCircle className="h-4 w-4" />
                Finished
                {finishedMatches.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-orange-100 text-orange-700"
                  >
                    {finishedMatches.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Trophy className="h-4 w-4" />
                All
              </TabsTrigger>
            </TabsList>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <MatchCardSkeleton key={i.toString()} />
                ))}
              </div>
            ) : (
              <>
                {/* Live Matches */}
                <TabsContent value="live" className="mt-0">
                  {liveMatches.length === 0 ? (
                    <EmptyState
                      icon={<Radio className="h-12 w-12" />}
                      title="No Live Matches"
                      description="There are no matches currently in progress. Check back later!"
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {liveMatches.map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onShowDetails={handleShowDetails}
                          onSubscribe={handleSubscribe}
                          isSubscribed={isSubscribed(match.id)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Scheduled Matches */}
                <TabsContent value="scheduled" className="mt-0">
                  {scheduledMatches.length === 0 ? (
                    <EmptyState
                      icon={<Calendar className="h-12 w-12" />}
                      title="No Scheduled Matches"
                      description="No upcoming matches scheduled at the moment."
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {scheduledMatches.map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onShowDetails={handleShowDetails}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Finished Matches */}
                <TabsContent value="finished" className="mt-0">
                  {finishedMatches.length === 0 ? (
                    <EmptyState
                      icon={<CheckCircle className="h-12 w-12" />}
                      title="No Finished Matches"
                      description="No completed matches to display."
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {finishedMatches.map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onShowDetails={handleShowDetails}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* All Matches */}
                <TabsContent value="all" className="mt-0">
                  {matches.length === 0 ? (
                    <EmptyState
                      icon={<Trophy className="h-12 w-12" />}
                      title="No Matches"
                      description="No matches available at the moment."
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {matches.map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onShowDetails={handleShowDetails}
                          onSubscribe={
                            match.status === "live" ||
                            match.status === "halftime"
                              ? handleSubscribe
                              : undefined
                          }
                          isSubscribed={isSubscribed(match.id)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Subscription Panel - Right Side */}
      <SubscriptionPanel
        isOpen={panelOpen}
        onClose={togglePanel}
        liveEvents={liveEvents}
        onShowMatchDetails={handleShowDetails}
        sendMessage={sendMessage}
      />

      {/* Match Details Modal */}
      <MatchDetailsModal
        match={selectedMatch}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        liveEvents={selectedMatch ? getMatchEvents(selectedMatch.id) : []}
        onSubscribe={handleSubscribe}
        onUnsubscribe={handleUnsubscribe}
      />
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-orange-300">{icon}</div>
      <h3 className="mb-2 font-semibold text-lg text-orange-800">{title}</h3>
      <p className="max-w-md text-orange-600">{description}</p>
    </div>
  );
}
