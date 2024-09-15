export type InspectionResultInput = {
  inspectedQuantity: number,
  description?: string;
  faultyProducts: FaultyProduct[];
};

export type FaultyProduct = {
  ordinalNumberInSeries: number;
  description?: string;
  productFaults : ProductFault[];
};

export type ProductFault = {
  qualityStandardId: string;
  productionStepId: string;
  measurementId?: string;
  description?: string;
};
