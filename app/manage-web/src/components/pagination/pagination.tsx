import { ListBox, Pagination, Select } from "@heroui/react";
import { useMemo } from "react";

interface TablePaginationProps {
  page: number;
  size: number;
  total: number;
  sizeOptions?: number[];
  onPageChange: (page: number) => void;
  onSizeChange?: (size: number) => void;
}

export default function TablePagination({ page, size, total, sizeOptions = [], onPageChange, onSizeChange }: TablePaginationProps) {
  const totalPages = Math.ceil(total / size);

  const availableSizes = useMemo(() => {
    const merged = new Set([size, ...sizeOptions]);
    return Array.from(merged).sort((a, b) => a - b);
  }, [size, sizeOptions]);

  const getPageNumbers = useMemo(() => {
    return (): (number | string)[] => {
      const pages: (number | string)[] = [];
      const start = Math.max(1, page - 3);
      const end = Math.min(totalPages, page + 3);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }

      return pages;
    };
  }, [page, totalPages]);

  return (
    <div className="mt-1">
      <Pagination>
        <Pagination.Summary>
          <span>每页</span>
          <Select
            variant="secondary"
            aria-label="page-size"
            key={size.toString()}
            className="w-20 text-sm"
            defaultValue={size.toString()}
            onChange={(value) => onSizeChange?.(Number(value))}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {availableSizes.map((o) => (
                  <ListBox.Item key={o} id={o.toString()} textValue={o.toString()}>{o}</ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <span>条</span>
          <span>共 {totalPages} 页</span>
          <span>共 {total} 条记录</span>
        </Pagination.Summary>
        <div className="flex items-center gap-2">
          <Pagination.Content>
            {page > 1 && (
              <Pagination.Item>
                <Pagination.Previous
                  onPress={() => onPageChange?.(page - 1)}
                >
                  <Pagination.PreviousIcon />
                  <span>上一页</span>
                </Pagination.Previous>
              </Pagination.Item>
            )}
            {
              getPageNumbers().map((p, index) => (
                p === '...' ? (
                  <Pagination.Item key={`ellipsis-${index}`}>
                    <Pagination.Ellipsis />
                  </Pagination.Item>
                ) : (
                  <Pagination.Item key={p}>
                    <Pagination.Link
                      isActive={p === page}
                      onPress={() => onPageChange?.(p as number)}
                    >
                      {p}
                    </Pagination.Link>
                  </Pagination.Item>
                )
              ))
            }
            {page < totalPages && (
              <Pagination.Item>
                <Pagination.Next
                  onPress={() => onPageChange?.(page + 1)}
                >
                  <span>下一页</span>
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            )}
          </Pagination.Content>
        </div>
      </Pagination>
    </div>
  );
}
