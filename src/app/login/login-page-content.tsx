// src/app/login/login-page-content.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { Activity } from "lucide-react"; // Using Activity as a generic logo icon
import Link from "next/link";

export function LoginPageContent() {
  const { t } = useAppTranslation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Implement actual login logic when authentication is added
    // For now, it can redirect or show a message
    alert(t('loginAttemptMessage') || "Login functionality not implemented yet.");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center items-center mb-4">
            <Activity className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{t('loginToPharmaEase')}</CardTitle>
          <CardDescription>
            {t('loginPageDescription')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="example@domain.com" 
                required 
                className="h-10 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="********" 
                required 
                className="h-10 text-base"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              {/* <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me" className="font-normal">
                  {t('rememberMe')}
                </Label>
              </div> */}
              {/* <Link href="#" className="font-medium text-primary hover:underline">
                {t('forgotPassword')}
              </Link> */}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full h-11 text-base font-semibold">
              {t('signIn')}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t('noAccountYet')} <Link href="#" className="font-medium text-primary hover:underline">{t('contactSupport')}</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} PharmaEase. {t('allRightsReserved')}
      </p>
    </div>
  );
}
