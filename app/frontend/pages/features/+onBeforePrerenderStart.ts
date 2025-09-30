import { OnBeforePrerenderStartAsync } from "vike/types";
import { Feature } from "../../lib/api-client.schemas";
import { listFeatures } from "../../lib/api-client";

export type Data = {
  imagePath: string;
  title: string;
  description: string | undefined;
};

// https://vike.dev/onBeforePrerenderStart
// We use this function to tell Vike which features to prerender
// and to fetch the data for each feature at build time.
export const onBeforePrerenderStart: OnBeforePrerenderStartAsync = async () => {
  // Get the list of feature IDs from Dynamodb
  const features = await getAllFeatures();

  // Map the feature IDs to route parameters
  return features.map(({ SK, imagePath, title, description }) => {
    // Sanity check
    if (!SK || !title || !imagePath) {
      throw new Error(
        `[bug] listFeatures returned a feature with missing fields: ${JSON.stringify({ SK, title, description, imagePath }, null, 2)}`,
      );
    }

    // Return the route parameters for this feature
    return {
      url: `/features/${SK.replace("FEATURE#", "")}`,
      pageContext: {
        data: {
          imagePath,
          title,
          description,
        } as Data,
      },
    };
  });
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
