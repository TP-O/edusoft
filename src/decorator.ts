const loggedIn = (target: any, key: string, descriptor: any) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
        if (! this.loggedIn) {
            console.log('Logging in...');
            let loggedIn: boolean = await this.login();

            if (loggedIn === true) return originalMethod.apply(this, args);
        }
        return originalMethod.apply(this, args);
    }
}

export {
    loggedIn
}