import {
  Calendar,
  CheckCircle,
  PanelRightOpen,
  Radio,
  Trophy,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Footer,
  Header,
  MatchCard,
  MatchDetailsModal,
  SubscriptionPanel,
} from "@/components/sports";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLiveEvents, getMatches } from "@/lib/sports-api";
import { cn } from "@/lib/utils";
import { useSubscriptionsStore } from "@/stores/subscriptions-store";
import type { LiveEvent, Match } from "@/types/sports";

const mockMatches: Match[] = [
  {
    id: "1",
    sportId: "sport-1",
    leagueId: "league-1",
    teamAId: "team-1",
    teamBId: "team-2",
    status: "live",
    startTime: new Date().toISOString(),
    score: { teamA: 2, teamB: 1 },
    currentMinute: 67,
    sport: {
      id: "sport-1",
      name: "Football",
      slug: "football",
      isActive: true,
    },
    league: {
      id: "league-1",
      sportId: "sport-1",
      name: "Premier League",
      country: "England",
      slug: "premier-league",
    },
    teamA: {
      id: "team-1",
      sportId: "sport-1",
      name: "Manchester United",
      shortCode: "MUN",
    },
    teamB: {
      id: "team-2",
      sportId: "sport-1",
      name: "Liverpool",
      shortCode: "LIV",
    },
  },
  {
    id: "2",
    sportId: "sport-1",
    leagueId: "league-1",
    teamAId: "team-3",
    teamBId: "team-4",
    status: "live",
    startTime: new Date().toISOString(),
    score: { teamA: 0, teamB: 0 },
    currentMinute: 23,
    sport: {
      id: "sport-1",
      name: "Football",
      slug: "football",
      isActive: true,
    },
    league: {
      id: "league-1",
      sportId: "sport-1",
      name: "Premier League",
      country: "England",
      slug: "premier-league",
    },
    teamA: {
      id: "team-3",
      sportId: "sport-1",
      name: "Arsenal",
      shortCode: "ARS",
    },
    teamB: {
      id: "team-4",
      sportId: "sport-1",
      name: "Chelsea",
      shortCode: "CHE",
    },
  },
  {
    id: "3",
    sportId: "sport-1",
    leagueId: "league-2",
    teamAId: "team-5",
    teamBId: "team-6",
    status: "halftime",
    startTime: new Date().toISOString(),
    score: { teamA: 1, teamB: 1 },
    currentMinute: 45,
    sport: {
      id: "sport-1",
      name: "Football",
      slug: "football",
      isActive: true,
    },
    league: {
      id: "league-2",
      sportId: "sport-1",
      name: "La Liga",
      country: "Spain",
      slug: "la-liga",
    },
    teamA: {
      id: "team-5",
      sportId: "sport-1",
      name: "Real Madrid",
      shortCode: "RMA",
    },
    teamB: {
      id: "team-6",
      sportId: "sport-1",
      name: "Barcelona",
      shortCode: "BAR",
    },
  },
  {
    id: "4",
    sportId: "sport-1",
    leagueId: "league-1",
    teamAId: "team-7",
    teamBId: "team-8",
    status: "scheduled",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    sport: {
      id: "sport-1",
      name: "Football",
      slug: "football",
      isActive: true,
    },
    league: {
      id: "league-1",
      sportId: "sport-1",
      name: "Premier League",
      country: "England",
      slug: "premier-league",
    },
    teamA: {
      id: "team-7",
      sportId: "sport-1",
      name: "Tottenham",
      shortCode: "TOT",
    },
    teamB: {
      id: "team-8",
      sportId: "sport-1",
      name: "Manchester City",
      shortCode: "MCI",
    },
  },
  {
    id: "5",
    sportId: "sport-1",
    leagueId: "league-2",
    teamAId: "team-9",
    teamBId: "team-10",
    status: "scheduled",
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    sport: {
      id: "sport-1",
      name: "Football",
      slug: "football",
      isActive: true,
    },
    league: {
      id: "league-2",
      sportId: "sport-1",
      name: "La Liga",
      country: "Spain",
      slug: "la-liga",
    },
    teamA: {
      id: "team-9",
      sportId: "sport-1",
      name: "Atletico Madrid",
      shortCode: "ATM",
    },
    teamB: {
      id: "team-10",
      sportId: "sport-1",
      name: "Sevilla",
      shortCode: "SEV",
    },
  },
  {
    id: "6",
    sportId: "sport-1",
    leagueId: "league-3",
    teamAId: "team-11",
    teamBId: "team-12",
    status: "finished",
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    score: { teamA: 3, teamB: 2 },
    sport: {
      id: "sport-1",
      name: "Football",
      slug: "football",
      isActive: true,
    },
    league: {
      id: "league-3",
      sportId: "sport-1",
      name: "Serie A",
      country: "Italy",
      slug: "serie-a",
    },
    teamA: {
      id: "team-11",
      sportId: "sport-1",
      name: "AC Milan",
      shortCode: "ACM",
    },
    teamB: {
      id: "team-12",
      sportId: "sport-1",
      name: "Inter Milan",
      shortCode: "INT",
    },
  },
  {
    id: "7",
    sportId: "sport-1",
    leagueId: "league-3",
    teamAId: "team-13",
    teamBId: "team-14",
    status: "finished",
    startTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    score: { teamA: 1, teamB: 1 },
    sport: {
      id: "sport-1",
      name: "Football",
      slug: "football",
      isActive: true,
    },
    league: {
      id: "league-3",
      sportId: "sport-1",
      name: "Serie A",
      country: "Italy",
      slug: "serie-a",
    },
    teamA: {
      id: "team-13",
      sportId: "sport-1",
      name: "Juventus",
      shortCode: "JUV",
    },
    teamB: {
      id: "team-14",
      sportId: "sport-1",
      name: "Napoli",
      shortCode: "NAP",
    },
  },
];

