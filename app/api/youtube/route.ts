import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { YouTubeChannelInfo } from '@/types/sanity';

export async function GET(request: Request) {
  console.log('Environment variables:', process.env);
  console.log('YOUTUBE_API_KEY:', process.env.YOUTUBE_API_KEY);

  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');
  const maxResults = searchParams.get('maxResults') || '5';

  console.log('Received request with channelId:', channelId, 'and maxResults:', maxResults);

  if (!process.env.YOUTUBE_API_KEY) {
    console.error('YouTube API key is not set');
    return NextResponse.json({ error: 'YouTube API key is not configured' }, { status: 500 });
  }

  console.log('API Key:', process.env.YOUTUBE_API_KEY);

  const apiKey = process.env.YOUTUBE_API_KEY; // Use the environment variable for the API key

  const youtube = google.youtube({
    version: 'v3',
    auth: apiKey
  });

  console.log('YouTube client initialized');

  try {
    console.log('Fetching YouTube data...');
    const [videosResponse, channelResponse] = await Promise.all([
      youtube.search.list({
        part: ['id', 'snippet'],
        channelId: channelId as string,
        order: 'date',
        type: ['video'],
        maxResults: Number(maxResults)
      }),
      youtube.channels.list({
        part: ['snippet', 'statistics'],
        id: [channelId as string]
      })
    ]);

    console.log('YouTube API responses received');

    const videos = videosResponse.data.items?.map(item => ({
      id: item.id?.videoId,
      title: item.snippet?.title,
      thumbnail: item.snippet?.thumbnails?.medium?.url,
      publishedAt: item.snippet?.publishedAt
    })).slice(0, 5) || [];

    const channelInfo = channelResponse.data.items?.[0];
    const channelData: YouTubeChannelInfo = {
      title: channelInfo?.snippet?.title || '',
      description: channelInfo?.snippet?.description || '',
      thumbnailUrl: channelInfo?.snippet?.thumbnails?.medium?.url || '',
      subscriberCount: channelInfo?.statistics?.subscriberCount || '0',
      videoCount: channelInfo?.statistics?.videoCount || '0'
    };

    console.log('Data processed successfully');
    return NextResponse.json({ videos, channelInfo: channelData });
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch YouTube data', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to fetch YouTube data', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}