import { useData } from "vike-react/useData";
import { Data } from "./+onBeforePrerenderStart";

export default function FeatureDetails() {
  const feature = useData<Data>();

  if (!feature) {
    return <div>Loading...</div>;
  }
  return (
    <div className="mx-15 bg-white rounded-xl shadow-md p-6 mt-8 flex gap-8">
      <div className="flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        {feature.imagePath ? (
          <img src={feature.imagePath} alt={feature.title} />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Feature Details</h1>
        <div className="space-y-2">
          <p>
            <span className="font-semibold text-gray-700">Name:</span> {feature.title}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Description:</span> {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}
