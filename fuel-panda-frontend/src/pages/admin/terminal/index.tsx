// src/pages/admin/Terminal/TerminalPage.tsx
import React, { useState } from "react";
import DataTable from "../../../components/dataTable";
import ModalForm from "../../../components/modalForm";
import { useQueryClient } from "@tanstack/react-query";
import { useCrud } from "../../../hooks/useCrud";

export default function TerminalPage() {
  const { query, create } = useCrud(['terminals'], '/terminals');

  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: { lat: 0, lng: 0 },
  });

  function openCreate() {
    setForm({ name: "", location: { lat: 0, lng: 0 } });
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await create.mutateAsync(form, {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["terminals"]});
        }
    });
    setOpen(false);
  }

  if (query.isLoading) return <>Loading!</>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Terminal</h2>
        <button
          onClick={openCreate}
          className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Terminal
        </button>
      </div>

      <DataTable
        data={query.data}
        columns={[
          { key: "_id", label: "ID", render: (r) => r._id.slice(-6) },
          { key: "name", label: "Name" },
          { key: "location", label: "Location" },
        ]}
      />

      <ModalForm open={open} title={"New Terminal"} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 block w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>

            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="Latitude"
                type="number"
                value={form.location.lat}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: {
                      ...form.location,
                      lat: Number(e.target.value),
                    },
                  })
                }
                className="mt-1 block w-full border px-2 py-1 rounded"
              />

              <input
                placeholder="Longitude"
                type="number"
                value={form.location.lng}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: {
                      ...form.location,
                      lng: Number(e.target.value),
                    },
                  })
                }
                className="mt-1 block w-full border px-2 py-1 rounded"
              />
            </div>
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
