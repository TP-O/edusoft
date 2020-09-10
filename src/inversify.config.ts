import { Container } from 'inversify';

import { Sender } from './app/sender';
import { Crawler } from './app/crawler';
import { EduSoft } from './app/edusoft';
import { ICrawler } from './contracts/crawler';
import { IEduSoft } from './contracts/edusoft';
import { ISender } from './contracts/sender';

let container = new Container();
container.bind<ISender>('ISender').to(Sender);
container.bind<ICrawler>('ICrawler').to(Crawler);
container.bind<IEduSoft>('IEduSoft').to(EduSoft);

export default container;
