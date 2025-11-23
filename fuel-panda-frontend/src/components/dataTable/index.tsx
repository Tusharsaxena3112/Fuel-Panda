// src/components/DataTable.tsx
import React from "react";

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
};

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export default function DataTable<T extends { _id: string }>({ data, columns, onEdit, onDelete }: Props<T>) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                {c.label}
              </th>
            ))}
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((row) => (
            <tr key={row._id} className="hover:bg-gray-50">
              {columns.map((c) => (
                <td key={String(c.key)} className="px-4 py-2 text-sm text-gray-800">
                  {c.render ? c.render(row) : JSON.stringify(row[c.key] ?? "")}
                </td>
              ))}
              <td className="px-4 py-2 text-right space-x-2">
                {onEdit && (
                  <button className="text-sm text-blue-600" onClick={() => onEdit(row)}>
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button className="text-sm text-red-600" onClick={() => onDelete(row)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
