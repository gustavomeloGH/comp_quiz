export class Questionnaries {

    $key: string;
    category: string;
    title: string;
    alternatives: Array<string>;
    aswerIndex: number;

    constructor () {
        this.alternatives = new Array<string>();
    }
}
