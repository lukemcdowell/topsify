import TopTrack from "@/components/TopTrack";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { mockTrack } from "../fixtures";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) =>
    React.createElement("img", { src, alt }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => React.createElement("a", { href, ...props }, children),
}));

describe("TopTrack", () => {
  it("renders the track name and artist", () => {
    render(<TopTrack index={0} trackData={mockTrack} />);
    expect(screen.getByText("Test Track")).toBeInTheDocument();
    expect(screen.getByText("Test Artist")).toBeInTheDocument();
  });

  it("renders the album image with correct alt text", () => {
    render(<TopTrack index={0} trackData={mockTrack} />);
    expect(
      screen.getByAltText("Test Track by Test Artist"),
    ).toBeInTheDocument();
  });

  it("shows the correct rank in the dialog after clicking (index + 1)", async () => {
    const user = userEvent.setup();
    render(<TopTrack index={4} trackData={mockTrack} />);

    await user.click(screen.getByText("Test Track"));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(screen.getByText("#5")).toBeInTheDocument();
  });

  it("opens the detail dialog when the card is clicked", async () => {
    const user = userEvent.setup();
    render(<TopTrack index={2} trackData={mockTrack} />);

    // Click the track name text which is inside the Card
    await user.click(screen.getByText("Test Track"));

    // Dialog renders rank as #3 (index 2 + 1)
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(screen.getByText("#3")).toBeInTheDocument();
  });

  it("dialog contains a link to the track's Spotify page", async () => {
    const user = userEvent.setup();
    render(<TopTrack index={0} trackData={mockTrack} />);

    await user.click(screen.getByText("Test Track"));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const links = screen.getAllByRole("link");
    const trackLink = links.find(
      (l) => l.getAttribute("href") === mockTrack.external_urls.spotify,
    );
    expect(trackLink).toBeDefined();
  });
});
