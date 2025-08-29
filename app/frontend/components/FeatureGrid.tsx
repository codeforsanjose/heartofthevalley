import { useListFeatures } from "../lib/api-client";
import { FeatureCard } from "./FeatureCard";

export const FeatureGrid = () => {
  const { data, error, isPending } = useListFeatures({
    projectionExpression: "SK,title,imagePath",
  });

  if (isPending) {
    return <h1 className="text-3xl flex justify-center">Loading...</h1>;
  }

  if (error) {
    return <h1 className="text-3xl flex justify-center">Error: {error.message}</h1>;
  }

  const { features } = data.data;

  return (
    <section className="w-[80%] mx-auto p-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 place-items-center">
      {features?.map(({ imagePath, SK, title }) => {
        if (!imagePath || !SK || !title) throw new Error("There was an error retreiving or rendering feature data.");
        const id = SK.split("#")[1];
        return <FeatureCard key={id} imgSrc={imagePath} title={title} id={id} />;
      })}
    </section>
  );
};
