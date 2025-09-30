import { listFeatures } from "./api-client";
import { Feature } from "./api-client.schemas";

export const getAllFeatures = async (projectionExpression: string): Promise<Feature[]> => {
  let lastFeatureId: string | undefined;
  const features: Feature[] = [];
  do {
    const { data } = await listFeatures({
      projectionExpression,
      lastFeatureId,
    });
    lastFeatureId = data.lastFeatureId;
    features.push(...data.features);
  } while (lastFeatureId);
  return features;
};
