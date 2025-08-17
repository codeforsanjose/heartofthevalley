import { use } from "react";
import { Result } from "../lib/result";
import { FeatureCard } from "./FeatureCard";

type Feature = {
  imagePath: string;
  title: string;
};

const getFeaturesPromise = (async (): Promise<Result<{ features: Feature[]; lastEvaluatedKey: unknown }, Error>> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/features`);
  if (!response.ok) {
    return { success: false, error: new Error("Failed to fetch features") };
  }

  const data = await response.json();

  return { success: true, value: data };
})();

export const FeatureGrid = () => {
  const result = use(getFeaturesPromise);

  if (!result.success) {
    return <h1 className="text-3xl flex justify-center">Error: {result.error.message}</h1>;
  }

  console.log("Features:", result.value);

  return (
    <section className="w-[80%] mx-auto p-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 place-items-center">
      {result.value.features.map((feature, index) => (
        <FeatureCard key={index} imgSrc={feature.imagePath} title={feature.title} />
      ))}
    </section>
  );
};
