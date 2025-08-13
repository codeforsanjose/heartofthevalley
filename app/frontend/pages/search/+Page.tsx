import { Suspense } from "react";
import { FeatureGrid } from "../../components/FeatureGrid";

export default function SearchPage() {
  return (
    <main>
      <Suspense fallback={<h1 className="text-3xl flex justify-center">Loading...</h1>}>
        <FeatureGrid />
      </Suspense>
    </main>
  );
}
