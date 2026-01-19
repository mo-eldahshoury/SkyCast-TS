export interface NewsArticle {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
}
export interface LatestUpdate {
    time: string;
    title: string;
}
export interface MockNews {
    articles: NewsArticle[];
}
/**
 * Mock News Data
 */
export declare const MOCK_NEWS: MockNews;
export declare const LATEST_UPDATES: LatestUpdate[];
//# sourceMappingURL=newsData.d.ts.map