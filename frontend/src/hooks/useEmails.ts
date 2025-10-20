import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiService, Email, SearchParams } from '../services/api';

export interface SearchResponse {
  emails: Email[];
  total: number;
  page: number;
  pageSize: number;
}

export function useEmails(searchParams: SearchParams) {
  return useQuery<SearchResponse>(
    ['emails', searchParams],
    () => apiService.searchEmails(searchParams),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      keepPreviousData: true
    }
  );
}

export function useEmailDetail(id: string) {
  return useQuery<Email>(
    ['email', id],
    () => apiService.getEmailById(id),
    {
      enabled: !!id,
    }
  );
}

export function useSuggestedReply(emailId: string) {
  return useMutation<string>(() => apiService.getSuggestedReply(emailId));
}

export function useRecentEmails(accountId: string) {
  return useQuery<Email[]>(
    ['recentEmails', accountId],
    () => apiService.getRecentEmails(accountId),
    {
      enabled: !!accountId,
      refetchInterval: 30000,
    }
  );
}

export function useEmailSync() {
  const queryClient = useQueryClient();
  return useMutation(() => apiService.syncEmails(), {
    onSuccess: () => {
      queryClient.invalidateQueries('emails');
      queryClient.invalidateQueries('recentEmails');
    }
  });
}