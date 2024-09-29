import axios from 'axios';
import { YouTubeChannelInfo } from '@/types/sanity';

export async function getYouTubeData(channelId: string, maxResults: number = 5) {
  try {
    const response = await fetch(`/api/youtube?channelId=${channelId}&maxResults=${maxResults}`);
    const data = await response.json();
    console.log('YouTube API response:', data);
    return {
      videos: data.videos || [],
      channelInfo: data.channelInfo as YouTubeChannelInfo | null
    };
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    return { videos: [], channelInfo: null };
  }
}

export async function getYouTubeStoreProducts() {
  try {
    const response = await fetch('/api/store-products');
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching store products:', error);
    return [];
  }
}