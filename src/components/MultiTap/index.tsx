import { Subdivision, SubdivisionMeta } from "../../helpers/subdivisions";

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
              {SubdivisionMeta[subdivision].icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">
            {SubdivisionMeta[subdivision].label}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
