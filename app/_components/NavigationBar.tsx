import Link from "next/link";
import { CarIcon } from "lucide-react";
import { ModeToggle } from "@/app/_components/ModeToggle";
import React from "react";
import UserControls from "@/app/_components/UserControls";
import NavLinks from "@/app/_components/NavLinks";

async function NavigationBar() {
  return (
    <nav className="sticky top-0 bg-white shadow-sm dark:bg-gray-950/90 border-b-2">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <Link href="/public" className="flex items-center" prefetch={false}>
            <CarIcon className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <NavLinks />
          <div className="flex items-center gap-4">
            <UserControls />
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
