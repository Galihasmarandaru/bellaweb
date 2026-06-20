import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm } from '@tanstack/react-form';
import { useCreateCategory } from '../hooks/useCategory';
import { categorySchema } from '../schemas/categorySchema';

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  type: 'accomodation' | 'spill';
}

export function CategoryFormDialog({ open, onOpenChange, onSuccess, type }: CategoryFormDialogProps) {
  const createMutation = useCreateCategory();

  const form = useForm({
    defaultValues: {
      name: '',
    },
    validators: { onChange: categorySchema },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({ name: value.name, type });
        form.reset();
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Failed to create category:', error);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Kategori</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4 mt-4"
        >
          <form.Field name="name">
            {(field) => (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Nama Kategori</label>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Contoh: Hotel Bintang 5"
                  autoFocus
                />
                {field.state.meta.errors ? (
                  <em className="text-sm text-red-500">{field.state.meta.errors.map((e: any) => e.message || e).join(', ')}</em>
                ) : null}
              </div>
            )}
          </form.Field>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Menyimpan...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
