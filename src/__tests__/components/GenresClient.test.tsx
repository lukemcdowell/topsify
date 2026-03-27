import GenresClient from "@/app/dashboard/genres/GenresClient";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeArtists } from "../fixtures";

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

// Recharts tries to measure DOM nodes — skip the chart in unit tests
vi.mock("recharts", () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  LabelList: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-container">{children}</div>,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function makeArtistsWithGenres(count: number) {
  return makeArtists(count).map((a, i) => ({
    ...a,
    genres: i % 2 === 0 ? ["pop", "indie pop"] : ["rock", "indie rock"],
  }));
}

function makeArtistsResponse(count = 50) {
  return () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(makeArtistsWithGenres(count)),
    });
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("GenresClient", () => {
  it("shows a skeleton while loading", () => {
    mockFetch.mockReturnValue(new Promise(() => {}));

    render(<GenresClient />);

    // Skeleton is rendered as an animate-pulse div while loading
    const skeleton = document.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders the bar chart after data loads", async () => {
    mockFetch.mockImplementation(makeArtistsResponse(50));

    render(<GenresClient />);

    await waitFor(() => {
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });
  });

  it("fetches artists with limit=50 for each time range", async () => {
    mockFetch.mockImplementation(makeArtistsResponse(50));

    render(<GenresClient />);

    await waitFor(() => {
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });

    const calls: string[] = mockFetch.mock.calls.map((c) => c[0]);
    expect(calls.some((u) => u.includes("limit=50") && u.includes("long_term"))).toBe(true);
    expect(calls.some((u) => u.includes("limit=50") && u.includes("medium_term"))).toBe(true);
    expect(calls.some((u) => u.includes("limit=50") && u.includes("short_term"))).toBe(true);
  });

  it("shows a skeleton when switching to an unloaded time range", async () => {
    const user = userEvent.setup();

    mockFetch.mockImplementation((url: string) => {
      if (url.includes("short_term")) return new Promise(() => {});
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(makeArtistsWithGenres(50)),
      });
    });

    render(<GenresClient />);

    await waitFor(() => {
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Short-term" }));

    const skeleton = document.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();
  });

  it("shows an error alert when fetch fails", async () => {
    mockFetch.mockResolvedValue({ ok: false, json: () => Promise.resolve([]) });

    render(<GenresClient />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("shows an error alert when fetch throws", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    render(<GenresClient />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
