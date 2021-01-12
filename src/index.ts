import { Constracts } from './contracts';
import container from './inversify.config';

const initEduSoft = (username: string, password: string, host?: string): Constracts.IEduSoft => {
    const edusoft = container.get<Constracts.IEduSoft>('HCMIUEduSoft');
    edusoft.username = username;
    edusoft.password = password;

    if (host) {
        edusoft.host = host;
    }

    return edusoft;
}

export { initEduSoft, Constracts };
