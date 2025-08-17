import { Subdivision } from "../../helpers/subdivisions";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export interface MultiTapProps {
  /** The available subdivisions. */
  subdivisions: Subdivision[];
  /** The function to call when the subdivision is selected. */
  onSelect: (subdivision: Subdivision) => void;
}

/** The icons for each subdivision. Will need to add SVGs - lucide doesn't have all of them. */
const SubdivisionIcons: Record<Subdivision, React.ReactNode> = {
  1: "1",
  2: "1/2",
  4: "1/4",
  8: "1/8",
  16: "1/16",
  32: "1/32",
  64: "1/64",
} as const;

export const MultiTap = ({ subdivisions, onSelect }: MultiTapProps) => {
  return (
    <div className="inline-flex w-fit -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
      {subdivisions.map((subdivision) => (
        <Tooltip key={subdivision}>
          <TooltipTrigger asChild>
            <Button
              className="rounded-none shadow-none focus-visible:z-10"
              variant="outline"
              type="button"
              onClick={() => onSelect(subdivision)}
            >
              {SubdivisionIcons[subdivision]}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">
            {subdivision}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
