import TopArtist from "@/components/TopArtist";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { mockArtist } from "../fixtures";

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

describe("TopArtist", () => {
  it("renders the artist name", () => {
    render(<TopArtist index={0} artistData={mockArtist} />);
    expect(screen.getByText("Test Artist")).toBeInTheDocument();
  });

  it("renders the artist image with correct alt text", () => {
    render(<TopArtist index={0} artistData={mockArtist} />);
    expect(screen.getByAltText("Test Artist")).toBeInTheDocument();
  });

  it("shows the correct rank in the dialog after clicking (index + 1)", async () => {
    const user = userEvent.setup();
    render(<TopArtist index={2} artistData={mockArtist} />);

    await user.click(screen.getByText("Test Artist"));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(screen.getByText("#3")).toBeInTheDocument();
  });

  it("opens the detail dialog when the card is clicked", async () => {
    const user = userEvent.setup();
    render(<TopArtist index={0} artistData={mockArtist} />);

    await user.click(screen.getByText("Test Artist"));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(screen.getByText("#1")).toBeInTheDocument();
  });

  it("dialog contains a link to the artist's Spotify page", async () => {
    const user = userEvent.setup();
    render(<TopArtist index={0} artistData={mockArtist} />);

    await user.click(screen.getByText("Test Artist"));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const links = screen.getAllByRole("link");
    const artistLink = links.find(
      (l) =>
        l.getAttribute("href") === mockArtist.external_urls.spotify,
    );
    expect(artistLink).toBeDefined();
  });
});
