import { pb } from "@/api/apiClient";
import { useUser } from "@/helpers/client";
import { useCartStore } from "@/store/client";
import { Link } from "@tanstack/react-router";
import {
  ShoppingCart,
  User,
  LogIn,
  UserPlus,
  Package,
  LogOut,
} from "lucide-react";

export default function AuthButtonHeader() {
  const logout = pb.authStore.clear;
  const { user } = useUser();
  if (user) {
    return (
      <div className="space-x-1">
        <CartButton />
        <div className="dropdown dropdown-end">
          <button className="btn btn-circle  btn-ghost">
            <User />
          </button>
          <ul className="menu dropdown-content m-2 ring bg-base-100 rounded-sleek fade shadow">
            <li>
              <Link to="/app/profile">
                <User className="size-4" />
                Profile
              </Link>
            </li>
            <li>
              <Link to="/app/orders">
                <Package className="size-4" />
                Orders
              </Link>
            </li>
            <li>
              <a href="/auth/logout">
                <LogOut className="size-4" />
                logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div className="space-x-2">
      <Link to="/auth/login" className="btn btn-primary">
        <LogIn className="size-4" />
        Login
      </Link>
      <Link to="/auth/signup" className="btn btn-accent btn-soft ring fade">
        <UserPlus className="size-4" />
        Signup
      </Link>
    </div>
  );
}

const CartButton = () => {
  const cartProps = useCartStore();
  const cartCount = cartProps.cart_array.length;
  return (
    <Link to="/app/cart" className="btn btn-ghost btn-circle relative ">
      {cartCount > 0 ? (
        <span className="bg-accent aspect-square size-5 text-sm absolute right-0 top-0 mb-1  text-primary-content grid place-items-center rounded-full">
          {cartCount}
        </span>
      ) : (
        <></>
      )}
      <ShoppingCart className="size-5" />
    </Link>
  );
};
