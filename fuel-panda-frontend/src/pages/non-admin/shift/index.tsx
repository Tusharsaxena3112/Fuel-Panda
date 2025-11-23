import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../../api/axios";


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: import("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: import("leaflet/dist/images/marker-icon.png"),
  shadowUrl: import("leaflet/dist/images/marker-shadow.png"),
});

interface DeliveryForm {
  status: "COMPLETED" | "FAILED";
  reason?: string;
}

export default function DriverShiftPage() {
  const [activeShift, setActiveShift] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [gpsPoints, setGpsPoints] = useState<{ lat: number; lng: number }[]>([]);
  const [driverId, setDriverId] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [deliveryForm, setDeliveryForm] = useState<DeliveryForm>({
    status: "COMPLETED",
    reason: "",
  });

  const gpsInterval = useRef<number | null>(null);


  useEffect(() => {
    const id = localStorage.getItem("driverId");
    setDriverId(id);
    if (id) loadActiveShift(id);
  }, []);

  async function loadActiveShift(driverId: string) {
    setLoading(true);
    const res = await api.get(`/shifts/${driverId}`);
    const shift = res.data;

    setActiveShift(shift);

    if (shift) {
      const vehicleId =
        typeof shift.vehicleId === "string"
          ? shift.vehicleId
          : shift.vehicleId?._id;

      await loadGpsHistory(vehicleId, shift._id);
    }

    setLoading(false);
  }

  async function loadGpsHistory(vehicleId: string, shiftId: string) {
    try {
      const res = await api.get(`/gps/vehicle/${vehicleId}/history`, {
        params: { shiftId },
      });
      const points = res.data.map((p: any) => ({ lat: p.lat, lng: p.lng }));
      setGpsPoints(points);
    } catch (err) {
      console.error("Failed to load GPS history", err);
    }
  }


  async function sendGps(lat: number, lng: number) {
    if (!driverId || !activeShift) return;

    const vehicleId =
      typeof activeShift.vehicleId === "string"
        ? activeShift.vehicleId
        : activeShift.vehicleId?._id;

    try {
      await api.post("/gps", {
        driverId,
        shiftId: activeShift._id,
        vehicleId,
        lat,
        lng,
      });
    } catch (err) {
      console.error("GPS send failed", err);
    }
  }

  async function startShift() {
    if (!activeShift || !driverId) return;

    await api.post(`/shifts/${activeShift._id}/start`, { driverId });
    await loadActiveShift(driverId);

    gpsInterval.current = setInterval(() => {
      setGpsPoints((prev) => {
        const last = prev[prev.length - 1] || { lat: 19.076, lng: 72.8777 };

        const newLat = last.lat + 0.0001;
        const newLng = last.lng + 0.0001;

        sendGps(newLat, newLng);

        return [...prev, { lat: newLat, lng: newLng }];
      });
    }, 3000) as unknown as number;
  }

  async function endShift() {
    if (!activeShift || !driverId) return;

    await api.post(`/shifts/${activeShift._id}/end`, { driverId });

    if (gpsInterval.current) clearInterval(gpsInterval.current);
  }

  async function submitDelivery() {
    if (!driverId || !activeShift || !selectedOrder) return;

    try {
      await api.post("/delivery-status/update", {
        driverId,
        shiftId: activeShift._id,
        orderId: selectedOrder,
        status: deliveryForm.status,
        reason:
          deliveryForm.status === "FAILED"
            ? deliveryForm.reason
            : undefined,
      });

      alert("Delivery updated!");
      setSelectedOrder(null);
      setDeliveryForm({ status: "COMPLETED", reason: "" });

      loadActiveShift(driverId);
    } catch (err: any) {
      alert(err.message || "Failed to update delivery");
    }
  }

  if (loading) return <>Loading...</>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Driver Shift</h2>
      <h2>Active profile: {localStorage.getItem("driverName")}</h2>

      {!activeShift && <div>No active shift.</div>}

      {activeShift && (
        <>
          <div className="p-4 border rounded space-y-2">
            <div><strong>Shift ID:</strong> {activeShift._id}</div>
            <div><strong>Vehicle:</strong> {activeShift.vehicleId?.plateNumber}</div>
            <div><strong>Date:</strong> {activeShift.date}</div>
          </div>

          <div className="h-96 border rounded">
            <MapContainer
              center={gpsPoints[0] || [19.076, 72.8777]}
              zoom={13}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {gpsPoints.map((p, idx) => (
                <Marker key={idx} position={[p.lat, p.lng]}>
                  <Popup>{activeShift.vehicleId?.plateNumber}</Popup>
                </Marker>
              ))}

              {gpsPoints.length > 1 && (
                <Polyline positions={gpsPoints} color="blue" />
              )}
            </MapContainer>
          </div>

          <div className="p-4 border rounded space-y-4">
            <h3 className="font-semibold">Orders in this shift:</h3>

            <ul className="list-disc ml-6 space-y-1">
              {activeShift.allocationId?.orders?.map((o: any) => (
                <li key={o._id}>
                  <button
                    className={`px-2 py-1 rounded ${
                      selectedOrder === o._id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedOrder(o._id)}
                  >
                    #{o._id.slice(-6)} — {o.status}
                  </button>
                </li>
              ))}
            </ul>

            {selectedOrder && (
              <div className="border p-2 rounded space-y-2">
                <label className="block">
                  <span className="font-medium">Status</span>
                  <select
                    value={deliveryForm.status}
                    onChange={(e) =>
                      setDeliveryForm({ ...deliveryForm, status: e.target.value as any })
                    }
                    className="mt-1 block w-full border rounded px-2 py-1"
                  >
                    <option value="COMPLETED">Completed</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </label>

                {deliveryForm.status === "FAILED" && (
                  <label className="block">
                    <span className="font-medium">Reason</span>
                    <input
                      value={deliveryForm.reason}
                      onChange={(e) =>
                        setDeliveryForm({ ...deliveryForm, reason: e.target.value })
                      }
                      className="mt-1 block w-full border rounded px-2 py-1"
                    />
                  </label>
                )}

                <button
                  onClick={submitDelivery}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            {!activeShift.active && (
              <button
                onClick={startShift}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Start Shift
              </button>
            )}
            {activeShift.active && (
              <button
                onClick={endShift}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                End Shift
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
