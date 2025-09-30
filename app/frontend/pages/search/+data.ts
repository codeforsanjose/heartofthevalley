import { listFeatures } from "../../lib/api-client";
import { Feature } from "../../lib/api-client.schemas";

export type SearchData = {
  features: Feature[];
};

export const data = async (): Promise<SearchData> => {
  const features = await getAllFeatures();
  return { features };
};

// Helper function to get all features from the API, handling pagination
const getAllFeatures = async (): Promise<Feature[]> => {
  let lastFeatureId: string | undefined;
  const features: Feature[] = [];
  do {
    const { data } = await listFeatures({
      projectionExpression: "SK,imagePath,title,description",
      lastFeatureId,
    });
    lastFeatureId = data.lastFeatureId;
    features.push(...data.features);
  } while (lastFeatureId);
  return features;
};
