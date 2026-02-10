import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { PricingPlan, UserProfile, SiteSettings, EditableSettings, ExternalBlob, UserRole, AdminPrincipal, Review, ReviewSummary } from '../backend';

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

// Check if any admins exist (for bootstrap flow) - uses explicit backend query
export function useCheckAdminsExist() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['adminsExist'],
    queryFn: async () => {
      if (!actor) return true; // Safe default: assume admins exist if actor not ready
      try {
        return await actor.doesAdminExist();
      } catch (error: any) {
        console.error('Error checking if admins exist:', error);
        return true; // Safe default
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 1 * 60 * 1000, // 1 minute - shorter for more responsive header state
  });
}

// Claim first admin role (bootstrap) - uses backend-enforced claimAdminIfNoneExist
export function useClaimFirstAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Must be signed in to claim admin role');
      
      try {
        // Use backend-enforced claim method with empty tokens (authorization mixin handles initialization)
        await actor.claimAdminIfNoneExist('', '');
      } catch (error: any) {
        // Extract clear error message from backend
        const errorMessage = error.message || '';
        
        if (errorMessage.includes('Admin privileges cannot be claimed after setup')) {
          throw new Error('Admin privileges cannot be claimed after setup. Please contact an existing administrator for access.');
        }
        if (errorMessage.includes('Unauthorized') || errorMessage.includes('authenticated')) {
          throw new Error('You must be signed in to claim admin access.');
        }
        throw new Error('Failed to set up admin access. Please try again.');
      }
    },
    onSuccess: () => {
      // Optimistically set isAdmin to true for immediate UI update
      const principalStr = identity?.getPrincipal().toString();
      if (principalStr) {
        queryClient.setQueryData(['isAdmin', principalStr], true);
      }
      
      // Invalidate all admin-related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['adminsExist'] });
      queryClient.invalidateQueries({ queryKey: ['adminList'] });
    },
  });
}

// Admin List Management
export function useGetAdminList() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<AdminPrincipal[]>({
    queryKey: ['adminList'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getAdminList();
      } catch (error: any) {
        const errorMessage = error.message || '';
        if (errorMessage.includes('Unauthorized')) {
          throw new Error('You do not have permission to view the admin list.');
        }
        throw new Error('Failed to load admin list. Please try again.');
      }
    },
    enabled: !!actor && !!identity && !actorFetching,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useAddAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAdminPrincipal: AdminPrincipal) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.addAdmin(newAdminPrincipal);
      } catch (error: any) {
        const errorMessage = error.message || '';
        if (errorMessage.includes('Unauthorized')) {
          throw new Error('You do not have permission to add administrators.');
        }
        if (errorMessage.includes('Invalid principal') || errorMessage.includes('parse')) {
          throw new Error('Invalid principal ID format. Please check and try again.');
        }
        throw new Error('Failed to add administrator. Please try again.');
      }
    },
    onSuccess: () => {
      // Immediately refetch admin list to show the new admin
      queryClient.invalidateQueries({ queryKey: ['adminList'] });
    },
  });
}

export function useRemoveAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adminPrincipal: AdminPrincipal) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.removeAdmin(adminPrincipal);
      } catch (error: any) {
        const errorMessage = error.message || '';
        if (errorMessage.includes('Cannot remove the last admin')) {
          throw new Error('Cannot remove the last administrator. At least one admin must remain.');
        }
        if (errorMessage.includes('Cannot remove yourself')) {
          throw new Error('You cannot remove yourself as an administrator.');
        }
        if (errorMessage.includes('Unauthorized')) {
          throw new Error('You do not have permission to remove administrators.');
        }
        throw new Error('Failed to remove administrator. Please try again.');
      }
    },
    onSuccess: () => {
      // Immediately refetch admin list to reflect the removal
      queryClient.invalidateQueries({ queryKey: ['adminList'] });
    },
  });
}

// Pricing Plans
export function useGetAllPricingPlans() {
  const { actor, isFetching } = useActor();

  return useQuery<PricingPlan[]>({
    queryKey: ['pricingPlans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPricingPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePricingPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: {
      name: string;
      description: string;
      priceCents: bigint;
      durationDays: bigint;
      features: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPricingPlan(
        plan.name,
        plan.description,
        plan.priceCents,
        plan.durationDays,
        plan.features
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
    mutationFn: async (plan: {
      id: bigint;
      name: string;
      description: string;
      priceCents: bigint;
      durationDays: bigint;
      features: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePricingPlan(
        plan.id,
        plan.name,
        plan.description,
        plan.priceCents,
        plan.durationDays,
        plan.features
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
      return actor.deletePricingPlan(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingPlans'] });
    },
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  // Return custom state that properly reflects actor dependency
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
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Site Settings
export function useGetSiteSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<SiteSettings>({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSiteSettings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateSiteSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: EditableSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSiteSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
    },
  });
}

// Logo Management
export function useGetLogo() {
  const { actor, isFetching } = useActor();

  return useQuery<ExternalBlob | null>({
    queryKey: ['logo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLogo();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useUpdateLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blob: ExternalBlob) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLogo(blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logo'] });
    },
  });
}

// Reviews
export function useGetReviewSummary() {
  const { actor, isFetching } = useActor();

  return useQuery<ReviewSummary>({
    queryKey: ['reviewSummary'],
    queryFn: async () => {
      if (!actor) return { averageRating: 0, totalCount: BigInt(0) };
      return actor.getReviewSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRecentReviews(limit: number = 10) {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['recentReviews', limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentReviews(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment?: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createReview(BigInt(rating), comment || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewSummary'] });
      queryClient.invalidateQueries({ queryKey: ['recentReviews'] });
    },
  });
}
