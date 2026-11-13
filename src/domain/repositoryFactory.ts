import { mockRepo } from './mockRepository';
import { SupabaseRepositoryAdapter } from './supabaseAdapter';

const supabaseAdapter = new SupabaseRepositoryAdapter();

export type DataProviderType = 'mock' | 'supabase';

export function getActiveRepository(providerType: DataProviderType = 'mock') {
  if (providerType === 'supabase') {
    return supabaseAdapter;
  }
  return mockRepo;
}

export const activeRepo = mockRepo;
