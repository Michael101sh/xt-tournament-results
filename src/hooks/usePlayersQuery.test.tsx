import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { usePlayersQuery } from "./usePlayersQuery";
import { createQueryWrapper } from "../test/utils";

vi.mock("../dal/api", () => ({
  fetchPlayers: vi.fn(),
}));

import { fetchPlayers } from "../dal/api";
const mockFetchPlayers = vi.mocked(fetchPlayers);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("usePlayersQuery", () => {
  it("calls fetchPlayers with correct start/n derived from page and pageSize", async () => {
    mockFetchPlayers.mockResolvedValue({ players: [], total: 0 });

    renderHook(() => usePlayersQuery(2, 20), { wrapper: createQueryWrapper() });

    await waitFor(() => {
      expect(mockFetchPlayers).toHaveBeenCalledWith(
        { start: 40, n: 20, level: undefined, search: undefined },
        expect.anything(),
      );
    });
  });

  it("normalizes the search term (trim + lowercase)", async () => {
    mockFetchPlayers.mockResolvedValue({ players: [], total: 0 });

    renderHook(() => usePlayersQuery(0, 10, undefined, "  Alice  "), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(mockFetchPlayers).toHaveBeenCalledWith(
        expect.objectContaining({ search: "alice" }),
        expect.anything(),
      );
    });
  });

  it("passes level filter through", async () => {
    mockFetchPlayers.mockResolvedValue({ players: [], total: 0 });

    renderHook(() => usePlayersQuery(0, 10, "pro"), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(mockFetchPlayers).toHaveBeenCalledWith(
        expect.objectContaining({ level: "pro" }),
        expect.anything(),
      );
    });
  });

  it("treats empty/whitespace search as undefined", async () => {
    mockFetchPlayers.mockResolvedValue({ players: [], total: 0 });

    renderHook(() => usePlayersQuery(0, 10, undefined, "   "), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(mockFetchPlayers).toHaveBeenCalledWith(
        expect.objectContaining({ search: undefined }),
        expect.anything(),
      );
    });
  });
});
