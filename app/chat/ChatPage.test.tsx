import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChatPage from "@/app/chat/page";
import { server } from "@/__tests__/mockServer";
import {
  chatMessagesHandler,
  chatMessagesErrorHandler,
  chatEmptyMessagesHandler,
  chatUndefinedMessagesHandler,
  chatSendMessageHandler,
  chatSendMessageErrorHandler,
} from "@/__tests__/handlers/chatHandlers";
import { Message } from "@prisma/client";

// Criando um mock para useRouter do Next.js
const mockPush = vi.fn();
const mockPathname = vi.fn(() => "/chat");

vi.mock("next/navigation", async () => {
  return {
    useRouter: () => ({
      push: mockPush, // Agora garantindo que `push` está mockado corretamente
      replace: vi.fn(),
      prefetch: vi.fn(),
      pathname: "/chat",
    }),
    usePathname: () => mockPathname(),
  };
});

vi.stubGlobal("localStorage", {
  getItem: vi.fn(() => "Jhon"),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
});

describe("ChatPage - Error use case", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 0,
          gcTime: 0, // Corrigido: Agora usamos `gcTime` em vez de `cacheTime`
          retry: false,
        },
      },
    });

    vi.restoreAllMocks();
    vi.clearAllMocks();
    queryClient.clear();
    server.resetHandlers();
  });

  it("should show an error message when the API fails", async () => {
    server.use(chatMessagesErrorHandler); // Ativa o handler de erro antes da renderização

    render(
      <QueryClientProvider client={queryClient}>
        <ChatPage />
      </QueryClientProvider>
    );

    // Aguarda a UI ser atualizada e verifica se a mensagem de erro está presente
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Failed to fetch chat messages"
      );
    });
  });

  it("should pass an empty array to ChatWindow when messages is empty", async () => {
    server.use(chatEmptyMessagesHandler);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Empty/i)).toBeInTheDocument();
    });
  });

  it("should pass an empty array to ChatWindow when messages is undefined", async () => {
    server.use(chatUndefinedMessagesHandler);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Empty/i)).toBeInTheDocument();
    });
  });

  it("should show an error message when sending a message fails", async () => {
    server.use(chatMessagesHandler);
    server.use(chatSendMessageErrorHandler);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatPage />
      </QueryClientProvider>
    );

    const input = screen.getByPlaceholderText("Type a message...");
    const sendButton = screen.getByText("Send");

    fireEvent.change(input, { target: { value: "This will fail" } });
    fireEvent.click(sendButton);

    // Aguarda a execução do erro
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Failed to send message"
      );
    });

    // Verifica se as mensagens anteriores foram restauradas no cache
    const previousMessages = queryClient.getQueryData<{ messages: Message[] }>([
      "chatMessages",
      "Jhon",
    ]);

    expect(previousMessages?.messages.length).toBeGreaterThan(0);
  });
});

describe("ChatPage - Sidebar", () => {
  const queryClient = new QueryClient();
  it("should open the chat when a contact is selected in the sidebar", async () => {
    server.use(chatMessagesHandler);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatPage />
      </QueryClientProvider>
    );

    // Certifica-se que a Sidebar está visível antes de buscar o botão
    const sidebar = screen.getByRole("complementary"); // `role="complementary"` pode ser útil
    expect(sidebar).toBeVisible();

    // Agora busca o botão "Chat Bot"
    const contactButton = await screen.findByText("Chat Bot");

    // Simula clique no contato "Chat Bot"
    fireEvent.click(contactButton);

    // // Agora o chat deve estar visível
    await waitFor(() => {
      expect(screen.getByText("Hi Jhon!")).toBeInTheDocument();
    });
  });
});

describe("ChatPage - Success use case", () => {
  const queryClient = new QueryClient();

  it("should display messages when the chat loads", async () => {
    server.use(chatMessagesHandler); // Ativa o handler correto antes do render

    render(
      <QueryClientProvider client={queryClient}>
        <ChatPage />
      </QueryClientProvider>
    );

    // Aguarda as mensagens "Hello!" e "Hi Jhon!" aparecerem corretamente
    expect(await screen.findByText("Hello!")).toBeInTheDocument();
    expect(await screen.findByText("Hi Jhon!")).toBeInTheDocument();
  });

  it("should send a message when the user submits the form", async () => {
    server.use(chatSendMessageHandler);

    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      )
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ChatPage />
      </QueryClientProvider>
    );

    const input = screen.getByPlaceholderText("Type a message...");
    const sendButton = screen.getByText("Send");

    fireEvent.change(input, { target: { value: "How are you?" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/chat",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ userName: "Jhon", message: "How are you?" }),
        })
      );
    });

    vi.restoreAllMocks();
  });

  it("should close the chat and show the sidebar when 'Back' is clicked", async () => {
    server.use(chatMessagesHandler);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatPage />
      </QueryClientProvider>
    );

    // Verifica se o chat está aberto (botão "Back" visível)
    const backButton = await screen.findByText("← Back");
    expect(backButton).toBeInTheDocument();

    // Clica no botão de voltar
    fireEvent.click(backButton);

    // Verifica se o sidebar está visível novamente
    await waitFor(() => {
      expect(screen.getByText("Chat Bot")).toBeInTheDocument();
    });
  });
});

describe("ChatPage - navigation", () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 0,
          gcTime: 0, // Corrigido: Agora usamos `gcTime` em vez de `cacheTime`
          retry: false,
        },
      },
    });

    vi.restoreAllMocks();
    vi.clearAllMocks();
    queryClient.clear();
    server.resetHandlers();
  });
  it("should navigate to the admin page when 'Admin Panel' is clicked", async () => {
    server.use(chatMessagesHandler);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatPage />
      </QueryClientProvider>
    );

    // Busca o botão "Admin Panel" na tela
    const adminButton = await screen.findByText("Admin Panel");
    expect(adminButton).toBeInTheDocument();

    // Clica no botão
    fireEvent.click(adminButton);

    // Verifica se o router.push("/admin") foi chamado corretamente
    expect(mockPush).toHaveBeenCalledWith("/admin");
  });
});

describe("ChatPage - Authentication rules", async () => {
  let queryClient: QueryClient;
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 0,
          gcTime: 0, // Corrigido: Agora usamos `gcTime` em vez de `cacheTime`
          retry: false,
        },
      },
    });

    vi.restoreAllMocks();
    vi.clearAllMocks();
    queryClient.clear();
    server.resetHandlers();
  });

  it("should remove user from localStorage and navigate to home when 'Logout' is clicked", async () => {
    server.use(chatMessagesHandler);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatPage />
      </QueryClientProvider>
    );

    const logoutButton = await screen.findByText("Logout");
    fireEvent.click(logoutButton);

    expect(localStorage.removeItem).toHaveBeenCalledWith("chatUserName");
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should redirect to home if no user is logged in", async () => {
    // Mocka localStorage para simular que não há usuário logado
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => null), // Simula um `localStorage` vazio
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ChatPage />
      </QueryClientProvider>
    );

    // Aguarda a navegação para a página inicial
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});

