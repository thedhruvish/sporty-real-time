import {
  Calendar,
  CheckCircle,
  PanelRightOpen,
  Radio,
  Trophy,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useGetHomeDashboard } from "@/api/dashboard-api";
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
import { cn } from "@/lib/utils";
import { useSubscriptionsStore } from "@/stores/subscriptions-store";
import type { Match } from "@/types/sports";
import { MatchCardSkeleton } from "./match-card-skeleton";

export function Home() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { subscribe, unsubscribe, isSubscribed } = useSubscriptionsStore();

  const { data, isLoading, isError, error, refetch } = useGetHomeDashboard();

  const matches = data?.matches || [];
  const liveEvents = data?.liveEvents || [];

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleShowDetails = useCallback((match: Match) => {
    setSelectedMatch(match);
    setIsDetailsModalOpen(true);
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedMatch(null);
  }, []);

  const handleSubscribe = useCallback(
    (match: Match) => {
      const matchEvents = liveEvents.filter((e) => e.matchId === match.id);
      subscribe(match, matchEvents);
    },
    [liveEvents, subscribe],
  );

  const handleUnsubscribe = useCallback(
    (matchId: string) => {
      unsubscribe(matchId);
    },
    [unsubscribe],
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
        isPanelOpen={isPanelOpen}
        onTogglePanel={() => setIsPanelOpen(!isPanelOpen)}
      />

      <main
        className={cn(
          "flex-1 transition-all duration-300",
       
        )}
      >
        <div className="container mx-auto px-4 py-6">
          {/* Page Title */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-bold font-serif text-2xl text-orange-900 md:text-3xl">
                  Live Sports Scores
                </h1>
                <p className="mt-1 text-orange-600">
                  Stay updated with real-time match scores and events
                </p>
              </div>

              {/* Toggle Panel Button - Mobile */}
              <Button
                variant="outline"
                className="border-orange-200 text-orange-700 lg:hidden"
                onClick={() => setIsPanelOpen(!isPanelOpen)}
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
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        liveEvents={liveEvents}
        onShowMatchDetails={handleShowDetails}
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
