import * as XLSX from 'xlsx';
import { Employee } from '@/types/certificate';

export const readExcelFile = async (file: File): Promise<Employee[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          reject(new Error('Planilha não contém abas válidas'));
          return;
        }
        
        // Get first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        if (!worksheet) {
          reject(new Error('Não foi possível ler a primeira aba da planilha'));
          return;
        }
        
        // Convert to raw array format to handle headers properly
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        const rawData: any[][] = [];
        
        // Read all cells as raw data
        for (let row = range.s.r; row <= range.e.r; row++) {
          const rowData: any[] = [];
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const cell = worksheet[cellAddress];
            rowData.push(cell ? String(cell.v || '').trim() : '');
          }
          rawData.push(rowData);
        }
        
        console.log('Dados brutos da planilha:', rawData.slice(0, 5));
        
        // Find header row by looking for "Nome" and "CPF" patterns
        let headerRowIndex = -1;
        let nomeColumnIndex = -1;
        let cpfColumnIndex = -1;
        
        for (let i = 0; i < rawData.length; i++) {
          const row = rawData[i];
          for (let j = 0; j < row.length; j++) {
            const cellValue = String(row[j]).toLowerCase().trim();
            
            // Look for name column variations
            if (cellValue.match(/^(nome|name|funcionario|funcionário)$/)) {
              headerRowIndex = i;
              nomeColumnIndex = j;
            }
            
            // Look for CPF column variations
            if (cellValue.match(/^(cpf|documento|doc|rg)$/)) {
              if (headerRowIndex === -1) headerRowIndex = i;
              cpfColumnIndex = j;
            }
          }
          
          // If we found both columns in the same row, break
          if (nomeColumnIndex !== -1 && cpfColumnIndex !== -1 && headerRowIndex === i) {
            break;
          }
        }
        
        console.log(`Header encontrado na linha ${headerRowIndex + 1}`);
        console.log(`Coluna Nome: ${nomeColumnIndex + 1} (${String.fromCharCode(65 + nomeColumnIndex)})`);
        console.log(`Coluna CPF: ${cpfColumnIndex + 1} (${String.fromCharCode(65 + cpfColumnIndex)})`);
        
        if (headerRowIndex === -1 || nomeColumnIndex === -1) {
          reject(new Error('Não foi possível encontrar a coluna "Nome" na planilha. Verifique se existe uma célula com "Nome" ou "Funcionário".'));
          return;
        }
        
        // Process data rows (after header)
        const employees: Employee[] = [];
        
        for (let i = headerRowIndex + 1; i < rawData.length; i++) {
          const row = rawData[i];
          const nome = row[nomeColumnIndex] ? String(row[nomeColumnIndex]).trim() : '';
          const cpf = cpfColumnIndex !== -1 && row[cpfColumnIndex] ? String(row[cpfColumnIndex]).trim() : '';
          
          console.log(`Linha ${i + 1}: Nome="${nome}", CPF="${cpf}"`);
          
          if (nome && nome !== '') {
            employees.push({ nome, cpf });
            console.log(`  -> Funcionário adicionado: ${nome}`);
          }
        }
        
        if (employees.length === 0) {
          reject(new Error('Nenhum funcionário encontrado após o cabeçalho. Verifique se há dados nas linhas abaixo do cabeçalho.'));
          return;
        }
        
        console.log(`Total de funcionários processados: ${employees.length}`);
        resolve(employees);
      } catch (error) {
        console.error('Erro ao processar planilha:', error);
        reject(new Error(`Erro ao processar planilha: ${error instanceof Error ? error.message : 'Erro desconhecido'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};