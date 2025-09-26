import { Suspense } from "react";
import { FeatureGrid } from "../../components/FeatureGrid";
import { useData } from "vike-react/useData";
import { SearchData } from "./+data";

export default function SearchPage() {
  const { features } = useData<SearchData>();
  return (
    <main>
      <Suspense fallback={<h1 className="text-3xl flex justify-center">Loading...</h1>}>
        <FeatureGrid features={features} />
      </Suspense>
    </main>
  );
}
