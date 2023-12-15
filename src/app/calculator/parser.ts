import { Timbratura } from "./timbratura";
import axios from "axios";

interface Employee {
  id: number;
  name: string;
}

interface Info {
  isError: boolean;
  message: string;
}

export default class TimbraturaParser {
  static async parseLine(line: string, employees: Employee[]): Promise<Timbratura | null> {
    const regex = /^(\d{2})(\d{5})(\d{6})(\d{2})(\d{2})$/;
    const trueLine = line.slice(11);

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

    // Find the employee with the given id and get their name
    const employee = employees.find((emp) => emp.id === parseInt(codiceDipendente, 10));
    
    if(employee){
      console.log(codiceDipendente+employee.name+employee.id);
      codiceDipendente = employee.name;
    }else{
      console.log('Non e stato trovato un nome dipendente per il codice:'+codiceDipendente);
    }

    return {
      codiceDipendente,
      tipoOperazione,
      data: formattedDate,
      ora,
      minuti: roundedMinutes.toString().padStart(2, '0'),
    };
  }

  static async parseFileContent(fileContent: string): Promise<Timbratura[]> {
    const lines = fileContent.split('\n');
    const timbrature: Timbratura[] = [];

    try {
      const response = await axios.get<Employee[]>('/api/settings');
      const employees = response.data;

      for (const line of lines) {
        const timbratura = await this.parseLine(line.trim(), employees);
        if (timbratura) {
          timbrature.push(timbratura);
        }
      }
    } catch (error) {
      // Handle error fetching employees data
      console.error('Error fetching employees data:', error);
    }

    return timbrature;
  }
}