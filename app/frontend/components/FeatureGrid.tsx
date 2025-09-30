import { FeatureCard } from "./FeatureCard";
import { Feature } from "../lib/api-client.schemas";

type FeatureGridProps = {
  features: Feature[];
  searchTerm: string;
};

export const FeatureGrid = ({ features, searchTerm }: FeatureGridProps) => {
  return (
    <section className="w-[80%] mx-auto p-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 place-items-center">
      {features
        .filter(({ title }) => title?.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(({ imagePath, SK, title }) => {
          if (!imagePath || !SK || !title) throw new Error("There was an error retreiving or rendering feature data.");
          const id = SK.split("#")[1]; // Ex: "FEATURE#123" -> "123"
          return <FeatureCard key={id} imgSrc={imagePath} title={title} id={id} />;
        })}
    </section>
  );
};
