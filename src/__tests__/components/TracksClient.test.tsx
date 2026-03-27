import TracksClient from "@/app/dashboard/tracks/TracksClient";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeTracks } from "../fixtures";

vi.mock("@/components/TopTrack", () => ({
  default: ({ trackData }: { trackData: { name: string } }) =>
    <div data-testid="track-item">{trackData.name}</div>,
}));

vi.mock("@/components/TopTrackSkeleton", () => ({
  default: () => <div data-testid="track-skeleton" />,
}));

vi.mock("@/components/Top50Grid", () => ({
  default: ({ children }: { children: React.ReactNode }) =>
    <div data-testid="grid">{children}</div>,
}));

vi.mock("@/components/PageHeader", () => ({
  default: ({
    setTimeRange,
  }: {
    timeRange: string;
    setTimeRange: (r: string) => void;
    selected: string;
  }) => (
    <div>
      <button onClick={() => setTimeRange("short_term")}>Short-term</button>
      <button onClick={() => setTimeRange("medium_term")}>Medium-term</button>
      <button onClick={() => setTimeRange("long_term")}>Long-term</button>
    </div>
  ),
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function makeTracksResponse(count = 50) {
  return (url: string) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(makeTracks(count)),
    });
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("TracksClient", () => {
  it("shows 50 skeletons while loading", () => {
    mockFetch.mockReturnValue(new Promise(() => {}));

    render(<TracksClient />);

    expect(screen.getAllByTestId("track-skeleton")).toHaveLength(50);
  });

  it("renders 50 track items after data loads", async () => {
    mockFetch.mockImplementation(makeTracksResponse(50));

    render(<TracksClient />);

    await waitFor(() => {
      expect(screen.getAllByTestId("track-item")).toHaveLength(50);
    });
  });

  it("shows skeletons when switching to an unloaded time range", async () => {
    const user = userEvent.setup();

    // Only resolve long_term immediately; keep short_term pending
    mockFetch.mockImplementation((url: string) => {
      if (url.includes("short_term")) return new Promise(() => {});
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(makeTracks(50)),
      });
    });

    render(<TracksClient />);

    // Wait for long_term to load
    await waitFor(() => {
      expect(screen.getAllByTestId("track-item")).toHaveLength(50);
    });

    // Switch to short_term (not yet loaded)
    await user.click(screen.getByRole("button", { name: "Short-term" }));

    await waitFor(() => {
      expect(screen.getAllByTestId("track-skeleton")).toHaveLength(50);
    });
  });

  it("shows error alert when fetch fails", async () => {
    mockFetch.mockResolvedValue({ ok: false, json: () => Promise.resolve([]) });

    render(<TracksClient />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
