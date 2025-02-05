import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LogoutButton from "@/components/LogoutButton";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    pathname: "/",
  }),
}));

describe("LogoutButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();

    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  it("should remove 'chatUserName' from localStorage and navigate to home", () => {
    render(<LogoutButton />);

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(localStorage.removeItem).toHaveBeenCalledWith("chatUserName");

    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
