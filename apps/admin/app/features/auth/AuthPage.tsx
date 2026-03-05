"use client";

import type { FormEvent, ReactElement } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";

function AuthEmailInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}): ReactElement {
  return (
    <div className="space-y-2">
      <label htmlFor="auth-email" className="text-sm font-medium">
        Email
      </label>
      <Input
        id="auth-email"
        type="email"
        placeholder="you@example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        autoComplete="email"
        className="rounded-xl"
      />
    </div>
  );
}

function AuthPasswordInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}): ReactElement {
  return (
    <div className="space-y-2">
      <label htmlFor="auth-password" className="text-sm font-medium">
        Password
      </label>
      <Input
        id="auth-password"
        type="password"
        placeholder="••••••••"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        autoComplete="current-password"
        className="rounded-xl"
      />
    </div>
  );
}

type LoginFieldsProps = {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  error: string | null;
  loading: boolean;
  onSubmit: (e: FormEvent) => void;
};

function LoginFields(props: LoginFieldsProps): ReactElement {
  const { email, setEmail, password, setPassword, error, loading, onSubmit } =
    props;
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthEmailInput value={email} onChange={setEmail} />
      <AuthPasswordInput value={password} onChange={setPassword} />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="w-full rounded-xl" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

function LoginForm(): ReactElement {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.replace("/");
  }

  return (
    <LoginFields
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
}

function AuthPage(): ReactElement {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm rounded-2xl border shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

export { AuthPage };
export default AuthPage;
