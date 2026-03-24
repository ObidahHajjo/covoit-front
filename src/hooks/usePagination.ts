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

export function usePagination(initialPage = 1, initialPerPage = 15): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [perPage, setPerPageState] = useState(initialPerPage);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const setPerPage = useCallback((newPerPage: number) => {
    setPerPageState(newPerPage);
    setCurrentPage(1);
  }, []);

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
