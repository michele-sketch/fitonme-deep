export interface ImageFile {
  file: File;
  dataUrl: string;
  base64: string;
  mimeType: string;
}

export interface Plan {
  id: 'basic' | 'pro' | 'premium';
  name: string;
  price: number;
  credits: number;
  features: string[];
  mostPopular?: boolean;
}

export type PlanId = 'basic' | 'pro' | 'premium' | null;

// This now represents the data structure for updating a user's profile.
export interface UserProfileData {
  type?: 'professional' | 'private';
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  phone?: string;
  vatNumber?: string;
  sdiCode?: string;
  taxCode?: string;
}

// The main User object, as returned by the Bubble.io API
export interface User extends UserProfileData {
  email: string;
  credits: number;
  plan: PlanId;
}
