export type ProductionSeriesListItem = {
    id: string,
    code: string,
    quantity: number,
}

export type ProductionSeriesListDto = {
    id: string,
    code: string,
    quantity: number,
    faultyQuantity: number | null,
    currentProcess: string,
    status: string
}

export type ProductionSeriesListFilter = {
    orderBy: string,
    isAscending: boolean,
    pagination: {
        pageIndex: 0,
        pageSize: 50,
    },
    code: string,
    status: string,
    dayNumber: number
}