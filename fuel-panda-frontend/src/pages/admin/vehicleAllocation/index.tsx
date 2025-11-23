// src/pages/admin/allocations/VehicleAllocationPage.tsx
import React, { useState } from "react";
import DataTable from "../../../components/dataTable";
import ModalForm from "../../../components/modalForm";
import { useQueryClient } from "@tanstack/react-query";
import { useCrud } from "../../../hooks/useCrud";

export default function VehicleAllocationPage() {
  const { query: driversQuery } = useCrud(["drivers"], "/drivers");
  const { query: vehiclesQuery } = useCrud(["vehicles"], "/vehicles");
  const { query: ordersQuery } = useCrud(["orders"], "/orders", {
    status: "PENDING",
  });
  const { query: allocationsQuery, create: createAllocation } = useCrud(
    ["vehicle-allocations"],
    "/vehicle-allocation"
  );

  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    date: "",
    driverId: "",
    vehicleId: "",
    orders: [] as string[],
  });

  function toggleOrder(id: string) {
    setForm((f) =>
      f.orders.includes(id)
        ? { ...f, orders: f.orders.filter((x) => x !== id) }
        : { ...f, orders: [...f.orders, id] }
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createAllocation.mutateAsync(form, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["allocations"] });
      },
    });
    setOpen(false);
  }

  if (
    driversQuery.isLoading ||
    vehiclesQuery.isLoading ||
    ordersQuery.isLoading ||
    allocationsQuery.isLoading
  )
    return <>Loading...</>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Vehicle Allocations</h2>
        <button
          onClick={() => {
            setForm({ date: "", driverId: "", vehicleId: "", orders: [] });
            setOpen(true);
          }}
          className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create Allocation
        </button>
      </div>

      <DataTable
        data={allocationsQuery.data}
        columns={[
          { key: "_id", label: "ID", render: (r) => r._id.slice(-6) },
          { key: "date", label: "Date" },
          {
            key: "driverId",
            label: "Driver",
            render: (r) => r.driverId?.name || "—",
          },
          {
            key: "vehicleId",
            label: "Vehicle",
            render: (r) => r.vehicleId?.plateNumber || "—",
          },
          {
            key: "orders",
            label: "Orders",
            render: (r) =>
              r.orders?.map((o: any) => o._id.slice(-6)).join(", "),
          },
        ]}
      />

      {/* CREATE ALLOCATION MODAL */}
      <ModalForm
        open={open}
        title="New Vehicle Allocation"
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          {/* DATE */}
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 block w-full border px-2 py-1 rounded"
            />
          </div>

          {/* DRIVER */}
          <div>
            <label className="block text-sm font-medium">Driver</label>
            <select
              value={form.driverId}
              onChange={(e) => setForm({ ...form, driverId: e.target.value })}
              className="mt-1 block w-full border px-2 py-1 rounded"
            >
              <option value="">Select Driver</option>
              {driversQuery.data?.map((d: any) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* VEHICLE */}
          <div>
            <label className="block text-sm font-medium">Vehicle</label>
            <select
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              className="mt-1 block w-full border px-2 py-1 rounded"
            >
              <option value="">Select Vehicle</option>
              {vehiclesQuery.data?.map((v: any) => (
                <option key={v._id} value={v._id}>
                  {v.plateNumber}
                </option>
              ))}
            </select>
          </div>

          {/* MULTI-ORDER SELECT TABLE */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Assign Orders (PENDING)
            </label>

            <div className="border rounded">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-2 w-10"></th>
                    <th className="p-2">Order ID</th>
                    <th className="p-2">Destination</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersQuery.data?.map((o: any) => (
                    <tr key={o._id} className="border-b">
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={form.orders.includes(o._id)}
                          onChange={() => toggleOrder(o._id)}
                        />
                      </td>
                      <td className="p-2">{o._id.slice(-6)}</td>
                      <td className="p-2">
                        {o.destinationType} - {o.destinationId.slice(-6)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FOOTER */}
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
              Create
            </button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
