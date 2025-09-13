"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const homeLink = session ? "/dashboard" : "/";
  const menuLinks = [
    { name: "Performances", href: "/performances" },
    { name: "Profile", href: "/profile" },
    { name: "Training", href: "/training" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <a href={homeLink} className="logo">
          Playr
        </a>

        {/* Desktop Menu */}
        {pathname !== "/" && (
          <ul className="desktop-menu">
            {menuLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        )}

        {/* Mobile Hamburger */}
        {pathname !== "/" && (
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        )}

        {/* Logout */}
        {session && pathname !== "/" && (
          <button onClick={() => signOut({ callbackUrl: "/" })} className="logout">
            Logout
          </button>
        )}
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <ul className="mobile-menu">
          {menuLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .navbar {
          padding: 12px 24px;
          display: flex;
          justify-content: center;
          background-color: black;
          border-radius: 10px;
          max-width: 1200px;
          margin: 0 auto 20px;
          color: #fff;
          position: relative;
        }

        .nav-container {
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;
        }

        .logo {
          font-size: 20px;
          font-weight: bold;
          color: #fff;
          text-decoration: none;
        }

        .desktop-menu {
          display: flex;
          gap: 24px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .desktop-menu a {
          color: #fff;
          text-decoration: none;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 24px;
          height: 18px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .hamburger span {
          display: block;
          height: 3px;
          width: 100%;
          background: #fff;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .logout {
          padding: 6px 12px;
          border-radius: 8px;
          border: none;
          background-color: #ff4c4c;
          color: #fff;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.2s;
          margin-left: 12px;
        }

        .logout:hover {
          background-color: #cc0000;
        }

        .mobile-menu {
          list-style: none;
          padding: 12px;
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background-color: black;
          border-radius: 8px;
          z-index: 1000;
          position: absolute;
          top: 60px;
          left: 0;
          right: 0;
          animation: fadeIn 0.3s ease-in-out;
        }

        .mobile-menu a {
          color: #fff;
          text-decoration: none;
          padding: 8px 12px;
          display: block;
        }

        @media (max-width: 768px) {
          .desktop-menu {
            display: none;
          }
          .hamburger {
            display: flex;
          }
          .logout {
            margin-left: 8px;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}
