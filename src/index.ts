import { IEduSoft } from './contracts/edusoft';
import container from './inversify.config';

const initEdusoft = (username: string, password: string, host?: string): IEduSoft => {
    const edusoft = container.get<IEduSoft>('IEduSoft');
    edusoft.setUsername(username);
    edusoft.setPassword(password);
    if (host) edusoft.setHost(host);
    return edusoft;
}

export { initEdusoft, IEduSoft };
