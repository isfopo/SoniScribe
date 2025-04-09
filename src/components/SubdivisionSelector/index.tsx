import { SubdivisionPoints } from "../../helpers/subdivisions";
import { Music2, Music3, Music4 } from "lucide-react";
import styles from "./index.module.css";

export interface SubdivisionSelectorProps {
  /** The current subdivision. */
  currentSubdivision: keyof typeof SubdivisionPoints;
  /** The available subdivisions. */
  subdivisions: (keyof typeof SubdivisionPoints)[];
  /** The function to call when the subdivision is selected. */
  onSelect: (subdivision: keyof typeof SubdivisionPoints) => void;
}

/** The icons for each subdivision. Will need to add SVGs - lucide doesn't have all of them. */
const SubdivisionIcons: Record<
  keyof typeof SubdivisionPoints,
  React.ReactNode
> = {
  whole: "1",
  half: <Music3 />,
  quarter: "1/4",
  eighth: <Music2 />,
  sixteenth: <Music4 />,
  thirtySecond: "1/32",
  sixtyFourth: "1/64",
} as const;

export const SubdivisionSelector = ({
  currentSubdivision,
  subdivisions,
  onSelect,
}: SubdivisionSelectorProps) => {
  return (
    <div>
      {subdivisions.map((subdivision) => (
        <button
          key={subdivision}
          type="button"
          onClick={() => onSelect(subdivision)}
          className={`${
            currentSubdivision === subdivision ? styles["selected"] : ""
          }`}
        >
          {SubdivisionIcons[subdivision]}
        </button>
      ))}
    </div>
  );
};
