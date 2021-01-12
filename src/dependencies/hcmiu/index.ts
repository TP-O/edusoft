import { Container } from 'inversify';
import { Auth } from '../../app/auth/hcmiu-auth';
import { CAPTCHA } from '../../app/captcha/hmciu-captcha';
import { Crawler } from '../../app/crawler/hcmiu-crawler';
import { EduSoft } from '../../app/edusoft/hcmiu-edusoft';
import { Filter } from '../../app/filter/hcmiu-filter';
import { Register } from '../../app/registration/hcmiu-register';
import { Sender } from '../../app/sender/hcmiu-sender';
import { Constracts } from '../../contracts';

export const bindHCMIU = (container: Container) => {

    container.bind<Constracts.IEduSoft>('HCMIUEduSoft').to(EduSoft);
    container.bind<Constracts.ISender>('HCMIUSender').to(Sender);
    container.bind<Constracts.ICrawler>('HCMIUCrawler').to(Crawler);
    container.bind<Constracts.IFilter>('HCMIUFilter').to(Filter);
    container.bind<Constracts.IRegister>('HCMIURegister').to(Register);
    container.bind<Constracts.IAuth>('HCMIUAuth').to(Auth);
    container.bind<Constracts.ICAPTCHA>('HCMIUCAPTCHA').to(CAPTCHA);
}
