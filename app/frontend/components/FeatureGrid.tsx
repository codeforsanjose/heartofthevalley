import { FeatureCard } from "./FeatureCard";
import { Feature } from "../lib/api-client.schemas";

type FeatureGridProps = {
  features: Feature[];
};

export const FeatureGrid = ({ features }: FeatureGridProps) => {
  return (
    <section className="w-[80%] mx-auto p-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 place-items-center">
      {features.map(({ imagePath, SK, title }) => {
        if (!imagePath || !SK || !title) throw new Error("There was an error retreiving or rendering feature data.");
        const id = SK.split("#")[1]; // Ex: "FEATURE#123" -> "123"
        return <FeatureCard key={id} imgSrc={imagePath} title={title} id={id} />;
      })}
      {/* {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="col-span-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          ref={ref}
          disabled={!!hasNextPage || isFetchingNextPage}
        >
          Load More
        </button>
      )} */}
    </section>
  );
};
