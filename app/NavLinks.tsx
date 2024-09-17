"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

function NavLinks() {
  const navLinks = [
    // eventually we should make the carpools its own dropdown
    { href: "/", label: "Home" },
    { href: "/carpool/add", label: "Add Carpools" },
    { href: "/carpool/find", label: "Find Carpools" },
    { href: "/carpool/edit", label: "Edit Carpools" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex gap-4">
      {navLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className={`font-medium flex items-center text-sm transition-colors hover:underline
                 ${pathname === link.href && "text-slate-400"}`}
          prefetch={false}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export default NavLinks;
