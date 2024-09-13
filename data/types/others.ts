export type ExtractedInformationModel = {
  id?: string;
  name?: string;
  code?: string;
};

export type BaseFilterModel = {
  orderBy: string;
  isAscending: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
};
