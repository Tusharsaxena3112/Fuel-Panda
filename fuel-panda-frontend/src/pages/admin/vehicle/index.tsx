// src/pages/admin/vehicles/VehiclesPage.tsx

import React, { useState } from "react";
import DataTable from "../../../components/dataTable";
import ModalForm from "../../../components/modalForm";
import { useQueryClient } from "@tanstack/react-query";
import { useCrud } from "../../../hooks/useCrud";

export default function VehiclesPage() {
  const { query, create } = useCrud(['vehicles'], '/vehicles');
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    plateNumber: "",
    vehicleModel: "",
    capacityGallons: 0,
    isActive: true,
  });

  function openCreate() {
    setForm({
      plateNumber: "",
      vehicleModel: "",
      capacityGallons: 0,
      isActive: true,
    });
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    await create.mutateAsync(form, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      },
    });

    setOpen(false);
  }

  if (query.isLoading) return <>Loading!</>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Vehicles</h2>
        <button
          onClick={openCreate}
          className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Vehicle
        </button>
      </div>

      <DataTable
        data={query.data}
        columns={[
          { key: "_id", label: "ID", render: (r) => r._id.slice(-6) },
          { key: "plateNumber", label: "Plate Number" },
          { key: "vehicleModel", label: "Model" },
          { key: "capacityGallons", label: "Capacity (Gallons)" },
          {
            key: "isActive",
            label: "Active",
            render: (r) => (r.isActive ? "Yes" : "No"),
          },
        ]}
      />

      <ModalForm open={open} title={"New Vehicle"} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Plate Number</label>
            <input
              value={form.plateNumber}
              onChange={(e) =>
                setForm({ ...form, plateNumber: e.target.value })
              }
              className="mt-1 block w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Vehicle Model</label>
            <input
              value={form.vehicleModel}
              onChange={(e) =>
                setForm({ ...form, vehicleModel: e.target.value })
              }
              className="mt-1 block w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Capacity (Gallons)</label>
            <input
              type="number"
              value={form.capacityGallons}
              onChange={(e) =>
                setForm({ ...form, capacityGallons: Number(e.target.value) })
              }
              className="mt-1 block w-full border px-2 py-1 rounded"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
            />
            <label className="text-sm font-medium">Active</label>
          </div>

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
