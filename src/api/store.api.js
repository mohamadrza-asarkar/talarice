import allData from '../temp_all_data.json';

export const storeApi = {
  getStoreInfo: async () => {
    return allData.storeInfo;
  },
  getBrandStory: async () => {
    return allData.brandStory;
  },
  getTrustItems: async () => {
    return allData.trustItems;
  },
  getThemeStyles: async () => {
    return allData.themeStylesSummary;
  }
};

export default storeApi;
