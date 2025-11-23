// src/pages/admin/drivers/DriversPage.tsx
import React, { useState } from "react";
import DataTable from "../../../components/dataTable";
import ModalForm from "../../../components/modalForm";
import { useQueryClient } from "@tanstack/react-query";
import { useCrud } from "../../../hooks/useCrud";

export default function DriversPage() {
  const { query, create } = useCrud(['drivers'], '/drivers');
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
    isActive: true,
  });

  function openCreate() {
    setForm({
      name: "",
      phone: "",
      licenseNumber: "",
      isActive: true,
    });
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    await create.mutateAsync(form, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["drivers"] });
      },
    });

    setOpen(false);
  }

  if (query.isLoading) return <>Loading...</>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Drivers</h2>

        <button
          onClick={openCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Driver
        </button>
      </div>

      <DataTable
        data={query.data}
        columns={[
          { key: "_id", label: "ID", render: (r) => r._id.slice(-6) },
          { key: "name", label: "Name" },
          { key: "phone", label: "Phone" },
          { key: "licenseNumber", label: "License" },
          {
            key: "isActive",
            label: "Status",
            render: (r) =>
              r.isActive ? (
                <span className="text-green-600">Active</span>
              ) : (
                <span className="text-red-600">Inactive</span>
              ),
          },
        ]}
      />

      <ModalForm open={open} title={"New Driver"} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full border px-2 py-1 rounded"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 w-full border px-2 py-1 rounded"
            />
          </div>

          {/* License */}
          <div>
            <label className="block text-sm font-medium">License Number</label>
            <input
              value={form.licenseNumber}
              onChange={(e) =>
                setForm({ ...form, licenseNumber: e.target.value })
              }
              className="mt-1 w-full border px-2 py-1 rounded"
            />
          </div>

          {/* Active status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
            />
            <label className="text-sm">Is Active</label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
