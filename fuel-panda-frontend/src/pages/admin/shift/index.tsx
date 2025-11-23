import React, { useState } from "react";
import DataTable from "../../../components/dataTable";
import ModalForm from "../../../components/modalForm";
import api from "../../../api/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useCrud } from "../../../hooks/useCrud";

export default function AdminShiftsPage() {
  const { data: drivers = [] } = useCrud(['drivers'], '/drivers').query;
  const { data: allocations = [] } = useCrud(['vehicle-allocations'], '/vehicle-allocation').query;
  const {data: shifts = []} = useCrud(['shifts'], '/shifts').query;
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ allocationId: "", driverId: "", date: "" });

  async function createShift(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/shifts", form);
    qc.invalidateQueries({ queryKey: ["shifts"] });
    setOpen(false);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Shifts</h2>
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded">Create Shift</button>
      </div>

      <DataTable
        data={shifts}
        columns={[
          { key: "_id", label: "ID", render: (r) => r._id.slice(-6) },
          { key: "driverId", label: "Driver", render: (r) => r.driverId?.name ?? r.driverId },
          { key: "vehicleId", label: "Vehicle", render: (r) => r.vehicleId.plateNumber ?? "-" },
          { key: "date", label: "Date" },
          { key: "active", label: "Active", render: (r) => r.active ? "Yes" : "No" }
        ]}
      />

      <ModalForm open={open} title="Create Shift" onClose={() => setOpen(false)}>
        <form onSubmit={createShift} className="space-y-4">
          <div>
            <label>Allocation</label>
            <select className="w-full border" value={form.allocationId} onChange={(e) => setForm({ ...form, allocationId: e.target.value })}>
              <option value="">Select allocation</option>
              {allocations.map((a: any) => <option key={a._id} value={a._id}>{a._id.slice(-6)} - {a.vehicleId?.plateNumber}</option>)}
            </select>
          </div>

          <div>
            <label>Driver</label>
            <select className="w-full border" value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })}>
              <option value="">Select driver</option>
              {drivers.map((d: any) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>

          <div>
            <label>Date</label>
            <input type="date" className="w-full border" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
