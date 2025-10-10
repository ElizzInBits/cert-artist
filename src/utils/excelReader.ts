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
        
        // Convert to JSON with objects
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        
        if (jsonData.length === 0) {
          reject(new Error('Planilha está vazia'));
          return;
        }
        
        console.log('Colunas encontradas:', Object.keys(jsonData[0] || {}));
        console.log('Dados da planilha (primeiras 3 linhas):', jsonData.slice(0, 3));
        console.log('Total de linhas na planilha:', jsonData.length);
        
        const employees: Employee[] = jsonData
          .map((row: any, index: number) => {
            console.log(`Processando linha ${index + 1}:`, row);
            const employee: Employee = { nome: '', cpf: '' };
            
            // Process each property in the row
            Object.keys(row).forEach(key => {
              const value = row[key];
              console.log(`  Coluna "${key}": "${value}"`);
              
              if (value !== null && value !== undefined && value !== '') {
                const keyLower = key.toLowerCase().trim().replace(/\s+/g, '');
                const valueStr = String(value).trim();
                
                // Mapeia as colunas da planilha (formato padrão e atual)
                if ((key === 'Nome' || key === 'Listagem de Funcionários') && valueStr !== 'Nome') {
                  employee.nome = valueStr;
                  console.log(`    -> Nome definido: "${valueStr}"`);
                } else if ((key === 'CPF' || key === '__EMPTY') && valueStr !== 'CPF') {
                  employee.cpf = valueStr;
                  console.log(`    -> CPF definido: "${valueStr}"`);
                } else {
                  employee[key] = value;
                }
              }
            });
            
            console.log(`  Resultado final:`, employee);
            return employee;
          })
          .filter((employee, index) => {
            const isValid = employee.nome && employee.nome.trim() !== '';
            console.log(`Funcionário ${index + 1} válido:`, isValid, employee);
            return isValid;
          });
        
        if (employees.length === 0) {
          reject(new Error('Nenhum funcionário válido encontrado na planilha. Verifique se há uma coluna com "nome".'));
          return;
        }
        
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