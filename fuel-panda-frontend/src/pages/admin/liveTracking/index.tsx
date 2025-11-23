import { useEffect, useState } from "react";
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
import "leaflet/dist/leaflet.css";

// Fix Leaflet missing icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: import("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: import("leaflet/dist/images/marker-icon.png"),
  shadowUrl: import("leaflet/dist/images/marker-shadow.png"),
});

// interface VehicleTrack {
//   vehicleId: any;
//   plateNumber: any;
//   driverName: any;
//   lastPoint: { lat: number; lng: number };
//   points: { lat: number; lng: number }[];
// }

export default function AdminLiveTrackingMap() {
//   const [tracks, setTracks] = useState<VehicleTrack[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadActiveVehicles();

//     const interval = setInterval(() => {
//       loadActiveVehicles();
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   async function loadActiveVehicles() {
//     try {
//       const res = await api.get("/gps/fleet/active");
//       setTracks(res.data);

//       console.log(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Failed loading vehicles", err);
//       setLoading(false);
//     }
//   }

  return <>Coming soon...</>;

//   return (
//     <div className="w-full h-[90vh] border rounded">
//       <MapContainer
//         center={[19.076, 72.8777]}
//         zoom={12}
//         className="w-full h-full"
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {tracks.map((v) => (
//           <div key={v.vehicleId}>
//             <Marker position={[v.lastPoint.lat, v.lastPoint.lng]}>
//               <Popup>
//                 <strong>Vehicle:</strong> {v.plateNumber.plateNumber} <br />
//                 <strong>Driver:</strong> {v.driverName.name} <br />
//                 <strong>Lat:</strong> {v.lastPoint.lat.toFixed(5)} <br />
//                 <strong>Lng:</strong> {v.lastPoint.lng.toFixed(5)}
//               </Popup>
//             </Marker>

//             {v.points.length > 1 && (
//               <Polyline
//                 positions={v.points.map((p) => [p.lat, p.lng])}
//                 color="blue"
//               />
//             )}
//           </div>
//         ))}
//       </MapContainer>
//     </div>
//   );
}
