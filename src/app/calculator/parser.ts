import { Timbratura } from "./timbratura";
  
  export default class TimbraturaParser {
    static parseLine(line: string): Timbratura | null {
      
      const regex = /^(\d{2})(\d{5})(\d{6})(\d{2})(\d{2})$/;
      const trueLine = line.slice(11);
      console.log(trueLine);

      const match = trueLine.match(regex);
  
      if (!match) {
        console.log(`Formato non valido per la riga: ${trueLine}`);
        return null;
      }
  
      let [codiceDipendente, tipoOperazioneCode, data, ora, minuti] = match.slice(1);
      const tipoOperazione = tipoOperazioneCode === '00000' ? 'Entrata' : 'Uscita';
      
      // Arrotondamento al quarto d'ora
      let roundedMinutes = Math.round(parseInt(minuti) / 15) * 15;
      if (roundedMinutes === 60) {
        roundedMinutes = 0;
        ora = (parseInt(ora) + 1).toString().padStart(2, '0');
      }

      const formattedDate = `${data.slice(0, 2)}/${data.slice(2, 4)}/${data.slice(4, 6)}`;

      return {
        codiceDipendente,
        tipoOperazione,
        data: formattedDate,
        ora,
        minuti: roundedMinutes.toString().padStart(2, '0'),
      };
    }
  
    static parseFileContent(fileContent: string): Timbratura[] {
      const lines = fileContent.split('\n');
      const timbrature: Timbratura[] = [];
  
      for (const line of lines) {
        const timbratura = this.parseLine(line.trim());
        if (timbratura) {
          timbrature.push(timbratura);
        }
      }
  
      return timbrature;
    }
  }