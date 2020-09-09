export interface ICrawler
{
    crawlTuition(url: string): Promise<object>;
    crawlTestSchedule(url: string): Promise<object[]>;
    crawlNews(url: string, domain: string): Promise<object[]>;
    crawlTranscript(url: string, data: object): Promise<object[]>;
    crawlSchedule(url: string, period: object[]): Promise<object[]>;
}
