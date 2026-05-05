import { NewsArticle, SiteSettings } from '../types';
import { MOCK_NEWS } from '../data/mockData';

const NEWS_STORAGE_KEY = 'news_articles';
const SETTINGS_STORAGE_KEY = 'site_settings';

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Gỗ Công Nghiệp Expert',
  defaultTitle: 'Hướng dẫn kỹ thuật Gỗ Công Nghiệp & Keo PUR',
  defaultDescription: 'Chuyên trang chia sẻ kiến thức, kỹ thuật vận hành máy cán phẳng, keo PUR và giải pháp nội thất gỗ công nghiệp hiện đại.',
  googleAnalyticsId: '',
  fbPixelId: '',
  ogImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1280&auto=format&fit=crop'
};

export const storage = {
  getNews: (): NewsArticle[] => {
    const stored = localStorage.getItem(NEWS_STORAGE_KEY);
    if (!stored) {
      // First time, seed with mock data
      localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(MOCK_NEWS));
      return MOCK_NEWS;
    }
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return parsed.map((item: any) => ({
      ...item,
      publishDate: new Date(item.publishDate)
    }));
  },

  getSettings: (): SiteSettings => {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(stored);
  },

  saveSettings: (settings: SiteSettings) => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    return settings;
  },

  saveArticle: (article: Partial<NewsArticle>) => {
    const news = storage.getNews();
    let updatedNews: NewsArticle[];

    if (article.id) {
      // Update existing
      updatedNews = news.map(n => n.id === article.id ? { ...n, ...article } as NewsArticle : n);
    } else {
      // Create new
      const newArticle: NewsArticle = {
        ...article,
        id: Math.random().toString(36).substr(2, 9),
        publishDate: new Date(),
        author: article.author || 'Admin',
      } as NewsArticle;
      updatedNews = [newArticle, ...news];
    }

    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(updatedNews));
    return updatedNews;
  },

  deleteArticle: (id: string) => {
    const news = storage.getNews();
    const updatedNews = news.filter(n => n.id !== id);
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(updatedNews));
    return updatedNews;
  },

  getArticleById: (id: string): NewsArticle | undefined => {
    const news = storage.getNews();
    return news.find(n => n.id === id);
  }
};
