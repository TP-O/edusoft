import { Container } from 'inversify';
import { bindHCMIU } from './dependencies/hcmiu';

const container = new Container();

bindHCMIU(container);

export default container;
