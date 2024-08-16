export type InspectionRequest = {
  id: string;
  name: string;
  creator: string;
  created: Date | string;
  productionPlanId: string;
  productionPlanCode: string;
  productionSeriesId: string;
  productionSeriesCode: string;
  reviewer: string | null | undefined;
  reviewed: Date | string | null | undefined;
  inspector: string | null | undefined;
  inspected: Date | string | null | undefined;
  required: number;
  passed: number | null | undefined;
  failed: number | null | undefined;
  status:
    | string
    | "pending"
    | "approved"
    | "declined"
    | "in progress"
    | "finished"
    | "canceled";
};
