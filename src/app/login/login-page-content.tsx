
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { loginAction } from './actions';
import { Loader2 } from 'lucide-react';

export function LoginPageContent() {
  const { t } = useAppTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const result = await loginAction(username, password);
      if (result.success) {        
        toast({
          title: t('loginSuccessTitle'),
          description: t('loginSuccessDescription'),
        });
        router.push('/inventory'); // Redirect to inventory page
      } else {
        toast({
          variant: 'destructive',
          title: t('loginFailedTitle'),
          description: result.error ? t(result.error) : t('loginFailedDescriptionGeneric'),
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('loginErrorUnexpected'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            {t('pharmaEase')}
          </CardTitle>
          <CardDescription>{t('loginToPharmaEase')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">{t('username')}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t('usernamePlaceholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                t('loginButton')
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
           © {new Date().getFullYear()} {t('pharmaEase')}. {t('allRightsReserved')}.
        </CardFooter>
      </Card>
    </div>
  );
}
