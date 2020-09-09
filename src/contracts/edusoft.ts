import { Auth } from './auth';

export interface IEduSoft extends Auth
{
    /**
     * Sign-in
     * 
     * @return {Promise<boolean>}
     */
    signIn(): Promise<boolean>;

    /**
     * Sign-out
     * 
     * @return {Promise<boolean>}
     */
    signOut(): Promise<boolean>;

    /**
     * Display a listing of news
     * 
     * @return {Promise<object[]>}
     */
    getNews(): Promise<object[]>;

    /**
     * Display schedule
     * 
     * @return {Promise<object[]>}
     */
    getSchedule(): Promise<object[]>;

    /**
     * Display test schedule
     * 
     * @return {Promise<object[]>}
     */
    getTestSchedule(): Promise<object[]>;

    /**
     * Display tuition information
     * 
     * @return {Promise<object>}
     */
    getTuition(): Promise<object>;

    /**
     * Display the specified listing of scores
     * 
     * @param {number}  year        School year
     * @param {number}  semester    Semester of year
     * 
     * @return {Promise<object[]>}
     */
    getTranscript(year: number, semester: number): Promise<object[]>;
}
