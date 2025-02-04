import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll, vi } from "vitest";
import { server } from "./__tests__/mockServer";

window.HTMLElement.prototype.scrollIntoView = vi.fn();


beforeAll(() => server.listen({ onUnhandledRequest: (req) => {
  console.info(`=== ${req.method} ${req.url} isn't mocked ===`)
}}));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
