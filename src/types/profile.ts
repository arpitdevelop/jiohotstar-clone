export interface WatchProfile {
  id: string;
  name: string;
  avatar?: string;
  variant: 'gradient' | 'image' | 'kids' | 'add';
  isActive?: boolean;
  gradient?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  subscriptionType: 'Premium' | 'Super' | 'Free';
  memberSince: string;
  mobileNo: string;
  profiles: WatchProfile[];
}
