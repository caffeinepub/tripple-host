import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { PricingPlan, UserProfile } from '../backend';

// Admin Status
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !!identity && !actorFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserProfile();
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!actor && !!identity && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Pricing Plans
export function useGetAllPricingPlans() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PricingPlan[]>({
    queryKey: ['pricingPlans'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllPricingPlans();
      } catch (error) {
        console.error('Error fetching pricing plans:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreatePricingPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      description: string;
      priceCents: bigint;
      durationDays: bigint;
      features: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.createPricingPlan(
        params.name,
        params.description,
        params.priceCents,
        params.durationDays,
        params.features
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingPlans'] });
    },
  });
}

export function useUpdatePricingPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      name: string;
      description: string;
      priceCents: bigint;
      durationDays: bigint;
      features: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updatePricingPlan(
        params.id,
        params.name,
        params.description,
        params.priceCents,
        params.durationDays,
        params.features
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingPlans'] });
    },
  });
}

export function useDeletePricingPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deletePricingPlan(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingPlans'] });
    },
  });
}
