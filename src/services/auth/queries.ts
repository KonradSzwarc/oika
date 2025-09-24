import { queryOptions } from '@tanstack/react-query';
import { getCurrentUser } from './fn';

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: ['currentUser'],
    queryFn: () => getCurrentUser({} as never),
  });
}
