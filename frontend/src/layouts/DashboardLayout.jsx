import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  Menu,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import CommandPalette from "../components/search/CommandPalette";


export default function DashboardLayout() {

  // ============================================================
  // DESKTOP SIDEBAR COLLAPSE
  // ============================================================

  const [
    collapsed,
    setCollapsed,
  ] = useState(() => {

    return (
      localStorage.getItem(
        "sidebarCollapsed"
      ) === "true"
    );

  });


  // ============================================================
  // MOBILE SIDEBAR
  // ============================================================

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);


  // ============================================================
  // COMMAND PALETTE
  // ============================================================

  const [
    commandOpen,
    setCommandOpen,
  ] = useState(false);


  // ============================================================
  // SAVE DESKTOP SIDEBAR STATE
  // ============================================================

  useEffect(() => {

    localStorage.setItem(
      "sidebarCollapsed",
      collapsed
    );

  }, [
    collapsed,
  ]);


  // ============================================================
  // COMMAND PALETTE SHORTCUT
  // ============================================================

  useEffect(() => {

    const handleShortcut = (e) => {

      if (
        (e.ctrlKey ||
          e.metaKey) &&
        e.key.toLowerCase() === "k"
      ) {

        e.preventDefault();

        setCommandOpen(true);

      }

    };


    window.addEventListener(
      "keydown",
      handleShortcut
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleShortcut
      );

    };

  }, []);


  // ============================================================
  // CLOSE MOBILE MENU WHEN SCREEN BECOMES DESKTOP
  // ============================================================

  useEffect(() => {

    const handleResize = () => {

      if (
        window.innerWidth >= 768
      ) {

        setMobileMenuOpen(
          false
        );

      }

    };


    window.addEventListener(
      "resize",
      handleResize
    );


    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, []);


  // ============================================================
  // PREVENT BODY SCROLL WHEN MOBILE MENU IS OPEN
  // ============================================================

  useEffect(() => {

    if (
      mobileMenuOpen &&
      window.innerWidth < 768
    ) {

      document.body.style.overflow =
        "hidden";

    } else {

      document.body.style.overflow =
        "";

    }


    return () => {

      document.body.style.overflow =
        "";

    };

  }, [
    mobileMenuOpen,
  ]);


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div
      className="
        relative

        flex
        h-screen
        min-h-0
        min-w-0

        p-2
        sm:p-3
        md:p-4

        gap-2
        md:gap-4

        bg-slate-100
        dark:bg-slate-950

        transition-colors
        duration-300
      "
    >

      {/* ======================================================
          DESKTOP / MOBILE SIDEBAR
      ====================================================== */}

      <Sidebar
        collapsed={
          collapsed
        }
        setCollapsed={
          setCollapsed
        }

        mobileMenuOpen={
          mobileMenuOpen
        }

        setMobileMenuOpen={
          setMobileMenuOpen
        }
      />


      {/* ======================================================
          MAIN APPLICATION AREA
      ====================================================== */}

      <div
        className="
          flex
          min-w-0
          min-h-0
          flex-1
          flex-col
        "
      >

        {/* ====================================================
            MOBILE TOP BAR
        ==================================================== */}

        <div
          className="
            flex
            items-center
            gap-3

            mb-2
            md:hidden

            rounded-2xl

            border
            border-slate-200
            dark:border-slate-700

            bg-white
            dark:bg-slate-900

            px-3
            py-2

            shadow-sm
          "
        >

          {/* HAMBURGER */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                true
              )
            }
            aria-label="Open navigation menu"
            className="
              flex
              h-11
              w-11
              flex-shrink-0
              items-center
              justify-center

              rounded-xl

              bg-slate-100
              dark:bg-slate-800

              text-slate-700
              dark:text-slate-200

              transition

              hover:bg-blue-100
              hover:text-blue-600

              dark:hover:bg-slate-700
              dark:hover:text-blue-400

              active:scale-95
            "
          >

            <Menu
              size={24}
            />

          </button>


          {/* MOBILE BRAND */}

          <div
            className="
              min-w-0
              flex-1
            "
          >

            <p
              className="
                truncate
                text-base
                font-bold
                text-slate-800
                dark:text-white
              "
            >
              CargoShare
            </p>

            <p
              className="
                truncate
                text-[11px]
                text-slate-500
                dark:text-slate-400
              "
            >
              Logistics Management
            </p>

          </div>

        </div>


        {/* ====================================================
            DESKTOP NAVBAR
        ==================================================== */}

        <div
          className="
            relative
            z-50
            hidden
            flex-shrink-0

            md:block

            rounded-[28px]

            border
            border-slate-200
            dark:border-slate-700
          "
        >

          <Navbar
            onOpenSearch={() =>
              setCommandOpen(
                true
              )
            }
          />

        </div>


        {/* ====================================================
            PAGE CONTENT
        ==================================================== */}

        <main
          className="
            min-h-0
            min-w-0
            flex-1

            overflow-y-auto
            overflow-x-hidden

            rounded-2xl
            md:rounded-[28px]

            bg-white/60
            dark:bg-slate-900/60

            backdrop-blur-xl

            border
            border-slate-200
            dark:border-slate-700

            p-4
            sm:p-5
            md:p-8

            text-slate-900
            dark:text-white

            transition-all
            duration-300
          "
        >

          <Outlet />

        </main>

      </div>


      {/* ======================================================
          MOBILE OVERLAY
      ====================================================== */}

      {mobileMenuOpen && (

        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() =>
            setMobileMenuOpen(
              false
            )
          }
          className="
            fixed
            inset-0
            z-[90]

            bg-black/50
            backdrop-blur-[2px]

            md:hidden
          "
        />

      )}


     


      {/* ======================================================
          COMMAND PALETTE
      ====================================================== */}

      <CommandPalette
        isOpen={
          commandOpen
        }
        onClose={() =>
          setCommandOpen(
            false
          )
        }
      />

    </div>

  );

}