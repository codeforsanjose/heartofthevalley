import { Suspense, useState } from "react";
import { FeatureGrid } from "../../components/FeatureGrid";
import { useData } from "vike-react/useData";
import { SearchData } from "./+data";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const { features } = useData<SearchData>();
  return (
    <main>
      <Suspense fallback={<h1 className="text-3xl flex justify-center">Loading...</h1>}>
        <div className="py-18 px-[10%] bg-[#bf3b00] text-white">
          <h1 className="text-4xl">Search Our Collection</h1>
          <input
            type="text"
            placeholder="Search..."
            className="mt-5 border-b w-[100%]"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
        <FeatureGrid features={features} searchTerm={searchTerm} />
      </Suspense>
    </main>
  );
}
