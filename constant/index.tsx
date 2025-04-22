import {
    ArrowDown01,
    FolderKanban,
    ListFilterPlus,
    SquareKanban,
    Table,
} from "lucide-react";

export const TABS = [
  {
    id: 1,
    label: "Detailed Board",
    Icon: FolderKanban,
  },
  {
    id: 2,
    label: "Table View",
    Icon: Table,
  },
  {
    id: 3,
    label: "Overview",
    Icon: SquareKanban,
  },
];

export const ACTIONS = [
  {
    label: "Filter",
    Icon: ListFilterPlus,
  },
  {
    label: "Sort",
    Icon: ArrowDown01,
  },
];
