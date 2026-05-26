import ArtistsClient from "@/app/artists/ArtistsClient";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeArtists } from "../fixtures";

vi.mock("@/components/TopArtist", () => ({
  default: ({ artistData }: { artistData: { name: string } }) =>
    <div data-testid="artist-item">{artistData.name}</div>,
}));

vi.mock("@/components/TopArtistSkeleton", () => ({
  default: () => <div data-testid="artist-skeleton" />,
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

function makeArtistsResponse(count = 50) {
  return () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(makeArtists(count)),
    });
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("ArtistsClient", () => {
  it("shows 50 skeletons while loading", () => {
    mockFetch.mockReturnValue(new Promise(() => {}));

    render(<ArtistsClient />);

    expect(screen.getAllByTestId("artist-skeleton")).toHaveLength(50);
  });

  it("renders 50 artist items after data loads", async () => {
    mockFetch.mockImplementation(makeArtistsResponse(50));

    render(<ArtistsClient />);

    await waitFor(() => {
      expect(screen.getAllByTestId("artist-item")).toHaveLength(50);
    });
  });

  it("shows skeletons when switching to an unloaded time range", async () => {
    const user = userEvent.setup();

    mockFetch.mockImplementation((url: string) => {
      if (url.includes("short_term")) return new Promise(() => {});
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(makeArtists(50)),
      });
    });

    render(<ArtistsClient />);

    await waitFor(() => {
      expect(screen.getAllByTestId("artist-item")).toHaveLength(50);
    });

    await user.click(screen.getByRole("button", { name: "Short-term" }));

    await waitFor(() => {
      expect(screen.getAllByTestId("artist-skeleton")).toHaveLength(50);
    });
  });

  it("shows error alert when fetch fails", async () => {
    mockFetch.mockResolvedValue({ ok: false, json: () => Promise.resolve([]) });

    render(<ArtistsClient />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
