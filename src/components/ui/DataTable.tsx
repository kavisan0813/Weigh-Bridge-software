import { type ReactNode } from "react";
import { SearchInput } from "./InputControls";
import { Button } from "./Button";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  darkMode?: boolean;
  onSearch?: (term: string) => void;
  searchValue?: string;
  filterComponent?: ReactNode;
  actions?: ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  darkMode = false,
  onSearch,
  searchValue = "",
  filterComponent,
  actions,
  isLoading = false,
  emptyMessage = "No records found",
  onRowClick,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: DataTableProps<T>) {
  const borderColor = darkMode ? "border-[#374151]" : "border-[#E5E7EB]";
  const headerBg = darkMode ? "bg-[#111827]" : "bg-gray-50/80";
  const hoverBg = darkMode ? "hover:bg-[#273449]" : "hover:bg-amber-50/30";

  return (
    <div
      className={`flex flex-col rounded-xl border ${borderColor} ${darkMode ? "bg-wb-dark-surface" : "bg-white"} shadow-xs overflow-hidden`}
    >
      {/* Top Toolbar */}
      {(onSearch || filterComponent || actions) && (
        <div
          className={`p-4 border-b ${borderColor} flex flex-wrap items-center justify-between gap-3`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-60">
            {onSearch && (
              <div className="w-full max-w-sm">
                <SearchInput
                  value={searchValue}
                  onChange={(e) => onSearch(e.target.value)}
                  darkMode={darkMode}
                />
              </div>
            )}
            {filterComponent}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${borderColor} ${headerBg}`}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${borderColor}`}>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-[#F97316]">
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={`px-4 py-10 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors ${hoverBg} ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3.5 text-sm ${
                        darkMode ? "text-gray-200" : "text-gray-800"
                      } ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"}`}
                    >
                      {col.render ? col.render(row) : (row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div
          className={`px-4 py-3 border-t ${borderColor} flex items-center justify-between text-xs ${darkMode ? "bg-[#111827] text-gray-400" : "bg-gray-50 text-gray-600"}`}
        >
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="tertiary"
              disabled={currentPage <= 1}
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              darkMode={darkMode}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="tertiary"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              darkMode={darkMode}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
