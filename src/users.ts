import { queryOptions } from '@tanstack/react-query';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export function usersQueryOptions() {
  return queryOptions({
    queryKey: ['users'],
    async queryFn() {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      return response.json() as Promise<User[]>;
    },
  });
}
