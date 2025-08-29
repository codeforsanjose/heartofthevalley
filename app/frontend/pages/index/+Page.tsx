import { Counter } from "./Counter.js";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

export default function Page() {
  return (
    <main>
      <h1 className={"font-bold text-3xl pb-4"}>Explore Art in the Bay Area</h1>
      <form className="relative w-lg">
        <input placeholder="Search by art title or zipcode" className="flex-grow px-4 py-2 rounded-full bg-gray-100 focus:outline-none text-gray-700 w-full" />
        <button type="submit" className="bg-[#164E63] p-3 rounded-full flex items-center justify-center ml-2 absolute right-0.5 top-0"><MagnifyingGlassIcon className="size-4 text-white" /></button>

      </form>
    </main>
  );
}

