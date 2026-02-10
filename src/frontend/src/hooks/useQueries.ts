import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { PricingPlan, UserProfile, SiteSettings, EditableSettings, ExternalBlob, UserRole, AdminPrincipal } from '../backend';

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
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Claim first admin role (bootstrap)
export function useClaimFirstAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Must be signed in to claim admin role');
      
      try {
        // Assign admin role to caller
        await actor.assignCallerUserRole(identity.getPrincipal(), 'admin' as UserRole);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized') || error.message?.includes('already')) {
          throw new Error('Admin access has already been claimed. Please contact an existing administrator.');
        }
        throw new Error('Failed to set up admin access. Please try again.');
      }
    },
    onSuccess: () => {
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
      if (!actor) return [];
      try {
        return await actor.getAdminList();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You do not have permission to view the admin list. Admin access required.');
        }
        console.error('Error fetching admin list:', error);
        return [];
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
    mutationFn: async (principalText: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.addAdmin(principalText);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You do not have permission to add admins. Admin access required.');
        }
        throw new Error('Failed to add admin. Please check the principal ID and try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminList'] });
      queryClient.invalidateQueries({ queryKey: ['adminsExist'] });
    },
  });
}

export function useRemoveAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalText: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.removeAdmin(principalText);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You do not have permission to remove admins. Admin access required.');
        }
        if (error.message?.includes('last admin')) {
          throw new Error('Cannot remove the last admin. At least one admin must remain.');
        }
        if (error.message?.includes('yourself')) {
          throw new Error('You cannot remove yourself as an admin.');
        }
        throw new Error('Failed to remove admin. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminList'] });
      queryClient.invalidateQueries({ queryKey: ['adminsExist'] });
    },
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

// Site Settings
export function useGetSiteSettings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SiteSettings>({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getSiteSettings();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateSiteSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: EditableSettings) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateSiteSettings(settings);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You do not have permission to update site settings. Admin access required.');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
    },
  });
}

// Logo Management
export function useGetLogo() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ExternalBlob | null>({
    queryKey: ['logo'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getLogo();
      } catch (error) {
        console.error('Error fetching logo:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useUpdateLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blob: ExternalBlob) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.updateLogo(blob);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You do not have permission to update the logo. Admin access required.');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logo'] });
    },
  });
}
