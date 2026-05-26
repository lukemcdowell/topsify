import DashboardClient from "@/app/DashboardClient";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeArtists, makeTracks } from "../fixtures";

// Mock heavy child components to keep the test focused on data/state logic
vi.mock("@/components/TopTrack", () => ({
  default: ({ trackData }: { trackData: { name: string } }) =>
    <div data-testid="track-item">{trackData.name}</div>,
}));

vi.mock("@/components/TopArtist", () => ({
  default: ({ artistData }: { artistData: { name: string } }) =>
    <div data-testid="artist-item">{artistData.name}</div>,
}));

vi.mock("@/components/TopTrackSkeleton", () => ({
  default: () => <div data-testid="track-skeleton" />,
}));

vi.mock("@/components/TopArtistSkeleton", () => ({
  default: () => <div data-testid="artist-skeleton" />,
}));

vi.mock("@/components/GlobalControls", () => ({
  default: ({
    setTimeRange,
  }: {
    timeRange: string;
    setTimeRange: (r: string) => void;
  }) => (
    <div>
      <button onClick={() => setTimeRange("short_term")}>Short-term</button>
      <button onClick={() => setTimeRange("medium_term")}>Medium-term</button>
      <button onClick={() => setTimeRange("long_term")}>Long-term</button>
    </div>
  ),
}));

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    <a href={href}>{children}</a>,
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function mockApiResponse(tracks: unknown[], artists: unknown[]) {
  return (url: string) => {
    const isTrack = url.includes("type=tracks");
    const data = isTrack ? tracks : artists;
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    });
  };
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("DashboardClient", () => {
  it("shows skeletons while long_term data is loading", () => {
    // Never resolves — keeps loading state
    mockFetch.mockReturnValue(new Promise(() => {}));

    render(<DashboardClient />);

    expect(screen.getAllByTestId("track-skeleton")).toHaveLength(5);
    expect(screen.getAllByTestId("artist-skeleton")).toHaveLength(5);
  });

  it("renders tracks and artists after data loads", async () => {
    const tracks = makeTracks(5);
    const artists = makeArtists(5);

    mockFetch.mockImplementation(mockApiResponse(tracks, artists));

    render(<DashboardClient />);

    await waitFor(() => {
      expect(screen.getAllByTestId("track-item")).toHaveLength(5);
    });

    expect(screen.getAllByTestId("artist-item")).toHaveLength(5);
    expect(screen.getByText("Track 1")).toBeInTheDocument();
    expect(screen.getByText("Artist 1")).toBeInTheDocument();
  });

  it("shows error alert when fetch fails", async () => {
    mockFetch.mockResolvedValue({ ok: false, json: () => Promise.resolve([]) });

    render(<DashboardClient />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("shows error alert when fetch throws", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    render(<DashboardClient />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
