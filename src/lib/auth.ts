// Autenticação simples para o frontend
export async function verifyPassword(username: string, password: string): Promise<boolean> {
  // Credenciais válidas
  return username === 'administrador' && password === 'salubrita';
}