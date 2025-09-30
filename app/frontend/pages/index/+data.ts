import { Feature } from "../../lib/api-client.schemas";
import { getAllFeatures } from "../../lib/get-all-features";

export type SearchData = {
  features: Feature[];
};

export const data = async (): Promise<SearchData> => {
  const features = await getAllFeatures("title,latLong,description");
  return { features };
};
