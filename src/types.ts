export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface VideoStep {
  title: string;
  timestamp: string; // e.g. "02:30"
  seconds: number;
}

export interface VideoGroup {
  id: string;
  title: string;
  description: string;
  videoIds: string[];
  createdAt: any;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publishDate: any;
  author: string;
  category?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
}

export interface SiteSettings {
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  googleAnalyticsId: string;
  fbPixelId: string;
  ogImage: string;
}

export interface VideoTutorial {
  id: string;
  categoryId: string;
  groupId?: string; // ID của nhóm (nếu có)
  isPrivate?: boolean; // Video ẩn, chỉ xem được qua mã
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  steps: VideoStep[];
  createdAt: any;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
}

export interface WorkshopCode {
  id: string;
  code: string;
  name: string;
  permittedVideoIds: string[]; // Danh sách ID video được phép xem
  createdAt: any;
}
