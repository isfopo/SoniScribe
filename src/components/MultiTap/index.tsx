import { Subdivision } from "../../helpers/subdivisions";
import { Button } from "../Button";
import { ButtonGroup } from "../ButtonGroup";

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
    <ButtonGroup>
      {subdivisions.map((subdivision) => (
        <Button
          key={subdivision}
          type="button"
          onClick={() => onSelect(subdivision)}
        >
          {SubdivisionIcons[subdivision]}
        </Button>
      ))}
    </ButtonGroup>
  );
};