const mockLiveEvents: LiveEvent[] = [
  {
    id: "e1",
    matchId: "1",
    eventSequence: 67,
    eventType: "goal",
    message:
      "GOAL! Marcus Rashford scores with a brilliant header from the edge of the box!",
    isHighlight: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "e2",
    matchId: "1",
    eventSequence: 62,
    eventType: "substitution",
    message:
      "Substitution for Manchester United: Anthony Martial comes on for Jadon Sancho",
    isHighlight: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "e3",
    matchId: "1",
    eventSequence: 55,
    eventType: "yellow_card",
    message: "Yellow card for Virgil van Dijk (Liverpool) - tactical foul",
    isHighlight: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "e4",
    matchId: "1",
    eventSequence: 45,
    eventType: "halftime",
    message: "Half Time - Manchester United 1 - 1 Liverpool",
    isHighlight: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "e5",
    matchId: "1",
    eventSequence: 38,
    eventType: "goal",
    message: "GOAL! Mohamed Salah equalizes for Liverpool with a curling shot!",
    isHighlight: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "e6",
    matchId: "1",
    eventSequence: 22,
    eventType: "goal",
    message: "GOAL! Bruno Fernandes opens the scoring with a powerful strike!",
    isHighlight: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "e7",
    matchId: "1",
    eventSequence: 1,
    eventType: "match_start",
    message:
      "Kick off! Manchester United vs Liverpool is underway at Old Trafford",
    isHighlight: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "e8",
    matchId: "2",
    eventSequence: 23,
    eventType: "yellow_card",
    message: "Yellow card for Bukayo Saka (Arsenal) - dissent",
    isHighlight: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "e9",
    matchId: "2",
    eventSequence: 15,
    eventType: "substitution",
    message:
      "Substitution for Chelsea: Raheem Sterling comes on for Mykhailo Mudryk",
    isHighlight: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "e10",
    matchId: "2",
    eventSequence: 1,
    eventType: "match_start",
    message: "Kick off! Arsenal vs Chelsea at Emirates Stadium",
    isHighlight: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "e11",
    matchId: "3",
    eventSequence: 42,
    eventType: "goal",
    message: "GOAL! Vinicius Jr scores for Real Madrid!",
    isHighlight: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "e12",
    matchId: "3",
    eventSequence: 35,
    eventType: "goal",
    message: "GOAL! Robert Lewandowski equalizes for Barcelona!",
    isHighlight: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "e13",
    matchId: "3",
    eventSequence: 1,
    eventType: "match_start",
    message: "El Clasico underway at Santiago Bernabeu!",
    isHighlight: false,
    createdAt: new Date().toISOString(),
  },
];

export function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  const { subscribe, unsubscribe, isSubscribed } = useSubscriptionsStore();

  const fetchData = useCallback(async () => {
    try {
      const [matchesData, eventsData] = await Promise.all([
        getMatches(),
        getLiveEvents(),
      ]);
      setMatches(matchesData);
      setLiveEvents(eventsData);
      setUseMockData(false);
    } catch (error) {
      console.log("API not available, using mock data");
      setMatches(mockMatches);
      setLiveEvents(mockLiveEvents);
      setUseMockData(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchData();
  }, [fetchData]);

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
          "container mx-auto flex-1 px-4 py-6 transition-all duration-300",
          isPanelOpen && "mr-0 lg:mr-96",
        )}
      >
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
              {useMockData && (
                <p className="mt-2 text-orange-500 text-xs italic">
                  (Using demo data - Backend not connected)
                </p>
              )}
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
                <Badge variant="default" className="ml-1 bg-red-500 text-white">
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
                          match.status === "live" || match.status === "halftime"
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

function MatchCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-orange-100 bg-white shadow-sm">
      <div className="border-orange-100 border-b bg-gradient-to-r from-orange-50 to-white px-4 py-3">
        <Skeleton className="h-4 w-24 bg-orange-100" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 flex-col items-center gap-2">
            <Skeleton className="h-14 w-14 rounded-full bg-orange-100" />
            <Skeleton className="h-4 w-20 bg-orange-100" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 bg-orange-100" />
            <Skeleton className="h-4 w-2 bg-orange-100" />
            <Skeleton className="h-8 w-8 bg-orange-100" />
          </div>
          <div className="flex flex-1 flex-col items-center gap-2">
            <Skeleton className="h-14 w-14 rounded-full bg-orange-100" />
            <Skeleton className="h-4 w-20 bg-orange-100" />
          </div>
        </div>
      </div>
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
