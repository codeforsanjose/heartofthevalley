import { useEffect } from "react";
import { useListFeaturesInfinite } from "../lib/api-client";
import { FeatureCard } from "./FeatureCard";

import { useInView } from "react-intersection-observer";

export const FeatureGrid = () => {
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useListFeaturesInfinite(
    {
      projectionExpression: "SK,title,imagePath",
    },
    {
      query: {
        getNextPageParam: (lastPage) => lastPage.data.lastFeatureId,
      },
    },
  );
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error" || !data) {
    return <div>There was an error loading features.</div>;
  }

  // Combine all pages of features into a single array
  const allFeatures = data.pages.flatMap((page) => page.data.features);
  const dataWithAllFeatures = { data: { features: allFeatures } };
  const {
    data: { features },
  } = dataWithAllFeatures;

  return (
    <section className="w-[80%] mx-auto p-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 place-items-center">
      {features.map(({ imagePath, SK, title }) => {
        if (!imagePath || !SK || !title) throw new Error("There was an error retreiving or rendering feature data.");
        const id = SK.split("#")[1];
        return <FeatureCard key={id} imgSrc={imagePath} title={title} id={id} />;
      })}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="col-span-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          ref={ref}
          disabled={!!hasNextPage || isFetchingNextPage}
        >
          Load More
        </button>
      )}
    </section>
  );
};
