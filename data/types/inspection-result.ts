import { ExtractedInformationModel } from "./others";

export type FaultyProduct = {
  id: string;
  ordinalNumberInSeries: number;
  description?: string;
  createdDate: Date;
  productFaults: ProductFault[];
};

export type ProductFault = {
  description?: string;
  qualityStandard: ExtractedInformationModel;
  productionStep: ExtractedInformationModel;
  productMeasurement?: ExtractedInformationModel;
};
