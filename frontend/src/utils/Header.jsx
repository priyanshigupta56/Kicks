import { useState } from "react";
import { Menu, X, Search, User, ShoppingCart } from "lucide-react";
import logoSrc from "../assets/img/logokicks.png";
import { Link } from "react-router-dom";


const Header = ({ logoSrc: logo = logoSrc, cartCount = 0 }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-4">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img
            src={logoSrc}
            alt="KICKS logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"

            width={50}
            height={50}
          />
          <span className="text-lg md:text-xl font-semibold tracking-wide">
            KICKS
          </span>
        </div>

        {/* Center: Navigation  */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center gap-8 text-gray-700 font-medium">
            <li>
              <a
                href="/"
                className="hover:text-black transition-colors"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#products"
                className="hover:text-black transition-colors"
              >
                Products
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:text-black transition-colors"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="hover:text-black transition-colors"
              >
                Login / Register
              </a>
            </li>
          </ul>
        </nav>

        {/* Right: Icons */}
        <div className="ml-auto flex items-center gap-4">

          <div className="hidden md:flex items-center gap-4">
            <button
              aria-label="Search"
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Search size={20} />
            </button>

            <Link
              to="/admin-login"
              aria-label="Profile"
              className="p-2 rounded-full hover:bg-gray-100 transition inline-flex items-center"
            >
              <User size={20} />
            </Link>

            <button
              aria-label="Cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[4px] rounded-full bg-black text-white text-[11px] font-semibold flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 transition"
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        className={`md:hidden bg-white shadow-md border-t transition-max-h duration-300 ease-in-out overflow-hidden ${open ? "max-h-[420px] py-4" : "max-h-0"
          }`}
      >
        <div className="px-6 space-y-4">
          <nav>
            <ul className="flex flex-col gap-3 text-gray-700 font-medium">
              <li>
                <a href="#home" className="block" onClick={() => setOpen(false)}>
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  className="block"
                  onClick={() => setOpen(false)}
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="block"
                  onClick={() => setOpen(false)}
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="block"
                  onClick={() => setOpen(false)}
                >
                  Login / Register
                </a>
              </li>
            </ul>
          </nav>

          {/* Mobile icons row */}
          <div className="flex items-center gap-4 pt-2 border-t mt-2">
            <button aria-label="Search" className="p-2 rounded-full hover:bg-gray-100 transition">
              <Search size={18} />
            </button>
            <Link
              to="/admin-login"
              aria-label="Profile"
              className="p-2 rounded-full hover:bg-gray-100 transition inline-flex items-center"
            >
              <User size={20} />
            </Link>
            <button aria-label="Cart" className="relative p-2 rounded-full hover:bg-gray-100 transition">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-[3px] rounded-full bg-black text-white text-[10px] font-semibold flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
