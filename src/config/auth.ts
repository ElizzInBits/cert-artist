// Configurações de autenticação
export const AUTH_CONFIG = {
  // Em produção, use variáveis de ambiente
  ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD || 'admin123',
  SESSION_KEY: 'cert-admin-auth',
  SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // 8 horas em millisegundos
};