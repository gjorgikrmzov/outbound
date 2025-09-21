// components/data-table.tsx
"use client";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CloseCircle, RecordCircle } from "iconsax-reactjs";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSizeOptions?: number[];
  /** NEW: controlled global search */
  globalFilter?: string;
  onGlobalFilterChange?: (v: string) => void;
};

const STATUS_OPTIONS = ["New Lead","Contacted","Interested","Removed"] as const;

export function DataTable<TData extends Record<string, any>, TValue>({
  columns,
  data,
  pageSizeOptions = [10, 25, 50],
  globalFilter: globalFilterProp,
  onGlobalFilterChange,
}: DataTableProps<TData, TValue>) {
  const [pageSize, setPageSize] = React.useState<number>(pageSizeOptions[0]);
  const [activeStatus, setActiveStatus] = React.useState<string | undefined>();
  const [repliedOnly, setRepliedOnly] = React.useState(false);

  // local fallback if parent doesn't control it
  const [internalGF, setInternalGF] = React.useState("");
  const globalFilter = globalFilterProp ?? internalGF;
  const setGlobalFilter = onGlobalFilterChange ?? setInternalGF;

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _col, value: string) => {
      const q = String(value ?? "").toLowerCase();
      if (!q) return true;
      const hay = Object.values(row.original)
        .filter((v) => typeof v === "string")
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    },
    initialState: { pagination: { pageSize } },
  });

  React.useEffect(() => { table.setPageSize(pageSize); }, [pageSize, table]);

  React.useEffect(() => {
    table.getColumn("status")?.setFilterValue(activeStatus || undefined);
    table.getColumn("has_replied")?.setFilterValue(repliedOnly ? "true" : undefined);
  }, [activeStatus, repliedOnly, table]);

  const STATUS_COLORS: Record<string, string> = {
    "New Lead":"#5e27f6", Contacted:"#4F89C6", Interested:"#3F9065", Removed:"#C73B3A",
  };

  return (
    <div className="space-y-3 mt-5">
      {/* Filters row (kept), but search input removed */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {STATUS_OPTIONS.map((s) => {
            const isActive = activeStatus === s;
            const color = STATUS_COLORS[s] ?? "#999";
            return (
              <Button
                key={s}
                variant={isActive ? "default" : "outline"}
                onClick={() => setActiveStatus(isActive ? undefined : s)}
                className="gap-2"
              >
                <RecordCircle variant="Bulk" size={10} color={color}
                  className={isActive ? "" : "opacity-60"} />
                {s}
              </Button>
            );
          })}

          <div className="h-5 w-[1px] bg-border mx-2"></div>

          <Button
            variant={repliedOnly ? "default" : "outline"}
            onClick={() => setRepliedOnly((v) => !v)}
          >
            <RecordCircle variant="Bulk" size={5} color="#D95E28" />
            Has Replied
          </Button>

          {(activeStatus || repliedOnly) && (
            <Button variant="ghost" onClick={() => {
              setActiveStatus(undefined); setRepliedOnly(false);
            }}>
              <CloseCircle variant="Bulk" size={16} color="#292929" />
              Clear
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page:</span>
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="h-8 w-[90px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((opt) => (
                <SelectItem key={opt} value={String(opt)}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow className="bg-[#ccc]/15 hover:bg-[#ccc]/15" key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="border-r last:border-r-0">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="border-r last:border-r-0" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Prev
        </Button>
        <div className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </div>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
