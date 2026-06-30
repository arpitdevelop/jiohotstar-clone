import { UserProfile } from '@/types/profile';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

export type { UserProfile } from '@/types/profile';

export const useProfileDetails = () => {
  return useQuery({
    queryKey: queryKeys.profile.details,
    queryFn: async (): Promise<UserProfile> => {
      return {
        name: 'Arpit',
        email: 'arpit@example.com',
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60',
        subscriptionType: 'Free',
        memberSince: 'July 2024',
        mobileNo: '+91 7073779867',
        profiles: [
          {
            id: 'arpit',
            name: 'Arpit',
            variant: 'gradient',
            isActive: true,
            gradient: 'linear-gradient(135deg, #0078FF 0%, #00c6ff 100%)',
          },
          {
            id: 'hardika',
            name: 'hardika',
            variant: 'image',
            avatar:
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60',
          },
          {
            id: 'tv',
            name: 'Tv',
            variant: 'image',
            avatar:
              'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=60',
          },
          {
            id: 'kids',
            name: 'Kids',
            variant: 'kids',
          },
          {
            id: 'add',
            name: 'Add',
            variant: 'add',
          },
        ],
      };
    },
  });
};
