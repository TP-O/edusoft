export default (
    target: Object,
    propertyKey: string,
    descriptor: any
) => {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        if (! this.signedIn) {
            console.log('Signing-in...');

            this.signedIn = await this.signIn();

            if (! this.signedIn) throw new Error('Sign-in failed!');
        }
        return method.apply(this, args);
    }

    return descriptor;
}
