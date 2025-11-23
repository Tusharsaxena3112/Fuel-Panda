// src/pages/admin/products/ProductsPage.tsx

import React, { useState } from "react";
import DataTable from "../../../components/dataTable";
import ModalForm from "../../../components/modalForm";
import { useQueryClient } from "@tanstack/react-query";
import { useCrud } from "../../../hooks/useCrud";

export default function ProductsPage() {
  const { query, create } = useCrud(['products'], '/products');
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    unit: "gallons" as "gallons" | "liters",
  });

  function openCreate() {
    setForm({ name: "", unit: "gallons" });
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    await create.mutateAsync(form, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
    });

    setOpen(false);
  }

  if (query.isLoading) return <>Loading!</>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <button
          onClick={openCreate}
          className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Product
        </button>
      </div>

      <DataTable
        data={query.data}
        columns={[
          { key: "_id", label: "ID", render: (r) => r._id.slice(-6) },
          { key: "name", label: "Name" },
          { key: "unit", label: "Unit" },
        ]}
      />

      <ModalForm open={open} title={"New Product"} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 block w-full border px-2 py-1 rounded"
            />
          </div>

          {/* UNIT */}
          <div>
            <label className="block text-sm font-medium">Unit</label>
            <select
              value={form.unit}
              onChange={(e) =>
                setForm({ ...form, unit: e.target.value as "gallons" | "liters" })
              }
              className="mt-1 block w-full border px-2 py-1 rounded"
            >
              <option value="gallons">Gallons</option>
              <option value="liters">Liters</option>
            </select>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
