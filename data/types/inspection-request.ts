import { FaultyProduct } from "./inspection-result";
import { ExtractedInformationModel } from "./others";

export type BaseFilterModel = {
  orderBy: string;
  isAscending: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
};


export type InspectionRequestFilterModel = BaseFilterModel & {
  status: "" | "Pending" | "Approved" | "Declined" | "Failed" | "Passed";
  searchString: string;
};

export type InspectionRequest = {
  id: string;
  name: string;
  requiredQuantity: number;
  inspectedQuantity: number | null;
  passedQuantity: number | null;
  description: string | null;
  createdDate: Date | string;
  reviewedDate: Date | string | null;
  inspectedDate: Date | string | null;
  creator: {
    id: string;
    code: string;
    fullname: string;
  };
  reviewer: {
    id: string;
    code: string;
    fullname: string;
  } | null;
  inspector: {
    id: string;
    code: string;
    fullname: string;
  } | null;
  productionSeries: {
    id: string;
    code: string;
  };
  productionPlan: {
    id: string;
    code: string;
  };
  status: string | number;
};

export type InspectionRequestDetails = {
  id: string;
  name: string;
  requiredQuantity: number;
  description?: string;
  reviewedDate?: Date;
  createdDate: Date;
  inspectionResult: {
    id?: string;
    description?: string;
    inspectedQuantity: number;
    passedQuantity: number;
    failedQuantity: number;
    faultyProducts: FaultyProduct[];
    inspector: ExtractedInformationModel;
    createdDate: Date;
  };
  creator: ExtractedInformationModel;
  reviewer?: ExtractedInformationModel;
  productionPlan?: ExtractedInformationModel;
  productionSeries?: ExtractedInformationModel;
  productSpecification?: ExtractedInformationModel;
  product?: ExtractedInformationModel;
  status: string;
};

export type InspectionRequestListingItem = {
  id: string;
  name: string;
  requiredQuantity: number;
  inspectedQuantity: number;
  failedQuantity: number;
  passedQuantity: number;
  createdDate: Date;
  creator: ExtractedInformationModel;
  productionSeries: ExtractedInformationModel;
  status: "Pending" | "Approved" | "Declined" | "Failed" | "Passed" | "InProgress";
};
