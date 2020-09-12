import { Container } from 'inversify';

import { Sender } from './app/sender';
import { Crawler } from './app/crawler';
import { EduSoft } from './app/edusoft';
import { Register } from './app/register';
import { ICrawler } from './contracts/crawler';
import { IEduSoft } from './contracts/edusoft';
import { ISender } from './contracts/sender';
import { IRegister } from './contracts/register';

let container = new Container();
container.bind<ISender>('ISender').to(Sender);
container.bind<ICrawler>('ICrawler').to(Crawler);
container.bind<IRegister>('IRegister').to(Register);
container.bind<IEduSoft>('IEduSoft').to(EduSoft);

export default container;
