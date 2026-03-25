"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TimeRangeType } from "@/lib/types";
import { ChevronDown, Info, LogOut } from "lucide-react";
import { useState } from "react";
import Information from "./Information";
import { Button } from "./ui/button";

interface GlobalControlsProps {
  timeRange: TimeRangeType;
  setTimeRange: (range: TimeRangeType) => void;
  children?: React.ReactNode;
}

const timeRangeMapping: Record<TimeRangeType, string> = {
  short_term: "Short-term",
  medium_term: "Medium-term",
  long_term: "Long-term",
};

export default function GlobalControls({
  timeRange,
  setTimeRange,
  children,
}: GlobalControlsProps) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2 justify-center items-center w-full sm:w-auto px-2 sm:px-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {timeRangeMapping[timeRange]}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background">
            <DropdownMenuRadioGroup
              value={timeRange}
              onValueChange={(value) => setTimeRange(value as TimeRangeType)}
            >
              <DropdownMenuRadioItem value="short_term">
                {timeRangeMapping["short_term"]}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="medium_term">
                {timeRangeMapping["medium_term"]}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="long_term">
                {timeRangeMapping["long_term"]}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {children}

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setIsInfoOpen(true)}
                aria-label="About & how to use"
              >
                <Info />
              </Button>
            </TooltipTrigger>
            <TooltipContent>About & How to Use</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" aria-label="Log out" asChild>
                <a href="/api/logout">
                  <LogOut />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Log out</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Information isOpen={isInfoOpen} setIsOpen={setIsInfoOpen} />
    </>
  );
}
