export const requireSignIn = (
    target: Object,
    propertyKey: string,
    descriptor: any
) => {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        if (! this.signedIn) {
            console.log('Signing-in...');

            this.signedIn = await this._auth.signIn({
                host: this._host,
                body: this._body,
                username: this._username,
                password: this._password
            });

            if (! this.signedIn) {
                throw new Error('Sign-in failed!');
            }
        }
        return method.apply(this, args);
    }

    return descriptor;
}
