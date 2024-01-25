"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type } from "os";

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

const QueryProvider = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
