import CreatePlaylist from "@/components/CreatePlaylist";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function renderDialog(overrides?: Partial<React.ComponentProps<typeof CreatePlaylist>>) {
  const defaultProps = {
    isDialogOpen: true,
    setIsDialogOpen: vi.fn(),
    timeRange: "long_term" as const,
    trackUris: ["spotify:track:1", "spotify:track:2"],
    defaultPlaylistName: "My long-term top tracks",
  };
  return render(<CreatePlaylist {...defaultProps} {...overrides} />);
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("CreatePlaylist", () => {
  it("renders the dialog form when open", () => {
    renderDialog();
    // Dialog title and button both say "Create playlist" — check by role
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("My long-term top tracks"),
    ).toBeInTheDocument();
    expect(screen.getByText("Make playlist public")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create playlist/i }),
    ).toBeInTheDocument();
  });

  it("does not render when isDialogOpen is false", () => {
    renderDialog({ isDialogOpen: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows success state after playlist is created", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ playlistId: "new-playlist-id" }),
    });

    renderDialog();

    await user.click(screen.getByRole("button", { name: /create playlist/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Playlist created successfully!"),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("link", { name: /open in spotify/i }),
    ).toBeInTheDocument();
  });

  it("calls /api/createPlaylist with correct payload on submit", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ playlistId: "p1" }),
    });

    renderDialog();

    const nameInput = screen.getByPlaceholderText("My long-term top tracks");
    await user.clear(nameInput);
    await user.type(nameInput, "Custom Name");
    await user.click(screen.getByRole("button", { name: /create playlist/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/createPlaylist",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("Custom Name"),
        }),
      );
    });
  });

  it("uses defaultPlaylistName when name input is empty", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ playlistId: "p1" }),
    });

    renderDialog();
    await user.click(screen.getByRole("button", { name: /create playlist/i }));

    await waitFor(() => {
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.playlistName).toBe("My long-term top tracks");
    });
  });

  it("shows error state when API call fails", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({ ok: false });

    renderDialog();
    await user.click(screen.getByRole("button", { name: /create playlist/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Something went wrong. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("shows try again button on error and can reset", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue({ ok: false });

    renderDialog();
    await user.click(screen.getByRole("button", { name: /create playlist/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    });

    // Clicking "Try again" resets the error state
    await user.click(screen.getByRole("button", { name: /try again/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /create playlist/i }),
      ).toBeInTheDocument();
    });
  });
});
