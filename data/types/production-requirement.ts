export type ProductionRequirmentItem = {
  id: string;
  quantity: number;
};

export type ProductionRequirementListFilter = {
  orderBy: string;
  isAscending: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
};
