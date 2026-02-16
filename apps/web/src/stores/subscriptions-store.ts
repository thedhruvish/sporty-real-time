import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LiveEvent, Match } from "@/types/sports";

interface SubscribedMatch {
  match: Match;
  events: LiveEvent[];
  order: number;
}

interface SubscriptionsStore {
  subscribedMatches: SubscribedMatch[];

  // Actions
  subscribe: (match: Match, events: LiveEvent[]) => void;
  unsubscribe: (matchId: string) => void;
  updateEvents: (matchId: string, events: LiveEvent[]) => void;
  reorderMatches: (fromIndex: number, toIndex: number) => void;
  isSubscribed: (matchId: string) => boolean;
  getSubscribedMatch: (matchId: string) => SubscribedMatch | undefined;
  clearAll: () => void;
}

export const useSubscriptionsStore = create<SubscriptionsStore>()(
  persist(
    (set, get) => ({
      subscribedMatches: [],

      subscribe: (match, events) => {
        const { subscribedMatches } = get();

        // Don't add if already subscribed
        if (subscribedMatches.some((sm) => sm.match.id === match.id)) {
          return;
        }

        const newSubscription: SubscribedMatch = {
          match,
          events,
          order: subscribedMatches.length,
        };

        set({
          subscribedMatches: [...subscribedMatches, newSubscription],
        });
      },

      unsubscribe: (matchId) => {
        set((state) => ({
          subscribedMatches: state.subscribedMatches
            .filter((sm) => sm.match.id !== matchId)
            .map((sm, index) => ({ ...sm, order: index })),
        }));
      },

      updateEvents: (matchId, events) => {
        set((state) => ({
          subscribedMatches: state.subscribedMatches.map((sm) =>
            sm.match.id === matchId ? { ...sm, events } : sm,
          ),
        }));
      },

      reorderMatches: (fromIndex, toIndex) => {
        set((state) => {
          const newMatches = [...state.subscribedMatches];
          const [removed] = newMatches.splice(fromIndex, 1);
          newMatches.splice(toIndex, 0, removed);

          return {
            subscribedMatches: newMatches.map((sm, index) => ({
              ...sm,
              order: index,
            })),
          };
        });
      },

      isSubscribed: (matchId) => {
        return get().subscribedMatches.some((sm) => sm.match.id === matchId);
      },

      getSubscribedMatch: (matchId) => {
        return get().subscribedMatches.find((sm) => sm.match.id === matchId);
      },

      clearAll: () => {
        set({ subscribedMatches: [] });
      },
    }),
    {
      name: "sportx-subscriptions",
    },
  ),
);
