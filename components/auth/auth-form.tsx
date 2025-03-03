"use client";

import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

export function AuthForm() {
  const { theme } = useTheme();
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {view === "sign_in" ? "Sign In" : "Create Account"}
        </CardTitle>
        <CardDescription>
          {view === "sign_in" 
            ? "Sign in to access your account" 
            : "Create a new account to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary))',
                  brandButtonText: 'hsl(var(--primary-foreground))',
                },
              },
            },
            className: {
              button: 'bg-primary text-primary-foreground hover:bg-primary/90',
              input: 'bg-background border border-input',
              label: 'text-foreground',
              anchor: 'text-primary hover:text-primary/80',
            },
          }}
          theme={theme === "dark" ? "dark" : "light"}
          providers={[]}
          view={view}
          onViewChange={(newView) => {
            if (newView === "sign_in" || newView === "sign_up") {
              setView(newView);
            }
          }}
        />
      </CardContent>
    </Card>
  );
}