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
        
        // Find header row with multiple strategies
        let headerRowIndex = -1;
        let nomeColumnIndex = -1;
        let cpfColumnIndex = -1;
        
        // Strategy 1: Look for exact header matches
        for (let i = 0; i < Math.min(10, rawData.length); i++) { // Only check first 10 rows
          const row = rawData[i];
          for (let j = 0; j < row.length; j++) {
            const cellValue = String(row[j]).toLowerCase().trim();
            
            // Look for name column variations (comprehensive list)
            if (cellValue.match(/^(nome|name|funcionario|funcionário|colaborador|empregado|pessoa|participante|aluno|estudante|cliente|trabalhador|servidor)$/)) {
              headerRowIndex = i;
              nomeColumnIndex = j;
              console.log(`Coluna NOME encontrada: "${row[j]}" na linha ${i + 1}, coluna ${j + 1}`);
            }
            
            // Look for CPF column variations (comprehensive list)
            if (cellValue.match(/^(cpf|cnpj|documento|doc|rg|identidade|registro|matricula|matrícula|codigo|código|id|identificacao|identificação)$/)) {
              if (headerRowIndex === -1) headerRowIndex = i;
              cpfColumnIndex = j;
              console.log(`Coluna CPF encontrada: "${row[j]}" na linha ${i + 1}, coluna ${j + 1}`);
            }
          }
          
          // If we found name column, break (CPF is optional)
          if (nomeColumnIndex !== -1) {
            break;
          }
        }
        
        // Strategy 2: If no headers found, look for data patterns
        if (headerRowIndex === -1) {
          console.log('Nenhum cabeçalho encontrado, procurando por padrões de dados...');
          
          for (let i = 0; i < rawData.length; i++) {
            const row = rawData[i];
            const nonEmptyCells = row.filter(cell => cell && String(cell).trim() !== '');
            
            if (nonEmptyCells.length >= 1) {
              // Check if this looks like a data row (not header)
              const firstCell = String(row.find(cell => cell && String(cell).trim() !== '') || '').trim();
              const isLikelyName = firstCell.length > 2 && 
                                 !firstCell.match(/^(nome|name|funcionario|cpf|documento)$/i) &&
                                 firstCell.match(/[a-zA-ZÀ-ſ\s]+/);
              
              if (isLikelyName) {
                console.log(`Linha ${i + 1} parece conter dados (primeira célula: "${firstCell}")`);
                headerRowIndex = i - 1; // Assume previous row was header (even if empty)
                
                // Find columns with data
                for (let j = 0; j < row.length; j++) {
                  if (row[j] && String(row[j]).trim() !== '') {
                    if (nomeColumnIndex === -1) {
                      nomeColumnIndex = j;
                      console.log(`Coluna ${j + 1} definida como NOME`);
                    } else if (cpfColumnIndex === -1) {
                      const cellValue = String(row[j]).trim();
                      // Check if looks like CPF/document
                      if (cellValue.match(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/) || cellValue.match(/^\d{11,14}$/)) {
                        cpfColumnIndex = j;
                        console.log(`Coluna ${j + 1} definida como CPF (padrão detectado)`);
                      }
                    }
                  }
                }
                break;
              }
            }
          }
          
          // If still no name column, use first column with text data
          if (nomeColumnIndex === -1) {
            for (let i = 0; i < rawData.length; i++) {
              const row = rawData[i];
              for (let j = 0; j < row.length; j++) {
                const cell = String(row[j] || '').trim();
                if (cell.length > 2 && cell.match(/[a-zA-ZÀ-ſ]/)) {
                  headerRowIndex = Math.max(0, i - 1);
                  nomeColumnIndex = j;
                  console.log(`Forçando coluna ${j + 1} como NOME (primeira com texto)`);
                  break;
                }
              }
              if (nomeColumnIndex !== -1) break;
            }
          }
        }
        
        console.log(`Header encontrado na linha ${headerRowIndex + 1}`);
        console.log(`Coluna Nome: ${nomeColumnIndex + 1} (${String.fromCharCode(65 + nomeColumnIndex)})`);
        console.log(`Coluna CPF: ${cpfColumnIndex + 1} (${String.fromCharCode(65 + cpfColumnIndex)})`);
        
        if (headerRowIndex === -1 || nomeColumnIndex === -1) {
          reject(new Error('Não foi possível encontrar dados válidos na planilha. Verifique se:\n1. Existe uma coluna com nomes (Nome, Funcionário, etc.)\n2. A planilha não está vazia\n3. Os dados estão em formato de tabela'));
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