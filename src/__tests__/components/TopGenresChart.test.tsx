import TopGenresChart from "@/components/TopGenresChart";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { makeArtists } from "../fixtures";

vi.mock("recharts", () => ({
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ data }: { data: { genre: string }[] }) => (
    <div data-testid="pie">
      {data.map((d) => <span key={d.genre} data-testid="pie-slice">{d.genre}</span>)}
    </div>
  ),
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}));

function makeArtistsWithGenres() {
  return [
    { ...makeArtists(1)[0], genres: ["pop", "dance pop"] },
    { ...makeArtists(1)[0], genres: ["pop", "rock"] },
    { ...makeArtists(1)[0], genres: ["rock", "indie rock"] },
    { ...makeArtists(1)[0], genres: ["jazz"] },
    { ...makeArtists(1)[0], genres: ["classical"] },
    { ...makeArtists(1)[0], genres: ["electronic", "house"] },
  ];
}

describe("TopGenresChart", () => {
  it("renders the pie chart", () => {
    render(<TopGenresChart artists={makeArtistsWithGenres()} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renders up to 5 slices", () => {
    render(<TopGenresChart artists={makeArtistsWithGenres()} />);
    expect(screen.getAllByTestId("pie-slice")).toHaveLength(5);
  });

  it("ranks genres by frequency — pop appears as top slice", () => {
    render(<TopGenresChart artists={makeArtistsWithGenres()} />);
    const slices = screen.getAllByTestId("pie-slice");
    expect(slices[0].textContent).toBe("pop");
  });

  it("shows a fallback message when artists have no genres", () => {
    const artists = makeArtists(3).map((a) => ({ ...a, genres: [] }));
    render(<TopGenresChart artists={artists} />);
    expect(screen.getByText(/no genre data available/i)).toBeInTheDocument();
  });

  it("shows a fallback message when artists array is empty", () => {
    render(<TopGenresChart artists={[]} />);
    expect(screen.getByText(/no genre data available/i)).toBeInTheDocument();
  });
});
