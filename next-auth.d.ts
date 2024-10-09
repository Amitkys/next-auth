import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;          // Add the `id` field
      name: string;
      email: string;
      image?: string;
    };
  }

  interface User {
    id: string;            // Ensure the `id` field is present in the `User` type
  }
}
