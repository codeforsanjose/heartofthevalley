import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "./style.css";
import "./tailwind.css";
import { MdCancel } from "react-icons/md";
import { RxDropdownMenu } from "react-icons/rx";

const client = new QueryClient();

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <div className={"flex"}>
      <Content>{children}</Content>
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={client}>
      <div id="page-container">
        <div id="page-content">
          <nav className="bg-grenadier w-screen py-4 px-4 sm:px-6 lg:px-[10%]">
            <div className="flex justify-between items-center">
              <div className="text-white">
                <a href="/" className="block">
                  <span className="text-lg sm:text-xl font-bold">HEART OF THE VALLEY</span>
                </a>
                <p className="text-sm sm:text-base mt-1">Mapping Public Arts</p>
              </div>

              <button
                className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <MdCancel /> : <RxDropdownMenu />}
              </button>

              <ul className="hidden md:flex space-x-6">
                <NavBarListItem href="/" text="Home" />
                <NavBarListItem href="/about" text="About" />
                <NavBarListItem href="/contact" text="Contact Us" />
                <NavBarListItem href="/search" text="Search" />
              </ul>
            </div>

            <div className={`md:hidden mt-4 ${isMobileMenuOpen ? "block" : "hidden"}`}>
              <ul className="flex flex-col space-y-2">
                <NavBarListItem href="/" text="Home" mobile />
                <NavBarListItem href="/about" text="About" mobile />
                <NavBarListItem href="/contact" text="Contact Us" mobile />
                <NavBarListItem href="/search" text="Search" mobile />
              </ul>
            </div>
          </nav>
          {children}
        </div>
      </div>
    </QueryClientProvider>
  );
}

function NavBarListItem({ href, text, mobile = false }: { href: string; text: string; mobile?: boolean }) {
  const baseClasses = "text-white hover:text-gray-300 transition-colors duration-200";
  const mobileClasses = "block py-2 px-4 rounded hover:bg-white hover:bg-opacity-10";
  const desktopClasses = "";

  return (
    <li className={mobile ? "" : ""}>
      <a href={href} className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}>
        {text}
      </a>
    </li>
  );
}
