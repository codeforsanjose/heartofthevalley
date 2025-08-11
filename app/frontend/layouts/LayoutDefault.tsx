import "./style.css";
import "./tailwind.css";

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <div className={"flex"}>
      <Content>{children}</Content>
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-container">
      <div id="page-content" className="w-auto">
        <nav className="bg-grenadier w-screen py-2 px-[10%] flex justify-between text-xl text-white">
          <div className="pb-1.5">
            <a href="/">HEART OF THE VALLEY</a>
            <p className="mb-4">Mapping Public Arts</p>
          </div>
          <ul className="flex self-center">
            <NavBarListItem href="/" text="Home" />
            <NavBarListItem href="/about" text="About" />
            <NavBarListItem href="/contact" text="Contact Us" />
            <a href="/search" className="flex self-center">
              <NavBarListItem href="/search" text="Search" />
              <MagnifyingGlassIcon className="size-6 text-white-500" />
            </a>
          </ul>
        </nav>
        {children}
      </div>
    </div>
  );
}

function NavBarListItem({ href, text }: { href: string; text: string }) {
  return (
    <li className="ml-4">
      <a href={href} className="text-white hover:text-gray-300 text-[.9rem] mx-4">
        {text}
      </a>
    </li>
  );
}
