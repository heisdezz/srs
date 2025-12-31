import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import AuthButtonHeader from "./AuthButtonHeader";
import HeaderLinks from "./HeaderLinks";

export default function PageHeader() {
  return (
    <div className="h-16 border-b fade ">
      <nav className="container mx-auto px-4 flex h-full items-center gap-2">
        <Link to="/" className="btn  btn-ghost ">
          <span className="md:hidden">SRU</span>
          <span className="hidden md:inline">StuffsAreUs</span>
        </Link>

        <HeaderLinks />
        <div className="ml-auto md:ml-0 space-x-2 hidden md:block">
          <AuthButtonHeader />
        </div>
        <label
          htmlFor="my-drawer-3"
          className="btn btn-square btn-ghost ring  fade ml-auto md:ml-0 md:hidden drawer-button lg:hidden"
        >
          <Menu />
        </label>
      </nav>
    </div>
  );
}
