export default interface IEduSoft {
    signIn(): Promise<boolean>;
    signOut(): Promise<boolean>;
    getNews(): Promise<Array<object>>;
    getSchedule(): Promise<Array<object>>;
    getTestSchedule(): Promise<Array<object>>;
    getTuition(): Promise<object>;
    getTranscript({ year, semester }: {
        year?: number;
        semester?: number;
    }): Promise<Array<object>>;
}
