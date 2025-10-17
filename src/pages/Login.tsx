import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = await login(username, password);
    
    if (!success) {
      toast({
        title: "Acesso negado",
        description: "Senha incorreta. Tente novamente.",
        variant: "destructive"
      });
      setPassword('');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Acesso Administrativo
          </CardTitle>
          <p className="text-gray-600">
            Digite a senha para acessar o sistema
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !password || !username}
            >
              {isLoading ? 'Verificando...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500">
            <div>Usuário: <strong>admin</strong></div>
            <div>Senha: <strong>admin123</strong></div>
            <div className="text-xs mt-1 text-gray-400">
              (Credenciais padrão - altere após o primeiro acesso)
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}