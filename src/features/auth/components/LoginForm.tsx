import { useForm } from '@tanstack/react-form';
import { useLogin } from '../hooks/useLogin.ts';
import { loginSchema } from '../schemas/authSchema.ts';

export function LoginForm() {
  const login = useLogin();

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      await login.mutateAsync(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-md border p-4 shadow-sm"
    >
      <h2 className="mb-2 font-bold text-xl">Login</h2>
      <form.Field name="email">
        {(field) => (
          <div className="flex flex-col gap-1">
            <input
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Email"
              className="rounded-md border px-3 py-2"
            />
            {field.state.meta.errors ? (
              <em className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</em>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <div className="flex flex-col gap-1">
            <input
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Password"
              className="rounded-md border px-3 py-2"
            />
            {field.state.meta.errors ? (
              <em className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</em>
            ) : null}
          </div>
        )}
      </form.Field>

      <button
        type="submit"
        disabled={login.isPending}
        className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {login.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
