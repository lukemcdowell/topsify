import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface InformationProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Information({ isOpen, setIsOpen }: InformationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="text-white max-w-2xl">
        <DialogHeader className="w-full min-w-0">
          <DialogTitle className="text-2xl font-bold mb-1 flex">
            Information
          </DialogTitle>

          <DialogDescription className="text-left mb-6">
            topSify displays the top tracks, artists, and genres from my Spotify
            listening history.
          </DialogDescription>

          <Separator />

          <Alert className="bg-amber-950 border-amber-800 [&>svg]:text-amber-200 mt-6">
            <AlertTitle className="text-amber-200 flex gap-2">
              <TriangleAlert className="h-4 w-4" />
              Disclaimer
            </AlertTitle>
            <AlertDescription>
              This project was originally intended to allow anyone to view their
              top tracks, but Spotify{" "}
              <a
                href="https://developer.spotify.com/documentation/web-api/concepts/quota-modes"
                target="_blank"
                className="underline underline-offset-4 text-amber-200"
              >
                changed their API access policies
              </a>{" "}
              after I built it, so it is now a showcase of my listening history
              only. You can read more about this in my{" "}
              <a
                href="https://lukemcdowell.dev/blog/topsify/"
                className="underline underline-offset-4 text-amber-200"
                target="_blank"
              >
                blog post
              </a>
              .
            </AlertDescription>
          </Alert>
        </DialogHeader>

        <div className="text-gray-300 w-full">
          <h3 className="text-lg font-semibold mb-1">Spotify Time Ranges:</h3>
          <ul className="list-disc list-inside">
            <li>
              <span className="text-primary font-medium">Short Term:</span> Last
              4 weeks
            </li>
            <li>
              <span className="text-primary font-medium">Medium Term:</span>{" "}
              Last 6 months
            </li>
            <li>
              <span className="text-primary font-medium">Long Term:</span> Last
              several years
            </li>
          </ul>
          <p className="mt-4 text-sm text-gray-400">
            All music data is sourced from Spotify and reflects my listening
            habits based on the selected time range.
          </p>
        </div>
        <Separator />
        <div className="text-center sm:text-right">
          Developed by{" "}
          <a
            href="https://lukemcdowell.dev/"
            target="_blank"
            className="font-medium text-primary underline underline-offset-4"
          >
            Luke McDowell
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
