import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useLogin } from '../hooks/useLogin.ts';
import { loginSchema } from '../schemas/authSchema.ts';
import { setUser } from '../stores/authStore.ts';

export function LoginForm() {
  const login = useLogin();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: { username: '', password: '' },
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      const res = await login.mutateAsync(value);
      setUser(res.user);
      navigate({ to: '/admin' });
    },
  });

  return (
    <Card className="mx-auto px-6 py-8 w-full max-w-sm shadow-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CardHeader className='pb-8'>
          <CardTitle className="text-2xl text-center font-bold text-[#1b3b2c]">Login</CardTitle>
          <CardDescription className="text-center pt-1">
            Silakan masuk untuk mengakses sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form.Field name="username">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Username</label>
                <Input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Masukkan username"
                  className={field.state.meta.errors?.length ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {field.state.meta.errors?.length ? (
                  <em className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</em>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Input
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Masukkan password"
                  className={field.state.meta.errors?.length ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {field.state.meta.errors?.length ? (
                  <em className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</em>
                ) : null}
              </div>
            )}
          </form.Field>
        </CardContent>
        <CardFooter className='bg-transparent border-t-0 py-12'>
          <Button
            type="submit"
            className="w-full bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90"
            disabled={login.isPending}
            size="lg"
          >
            {login.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
