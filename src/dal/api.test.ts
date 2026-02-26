import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchPlayers, fetchSuspects } from "./api";

const createMockResponse = (body: unknown, headers?: Record<string, string>, ok = true) => ({
  ok,
  status: ok ? 200 : 500,
  json: () => Promise.resolve(body),
  headers: new Headers(headers),
});

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("fetchPlayers", () => {
  it("constructs the correct URL with required params", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      createMockResponse([], { "x-total": "42" }),
    );
    vi.stubGlobal("fetch", mockFetch);

    await fetchPlayers({ start: 10, n: 20 });

    const calledUrl = new URL(mockFetch.mock.calls[0][0]);
    expect(calledUrl.pathname).toBe("/api/v1/players");
    expect(calledUrl.searchParams.get("start")).toBe("10");
    expect(calledUrl.searchParams.get("n")).toBe("20");
  });

  it("includes optional level and search params when provided", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      createMockResponse([], { "x-total": "5" }),
    );
    vi.stubGlobal("fetch", mockFetch);

    await fetchPlayers({ start: 0, n: 10, level: "pro", search: "alice" });

    const calledUrl = new URL(mockFetch.mock.calls[0][0]);
    expect(calledUrl.searchParams.get("level")).toBe("pro");
    expect(calledUrl.searchParams.get("search")).toBe("alice");
  });

  it("parses players and x-total header into PlayersResponse", async () => {
    const players = [{ id: 1, name: "alice", level: "rookie", score: 80 }];
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      createMockResponse(players, { "x-total": "100" }),
    ));

    const result = await fetchPlayers({ start: 0, n: 10 });

    expect(result.players).toEqual(players);
    expect(result.total).toBe(100);
  });

  it("throws on non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      createMockResponse(null, {}, false),
    ));

    await expect(fetchPlayers({ start: 0, n: 10 })).rejects.toThrow("Failed to fetch players: 500");
  });

  it("forwards AbortSignal to fetch", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      createMockResponse([], { "x-total": "0" }),
    );
    vi.stubGlobal("fetch", mockFetch);

    const controller = new AbortController();
    await fetchPlayers({ start: 0, n: 10 }, controller.signal);

    expect(mockFetch.mock.calls[0][1]).toEqual({ signal: controller.signal });
  });
});

describe("fetchSuspects", () => {
  it("returns an array of suspect IDs", async () => {
    const ids = [34, 69, 124];
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(createMockResponse(ids)));

    const result = await fetchSuspects();

    expect(result).toEqual(ids);
  });

  it("throws on non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      createMockResponse(null, {}, false),
    ));

    await expect(fetchSuspects()).rejects.toThrow("Failed to fetch suspects: 500");
  });

  it("forwards AbortSignal to fetch", async () => {
    const mockFetch = vi.fn().mockResolvedValue(createMockResponse([]));
    vi.stubGlobal("fetch", mockFetch);

    const controller = new AbortController();
    await fetchSuspects(controller.signal);

    expect(mockFetch.mock.calls[0][1]).toEqual({ signal: controller.signal });
  });
});
