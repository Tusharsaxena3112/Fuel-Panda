import { useNavigate } from "react-router-dom";
import { useCrud } from "../../../hooks/useCrud";

export default function DriverLogin() {
  const { query: driversQuery } = useCrud(['drivers'], '/drivers');
  const navigate = useNavigate();

  const handleLogin = (driverId: string, driverName: string) => {
    localStorage.setItem("driverId", driverId);
    localStorage.setItem("driverName", driverName); // store name
    navigate("/driver/shifts");
  };

  if (driversQuery.isLoading) return <>Loading...</>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Driver Login</h2>
      <select
        onChange={(e) => {
          const selectedOption = e.target.selectedOptions[0];
          handleLogin(e.target.value, selectedOption.text);
        }}
        className="w-full border px-2 py-2 rounded"
      >
        <option value="">Select driver</option>
        {driversQuery.data?.map((d: any) => (
          <option key={d._id} value={d._id}>
            {d.name}
          </option>
        ))}
      </select>
    </div>
  );
}
