export type Timbratura = {
    codiceDipendente: string;
    tipoOperazione: 'Entrata' | 'Uscita';
    data: string;
    ora: string;
    minuti: string;
};