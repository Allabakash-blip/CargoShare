import { useNavigate } from "react-router-dom";
import { Truck, ShieldCheck, BarChart3, FileText } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center px-6">

      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full grid md:grid-cols-2 overflow-hidden">

        {/* Left Side */}
        <div className="p-12 text-white bg-gradient-to-br from-blue-700 to-cyan-600 flex flex-col justify-center">

          <h1 className="text-5xl font-extrabold mb-4">
            🚚 CargoShare
          </h1>

          <p className="text-xl opacity-95 mb-10">
            Smart Logistics & Cargo Management Platform
          </p>

          <div className="space-y-5">

            <div className="flex items-center gap-4">
              <Truck size={30} />
              <span>Shipment Tracking</span>
            </div>

            <div className="flex items-center gap-4">
              <ShieldCheck size={30} />
              <span>Secure Payments</span>
            </div>

            <div className="flex items-center gap-4">
              <FileText size={30} />
              <span>Document Management</span>
            </div>

            <div className="flex items-center gap-4">
              <BarChart3 size={30} />
              <span>Analytics Dashboard</span>
            </div>

          </div>

        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center items-center p-14">

          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Welcome
          </h2>

          <p className="text-gray-500 mb-10 text-center">
            Manage your cargo bookings, logistics,
            payments and shipment tracking in one place.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold transition"
          >
            Register
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full mt-5 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 rounded-xl text-lg font-semibold transition"
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}