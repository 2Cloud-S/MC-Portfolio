export interface YouTubeChannelInfo {
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: string;
  videoCount: string;
}

// Add other Sanity-related types here as needed
export interface SanityBuild {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
}

export interface SanityInventoryItem {
  _id: string;
  name: string;
  level: number;
  icon: string;
}

export interface SanityAbout {
  title: string;
  content: any; // Adjust the type based on the actual content structure
  imageUrl: string;
  image: {
    asset: {
      url: string;
    };
  };
}

export interface SanityStoreProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  url: string;
}