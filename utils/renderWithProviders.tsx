import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        retryDelay: 0,
        refetchInterval: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

export const AllTheProviders = ({
  children,
  client,
}: {
  children: ReactNode;
  client: QueryClient;
}) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  const testQueryClient = createQueryClient();

  return {
    ...render(ui, {
      wrapper: ({ children }) => (
        <AllTheProviders client={testQueryClient}>{children}</AllTheProviders>
      ),
      ...options,
    }),
    queryClient: testQueryClient,
  };
};
