import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface InformationProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Information({ isOpen, setIsOpen }: InformationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="text-white max-w-sm">
        <DialogHeader className="w-full min-w-0">
          <DialogTitle className="text-2xl font-bold mb-1 flex">
            Information
          </DialogTitle>

          <DialogDescription className="text-left">
            topSify displays your top tracks and artists based on your Spotify
            listening history.
          </DialogDescription>
        </DialogHeader>
        <Separator />

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
            All music data is sourced from Spotify and reflects your listening
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
