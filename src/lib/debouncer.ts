import ConfigStore from './config-store';
import {AnyFunction} from './types';

const isNumber = require('lodash.isnumber');

export default class Debouncer {
    private readonly configStore: ConfigStore;
    private timeout?: NodeJS.Timer;

    constructor(configStore: ConfigStore) {
        this.configStore = configStore;
    }

    debounce(callback: AnyFunction) {
        if (this.timeout) clearTimeout(this.timeout);

        const waitTime = this.configStore.delayForRefreshingHighlight;
        if (isNumber(waitTime)) {
            this.timeout = setTimeout(callback, waitTime);
        }
    }

}
