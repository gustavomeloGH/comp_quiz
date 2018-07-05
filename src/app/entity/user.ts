export class User {

    $key: string;
    nome: string;
    email: string;
    senha: string;
    rankings: Array<any>;
    /*RANKINGS -> ARRAY 2 ELEMENTOS -> [0]: Categoria, [1]: Pontuação*/
    rankingGeral: number;

    constructor () {
        this.rankings = new Array([]);
        this.rankingGeral = 0;
    }
}
