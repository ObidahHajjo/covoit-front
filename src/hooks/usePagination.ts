import { useState, useCallback } from "react";

interface PaginationState {
  currentPage: number;
  perPage: number;
  totalPages: number;
  total: number;
}

interface UsePaginationReturn extends PaginationState {
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setPaginationData: (data: { total: number; totalPages: number; currentPage?: number }) => void;
}

/**
 * Hook to manage pagination state and logic.
 *
 * @param initialPage The starting page number (default: 1).
 * @param initialPerPage Number of items per page (default: 15).
 * @returns An object containing pagination state and setter functions.
 */
export function usePagination(initialPage = 1, initialPerPage = 15): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [perPage, setPerPageState] = useState(initialPerPage);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  /**
   * Updates the current page number.
   *
   * @param page - New page number to set.
   */
  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  /**
   * Updates the number of items per page and resets the current page to 1.
   *
   * @param newPerPage - New number of items per page.
   */
  const setPerPage = useCallback((newPerPage: number) => {
    setPerPageState(newPerPage);
    setCurrentPage(1);
  }, []);

  /**
   * Updates the total results, total pages, and optionally the current page.
   *
   * @param data - Pagination data returned from the API.
   */
  const setPaginationData = useCallback(
    (data: { total: number; totalPages: number; currentPage?: number }) => {
      setTotal(data.total);
      setTotalPages(data.totalPages);
      if (data.currentPage !== undefined) {
        setCurrentPage(data.currentPage);
      }
    },
    []
  );

  return {
    currentPage,
    perPage,
    totalPages,
    total,
    setPage,
    setPerPage,
    setPaginationData,
  };
}
