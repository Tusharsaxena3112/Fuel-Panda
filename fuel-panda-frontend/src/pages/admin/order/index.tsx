// src/pages/admin/orders/OrdersPage.tsx
import React, { useMemo, useState } from "react";
import DataTable from "../../../components/dataTable";
import ModalForm from "../../../components/modalForm";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { useCrud } from "../../../hooks/useCrud";

/**
 * Form types (local)
 */
type ProductRow = {
  id: string; // local key
  productId: string;
  quantity: number;
};

type OrderForm = {
  sourceType: "hub" | "terminal";
  sourceId: string;
  destinationType: "hub" | "terminal";
  destinationId: string;
  assignedDriverId?: string;
  products: ProductRow[];
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
};

export default function OrdersPage() {
  const queryClient = useQueryClient();

  const { query: ordersQuery, create } = useCrud(["orders"], "/orders");
  const { query: hubsQuery } = useCrud(["hubs"], "/hubs");
  const { query: terminalsQuery } = useCrud(["terminals"], "/terminals");
  const { query: productsQuery } = useCrud(["products"], "/products");
  const { query: driversQuery } = useCrud(["drivers"], "/drivers");

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm = (): OrderForm => ({
    sourceType: "hub",
    sourceId: "",
    destinationType: "terminal",
    destinationId: "",
    assignedDriverId: undefined,
    products: [{ id: uuidv4(), productId: "", quantity: 0 }],
    status: "PENDING",
  });

  const [form, setForm] = useState<OrderForm>(emptyForm());

  // Helpers
  const allProducts = productsQuery.data ?? [];
  const allHubs = hubsQuery.data ?? [];
  const allTerminals = terminalsQuery.data ?? [];
  const allDrivers = driversQuery.data ?? [];

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setOpen(true);
  }


  function addProductRow() {
    setForm((s) => ({
      ...s,
      products: [...s.products, { id: uuidv4(), productId: "", quantity: 0 }],
    }));
  }

  function removeProductRow(rowId: string) {
    setForm((s) => ({
      ...s,
      products: s.products.filter((r) => r.id !== rowId),
    }));
  }

  function updateProductRow(rowId: string, patch: Partial<ProductRow>) {
    setForm((s) => ({
      ...s,
      products: s.products.map((r) =>
        r.id === rowId ? { ...r, ...patch } : r
      ),
    }));
  }

  // Submit handler (create or update)
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation: source and destination must be different (Not Allowed -> disallow same)
    if (
      form.sourceType === form.destinationType &&
      form.sourceId === form.destinationId
    ) {
      alert("Source and destination cannot be the same.");
      return;
    }

    // Validate products
    const productsPayload = form.products.map((p) => ({
      productId: p.productId,
      quantity: Number(p.quantity || 0),
    }));
    if (productsPayload.some((p) => !p.productId || p.quantity <= 0)) {
      alert("Please select product(s) and set positive quantity.");
      return;
    }

    const payload = {
      sourceType: form.sourceType,
      sourceId: form.sourceId,
      destinationType: form.destinationType,
      destinationId: form.destinationId,
      assignedDriverId: form.assignedDriverId,
      products: productsPayload,
      status: form.status,
    };

    try {
      await create.mutateAsync(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
      });
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed");
    }
  }

  // Table columns
  const columns = useMemo(
    () => [
      { key: "_id", label: "ID", render: (r: any) => r._id.slice(-6) },
      {
        key: "products",
        label: "Products",
        render: (r: any) =>
          (r.products || [])
            .map((p: any) => {
              const name =
                p.productId?.name ??
                allProducts.find((ap: any) => ap._id === p.productId)?.name ??
                "—";
              return `${name}(${p.quantity})`;
            })
            .join(", "),
      },
      {
        key: "source",
        label: "Source",
        render: (r: any) =>
          `${r.sourceType}: ${
            r.sourceType === "hub"
              ? allHubs.find((h: any) => h._id === r.sourceId)?.name ??
                r.sourceId.slice(-6)
              : allTerminals.find((t: any) => t._id === r.sourceId)?.name ??
                r.sourceId.slice(-6)
          }`,
      },
      {
        key: "destination",
        label: "Destination",
        render: (r: any) =>
          `${r.destinationType}: ${
            r.destinationType === "hub"
              ? allHubs.find((h: any) => h._id === r.destinationId)?.name ??
                r.destinationId.slice(-6)
              : allTerminals.find((t: any) => t._id === r.destinationId)
                  ?.name ?? r.destinationId.slice(-6)
          }`,
      },
      {
        key: "driver",
        label: "Driver",
        render: (r: any) =>
          r.assignedDriverId
            ? allDrivers.find((d: any) => d._id === r.assignedDriverId)?.name ??
              r.assignedDriverId?.name
            : "Unassigned",
      },
      { key: "status", label: "Status" },
    ],
    [allProducts, allHubs, allTerminals, allDrivers]
  );

  if (ordersQuery.isLoading) return <>Loading...</>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Orders</h2>

        <div className="space-x-2">
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Create Order
          </button>
        </div>
      </div>

      <DataTable
        data={ordersQuery.data ?? []}
        columns={columns}
      />

      <ModalForm
        open={open}
        title={editingId ? "Edit Order" : "Create Order"}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Source Type */}
          <div>
            <label className="block text-sm font-medium">Source Type</label>
            <select
              className="mt-1 w-full border px-2 py-1 rounded"
              value={form.sourceType}
              onChange={(e) =>
                setForm({
                  ...form,
                  sourceType: e.target.value as any,
                  sourceId: "",
                })
              }
            >
              <option value="hub">Hub</option>
              <option value="terminal">Terminal</option>
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium">Source</label>
            <select
              className="mt-1 w-full border px-2 py-1 rounded"
              value={form.sourceId}
              onChange={(e) => setForm({ ...form, sourceId: e.target.value })}
            >
              <option value="">Select source</option>
              {form.sourceType === "hub" &&
                allHubs.map((h: any) => (
                  <option key={h._id} value={h._id}>
                    {h.name}
                  </option>
                ))}
              {form.sourceType === "terminal" &&
                allTerminals.map((t: any) => (
                  <option key={t._1d} value={t._id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Destination Type */}
          <div>
            <label className="block text-sm font-medium">
              Destination Type
            </label>
            <select
              className="mt-1 w-full border px-2 py-1 rounded"
              value={form.destinationType}
              onChange={(e) =>
                setForm({
                  ...form,
                  destinationType: e.target.value as any,
                  destinationId: "",
                })
              }
            >
              <option value="hub">Hub</option>
              <option value="terminal">Terminal</option>
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium">Destination</label>
            <select
              className="mt-1 w-full border px-2 py-1 rounded"
              value={form.destinationId}
              onChange={(e) =>
                setForm({ ...form, destinationId: e.target.value })
              }
            >
              <option value="">Select destination</option>
              {form.destinationType === "hub" &&
                allHubs.map((h: any) => (
                  <option key={h._id} value={h._id}>
                    {h.name}
                  </option>
                ))}
              {form.destinationType === "terminal" &&
                allTerminals.map((t: any) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Driver */}
          <div>
            <label className="block text-sm font-medium">Assign Driver</label>
            <select
              className="mt-1 w-full border px-2 py-1 rounded"
              value={form.assignedDriverId ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  assignedDriverId: e.target.value || undefined,
                })
              }
            >
              <option value="">Unassigned</option>
              {allDrivers.map((d: any) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Products (simple rows) */}
          <div>
            <label className="block text-sm font-medium mb-2">Products</label>

            <div className="space-y-2">
              {form.products.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-6">
                    <select
                      className="w-full border px-2 py-1 rounded"
                      value={row.productId}
                      onChange={(e) =>
                        updateProductRow(row.id, { productId: e.target.value })
                      }
                    >
                      <option value="">Select product</option>
                      {allProducts.map((p: any) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-4">
                    <input
                      type="number"
                      className="w-full border px-2 py-1 rounded"
                      value={row.quantity}
                      onChange={(e) =>
                        updateProductRow(row.id, {
                          quantity: Number(e.target.value),
                        })
                      }
                      min={0}
                    />
                  </div>

                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={() => removeProductRow(row.id)}
                      className="px-3 py-1 rounded border text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div>
                <button
                  type="button"
                  onClick={addProductRow}
                  className="px-3 py-1 rounded border bg-gray-50"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              className="mt-1 w-full border px-2 py-1 rounded"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as any })
              }
            >
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 border rounded"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {editingId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
