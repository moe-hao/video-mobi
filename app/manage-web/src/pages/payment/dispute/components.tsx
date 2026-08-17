import { Table } from "@heroui/react";
import TablePagination from "@app/manage-web/components/pagination/pagination";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-semibold text-gray-700 mb-2">{children}</div>;
}

export function InfoField({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: 'green' | 'red' }) {
  const colorClass = highlight === 'green' ? 'text-green-600' : highlight === 'red' ? 'text-red-500' : 'text-gray-800';
  return (
    <div>
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className={`text-sm font-medium ${colorClass}`}>{value ?? '--'}</div>
    </div>
  );
}

export function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
        active ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export interface DataTablePagination {
  page: number;
  size: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function DataTable({ columns, rows, emptyText, pagination }: { columns: string[]; rows?: React.ReactNode[][]; emptyText: string; pagination?: DataTablePagination }) {
  return (
    <div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content className="min-w-[600px]">
            <Table.Header>
              {columns.map((col) => (
                <Table.Column key={col} className="whitespace-nowrap">{col}</Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {rows && rows.length > 0 ? (
                rows.map((cells, i) => (
                  <Table.Row key={i}>
                    {cells.map((cell, j) => (
                      <Table.Cell key={j} className="whitespace-nowrap">{cell}</Table.Cell>
                    ))}
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={columns.length} className="text-center text-gray-400">{emptyText}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      {pagination && pagination.total > 0 && (
        <TablePagination
          page={pagination.page}
          size={pagination.size}
          total={pagination.total}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
