export interface Auth
{
    signIn(): Promise<boolean>;
    signOut(): Promise<boolean>;
}
