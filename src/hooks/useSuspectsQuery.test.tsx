import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSuspectsQuery } from "./useSuspectsQuery";
import { createQueryWrapper } from "../test/utils";

vi.mock("../dal/api", () => ({
  fetchSuspects: vi.fn(),
}));

import { fetchSuspects } from "../dal/api";
const mockFetchSuspects = vi.mocked(fetchSuspects);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useSuspectsQuery", () => {
  it("fetches and returns suspect IDs", async () => {
    const ids = [34, 69, 124];
    mockFetchSuspects.mockResolvedValue(ids);

    const { result } = renderHook(() => useSuspectsQuery(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.data).toEqual(ids));
  });

  it("passes AbortSignal to fetchSuspects", async () => {
    mockFetchSuspects.mockResolvedValue([]);

    renderHook(() => useSuspectsQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => {
      expect(mockFetchSuspects).toHaveBeenCalledWith(expect.any(AbortSignal));
    });
  });
});
