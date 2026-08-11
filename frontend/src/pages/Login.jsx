import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Mail,
  Lock,
  UserCog,
  ArrowRight,
  Truck,
  Eye,
  EyeOff,
} from "lucide-react";

import { loginUser } from "../services/authService";
import { saveToken } from "../utils/auth";
import ThemeToggle from "../components/theme/ThemeToggle";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    if (!formData.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Please enter your password.");
      return;
    }

    if (!formData.role) {
      toast.error("Please select a role.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      saveToken(response.access_token);

      toast.success("Login Successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        relative
        min-h-screen
        flex
        bg-slate-100
        dark:bg-slate-950
        transition-colors
        duration-300
      "
    >
      {/* Theme Toggle */}

      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* =====================================================
          LEFT SECTION
      ====================================================== */}

      <div
        className="
          hidden
          lg:flex
          relative
          w-1/2
          overflow-hidden
          bg-gradient-to-br
          from-blue-700
          via-indigo-700
          to-slate-900
          text-white
        "
      >
        {/* Background Glow */}

        <div
          className="
            absolute
            -top-32
            -left-20
            h-96
            w-96
            rounded-full
            bg-cyan-400/20
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-0
            h-96
            w-96
            rounded-full
            bg-blue-400/20
            blur-[140px]
          "
        />

        {/* Content */}

        <div
          className="
            relative
            z-10
            flex
            flex-col
            justify-center
            px-20
            w-full
          "
        >
          {/* Logo */}

          <div
            className="
              flex
              items-center
              gap-5
            "
          >
            <div
              className="
                h-20
                w-20
                rounded-3xl
                bg-white/15
                backdrop-blur-xl
                flex
                items-center
                justify-center
                shadow-xl
              "
            >
              <Truck
                size={42}
                className="text-white"
              />
            </div>

            <div>
              <h1
                className="
                  text-6xl
                  font-black
                  tracking-tight
                "
              >
                CargoShare
              </h1>

              <p
                className="
                  mt-3
                  text-xl
                  text-blue-100
                "
              >
                Smart Logistics Management Platform
              </p>
            </div>
          </div>

          {/* Features */}

          <div className="mt-20 space-y-6">

            <div className="flex items-center gap-4">
              <div
                className="
                  h-10
                  w-10
                  rounded-xl
                  bg-white/10
                  flex
                  items-center
                  justify-center
                "
              >
                🚚
              </div>

              <span className="text-xl">
                Manage Cargo Efficiently
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="
                  h-10
                  w-10
                  rounded-xl
                  bg-white/10
                  flex
                  items-center
                  justify-center
                "
              >
                📍
              </div>

              <span className="text-xl">
                Track Shipments Live
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="
                  h-10
                  w-10
                  rounded-xl
                  bg-white/10
                  flex
                  items-center
                  justify-center
                "
              >
                🔐
              </div>

              <span className="text-xl">
                Secure Role-Based Access
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="
                  h-10
                  w-10
                  rounded-xl
                  bg-white/10
                  flex
                  items-center
                  justify-center
                "
              >
                📊
              </div>

              <span className="text-xl">
                Modern Dashboard Experience
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT SECTION
      ====================================================== */}

      <div
        className="
          flex-1
          flex
          items-center
          justify-center
          px-6
          lg:px-10
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-[32px]
            bg-white/80
            dark:bg-slate-900/80
            backdrop-blur-2xl
            border
            border-slate-200
            dark:border-slate-700
            shadow-2xl
            p-10
            transition-all
            duration-300
          "
        >
          <h2
            className="
              text-4xl
              font-black
              text-slate-900
              dark:text-white
            "
          >
            Welcome Back 👋
          </h2>

          <p
            className="
              mt-3
              text-slate-500
              dark:text-slate-400
            "
          >
            Login to your CargoShare account
          </p>

          <div className="mt-10 space-y-5">

            {/* =================================================
                EMAIL
            ================================================== */}

            <div className="relative">

              <Mail
                size={20}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  pointer-events-none
                "
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-300
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-800
                  text-slate-900
                  dark:text-white
                  placeholder:text-slate-400
                  pl-12
                  pr-4
                  py-4
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  transition-all
                  duration-300
                "
              />

            </div>

            {/* =================================================
                PASSWORD
            ================================================== */}

            <div className="relative">

              <Lock
                size={20}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  pointer-events-none
                "
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-300
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-800
                  text-slate-900
                  dark:text-white
                  placeholder:text-slate-400
                  pl-12
                  pr-12
                  py-4
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  transition-all
                  duration-300
                "
              />

              {/* Eye Button */}

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  hover:text-blue-500
                  dark:hover:text-blue-400
                  transition-colors
                  duration-200
                  focus:outline-none
                "
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            {/* =================================================
                ROLE
            ================================================== */}

            <div className="relative">

              <UserCog
                size={20}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  pointer-events-none
                "
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-300
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-800
                  text-slate-900
                  dark:text-white
                  pl-12
                  pr-4
                  py-4
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  transition-all
                  duration-300
                "
              >
                <option value="">
                  Select Role
                </option>

                <option value="Admin">
                  Admin
                </option>

                <option value="Trader">
                  Trader
                </option>

                <option value="Logistics">
                  Logistics
                </option>
              </select>

            </div>

            {/* =================================================
                LOGIN BUTTON
            ================================================== */}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="
                w-full
                flex
                items-center
                justify-center
                gap-3
                rounded-2xl
                py-4
                font-bold
                text-white
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                hover:from-blue-700
                hover:to-indigo-700
                disabled:opacity-60
                disabled:cursor-not-allowed
                shadow-lg
                shadow-blue-500/30
                transition-all
                duration-300
              "
            >
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  Login
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Register */}

            <p
              className="
                text-center
                text-slate-600
                dark:text-slate-400
              "
            >
              Don't have an account?{" "}

              <span
                onClick={() =>
                  navigate("/register")
                }
                className="
                  font-semibold
                  text-blue-600
                  dark:text-blue-400
                  cursor-pointer
                  hover:underline
                "
              >
                Register
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}