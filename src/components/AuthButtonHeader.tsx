import { useUser } from "@/helpers/client";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, User } from "lucide-react";

export default function AuthButtonHeader() {
  const { user } = useUser();
  if (user) {
    return (
      <div className="space-x-2">
        <Link
          to="/app/cart"
          className="btn btn-accent btn-circle btn-soft ring fade"
        >
          <ShoppingCart className="size-5" />
        </Link>
        <div className="dropdown dropdown-end">
          <button className="btn btn-circle btn-primary btn-soft ring fade">
            <User />
          </button>
          <ul className="menu dropdown-content m-2 ring bg-base-100 rounded-box fade shadow">
            <li>
              <a>Profile</a>
            </li>
            <li>
              <Link to="/app/orders">Orders</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div className="space-x-2">
      <Link to="/auth/login" className="btn btn-primary">
        Login
      </Link>
      <button className="btn btn-accent btn-soft ring fade">Signup</button>
    </div>
  );
}
