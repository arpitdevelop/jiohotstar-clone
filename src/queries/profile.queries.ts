import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  subscriptionType: 'Premium' | 'Super' | 'Free';
  memberSince: string;
  mobileNo: string;
}

export const useProfileDetails = () => {
  return useQuery({
    queryKey: queryKeys.profile.details,
    queryFn: async (): Promise<UserProfile> => {
      // Mock delayed response
      return {
        name: 'Arpit',
        email: 'arpit@example.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60',
        subscriptionType: 'Premium',
        memberSince: 'July 2024',
        mobileNo: '+91 98765 43210',
      };
    },
  });
};
