export type ProductionPlanSelectListItem = {
  id: string;
  code: string;
  name: string;
};

export type ProductionPlanListFilter = {
  orderBy: string;
  isAscending: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  code: string;
  name: string;
  expectedStartingDate: Date | string | null;
  dueDate: Date | string | null;
  status: "Pending" | "Approved" | "Declined" | "InProgress" | "Finished";
  type: "Batch" | string;
};

export type ProductionPlanListDto = {
  id: string;
  code: string;
  name: string;
  expectedStartingDate: Date | string;
  dueDate: Date | string;
  batch: number | null;
  type: "Batch" | string;
  status: "Pending" | "Approved" | "Declined" | "InProgress" | "Finished";
};
