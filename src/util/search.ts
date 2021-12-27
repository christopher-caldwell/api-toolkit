import Fuse from 'fuse.js'
import arraySort from 'array-sort'

export const handleSearchResults = function <TData>(
  FuseSearch: Fuse<TData>,
  searchTerm: string,
  originalSet: TData[]
): TData[] {
  if (searchTerm === '') return originalSet
  const rawResults = FuseSearch.search(searchTerm)
  const results: TData[] = []
  for (const rawResult of rawResults) {
    const { item, score = 0 } = rawResult
    if (!item) continue
    if (score > 0.4) continue
    results.push(item)
  }
  return results
}

interface HandleFilterAndSortArgs<TData> {
  baseList: TData[]
  sortDirection?: SortDirection | null
  FuseSearch: Fuse<TData>
  sortKey?: keyof TData | null
  searchTerm?: string | null
}
export const handleFilterAndSort = <TData>({
  baseList,
  sortDirection,
  FuseSearch,
  searchTerm,
  sortKey
}: HandleFilterAndSortArgs<TData>) => {
  let results = baseList
  if (searchTerm) results = handleSearchResults(FuseSearch, searchTerm, baseList)
  if (sortKey) {
    results = arraySort(results, sortKey as string, { reverse: sortDirection === SortDirection.Desc })
  }
  return results
}

enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}
