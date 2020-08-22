const loggedIn = (
    target: Object,
    propertyKey: string,
    descriptor: any
) => {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        if (! this.loggedIn) {
            console.log('Logging in...');
            this.loggedIn = await this.login();

            if (this.loggedIn === true) return method.apply(this, args);
            throw new Error('Login failed!');
        }
        return method.apply(this, args);
    }
    return descriptor;
}

export {
    loggedIn
}