import { useForm } from '@tanstack/react-form';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { ZodType } from 'zod';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateInvoiceItemTemplate,
  useCreateInvoiceRecipient,
  useDeleteInvoiceItemTemplate,
  useDeleteInvoiceRecipient,
  useInvoiceItemTemplates,
  useInvoiceRecipients,
  useUpdateInvoiceItemTemplate,
  useUpdateInvoiceRecipient,
} from '../hooks/useInvoiceOptions';
import {
  invoiceItemTemplateOptionSchema,
  invoiceRecipientOptionSchema,
} from '../schemas/invoiceSchema';

interface MasterOptionRow {
  id: string;
  label: string;
}

interface OptionMasterPanelProps {
  title: string;
  description: string;
  placeholder: string;
  emptyText: string;
  deleteConfirmTitle: string;
  items: MasterOptionRow[];
  isLoading: boolean;
  error: Error | null;
  multiline?: boolean;
  optionSchema: ZodType<{ value: string }, { value: string }>;
  onCreate: (value: string) => Promise<unknown>;
  onUpdate: (id: string, value: string) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  isSubmittingCreate: boolean;
  isSubmittingUpdate: boolean;
  isSubmittingDelete: boolean;
}

function getFieldErrorMessage(errors: unknown[]): string {
  return errors
    .map((err) => {
      if (typeof err === 'string') return err;
      if (err && typeof err === 'object' && 'message' in err) {
        return String((err as { message: unknown }).message);
      }
      return '';
    })
    .filter(Boolean)
    .join(', ');
}

function formatMutationError(err: unknown): string {
  const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan data.';
  if (message.toLowerCase().includes('duplicate') || message.includes('23505')) {
    return 'Opsi ini sudah ada di database.';
  }
  return message;
}

function OptionMasterPanel({
  title,
  description,
  placeholder,
  emptyText,
  deleteConfirmTitle,
  items,
  isLoading,
  error,
  multiline = false,
  optionSchema,
  onCreate,
  onUpdate,
  onDelete,
  isSubmittingCreate,
  isSubmittingUpdate,
  isSubmittingDelete,
}: OptionMasterPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<MasterOptionRow | null>(null);

  const form = useForm({
    defaultValues: {
      value: '',
    },
    validators: { onSubmit: optionSchema },
    onSubmit: async ({ value }) => {
      setActionError(null);
      try {
        await onCreate(value.value.trim());
        form.reset();
      } catch (err) {
        setActionError(formatMutationError(err));
      }
    },
  });

  const handleStartEdit = (item: MasterOptionRow) => {
    setActionError(null);
    setEditingId(item.id);
    setEditingValue(item.label);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
    setActionError(null);
  };

  const handleSaveEdit = async (id: string) => {
    const parsed = optionSchema.safeParse({ value: editingValue });
    if (!parsed.success) {
      setActionError(parsed.error.issues[0]?.message ?? 'Input tidak valid.');
      return;
    }

    setActionError(null);
    try {
      await onUpdate(id, parsed.data.value);
      setEditingId(null);
      setEditingValue('');
    } catch (err) {
      setActionError(formatMutationError(err));
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteItem) return;
    setActionError(null);
    try {
      await onDelete(pendingDeleteItem.id);
      setPendingDeleteItem(null);
    } catch (err) {
      setActionError(formatMutationError(err));
      setPendingDeleteItem(null);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-2"
        >
          <form.Field name="value">
            {(field) => {
              const errorMessage = getFieldErrorMessage(field.state.meta.errors);
              return (
                <div className="flex flex-col gap-1.5">
                  <div className={multiline ? 'flex flex-col gap-2' : 'flex gap-2'}>
                    {multiline ? (
                      <Textarea
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={placeholder}
                        className="min-h-16 text-sm"
                      />
                    ) : (
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={placeholder}
                        className="h-9 flex-1"
                      />
                    )}
                    <Button
                      type="submit"
                      disabled={isSubmittingCreate}
                      className="shrink-0 self-end bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90 sm:self-auto"
                    >
                      <Plus className="mr-1.5 size-4" />
                      {isSubmittingCreate ? 'Menyimpan...' : 'Tambah Opsi'}
                    </Button>
                  </div>
                  {errorMessage ? <p className="text-red-500 text-xs">{errorMessage}</p> : null}
                </div>
              );
            }}
          </form.Field>
        </form>

        {actionError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-600 text-xs">
            {actionError}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800 text-xs">
            Gagal memuat data dari database: {error.message}
          </div>
        ) : null}

        <div className="flex flex-col divide-y rounded-lg border">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Memuat daftar opsi...
            </div>
          ) : items.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">{emptyText}</div>
          ) : (
            items.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <div key={item.id} className="flex items-start justify-between gap-2 p-3">
                  {isEditing ? (
                    <div className="flex flex-1 flex-col gap-2">
                      {multiline ? (
                        <Textarea
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="min-h-14 text-sm"
                          autoFocus
                        />
                      ) : (
                        <Input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="h-8 text-sm"
                          autoFocus
                        />
                      )}
                      <div className="flex justify-end gap-1.5">
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isSubmittingUpdate}
                        >
                          <X className="mr-1 size-3" /> Batal
                        </Button>
                        <Button
                          type="button"
                          size="xs"
                          className="bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90"
                          onClick={() => handleSaveEdit(item.id)}
                          disabled={isSubmittingUpdate}
                        >
                          <Check className="mr-1 size-3" /> Simpan
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="flex-1 break-words text-slate-700 text-sm leading-relaxed">
                        {item.label}
                      </p>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="ghost"
                          title="Edit opsi"
                          onClick={() => handleStartEdit(item)}
                        >
                          <Pencil className="size-3.5 text-slate-600" />
                        </Button>
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="ghost"
                          title="Hapus opsi"
                          className="text-red-500 hover:bg-red-50 hover:text-red-700"
                          onClick={() => setPendingDeleteItem(item)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>

      <AlertDialog
        open={Boolean(pendingDeleteItem)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteItem(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              Opsi &ldquo;{pendingDeleteItem?.label}&rdquo; akan dihapus permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmittingDelete}>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isSubmittingDelete}
              onClick={handleConfirmDelete}
            >
              {isSubmittingDelete ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export function InvoiceOptionsManager() {
  const recipientsQuery = useInvoiceRecipients();
  const createRecipient = useCreateInvoiceRecipient();
  const updateRecipient = useUpdateInvoiceRecipient();
  const deleteRecipient = useDeleteInvoiceRecipient();

  const templatesQuery = useInvoiceItemTemplates();
  const createTemplate = useCreateInvoiceItemTemplate();
  const updateTemplate = useUpdateInvoiceItemTemplate();
  const deleteTemplate = useDeleteInvoiceItemTemplate();

  const recipientItems: MasterOptionRow[] = (recipientsQuery.data ?? []).map((item) => ({
    id: item.id,
    label: item.name,
  }));

  const templateItems: MasterOptionRow[] = (templatesQuery.data ?? []).map((item) => ({
    id: item.id,
    label: item.description,
  }));

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-[#1b3b2c] text-lg">Kelola Opsi Tersimpan (Database)</h3>
        <p className="text-slate-500 text-sm">
          Tambahkan, ubah, atau hapus daftar pilihan KEPADA dan deskripsi ITEM INVOICE agar siap
          dipilih pada form di atas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <OptionMasterPanel
          title="Opsi KEPADA"
          description="Daftar klien / brand yang dapat dipilih di kolom KEPADA."
          placeholder="Contoh: Jogja Lodge"
          emptyText="Belum ada opsi KEPADA tersimpan."
          deleteConfirmTitle="Hapus opsi KEPADA?"
          items={recipientItems}
          isLoading={recipientsQuery.isLoading}
          error={recipientsQuery.error}
          optionSchema={invoiceRecipientOptionSchema}
          onCreate={(value) => createRecipient.mutateAsync(value)}
          onUpdate={(id, value) => updateRecipient.mutateAsync({ id, name: value })}
          onDelete={(id) => deleteRecipient.mutateAsync(id)}
          isSubmittingCreate={createRecipient.isPending}
          isSubmittingUpdate={updateRecipient.isPending}
          isSubmittingDelete={deleteRecipient.isPending}
        />

        <OptionMasterPanel
          title="Opsi Deskripsi ITEM INVOICE"
          description="Daftar template keterangan item pekerjaan yang dapat dipilih dan diedit ulang."
          placeholder="Contoh: Konten on-site oleh content creator (1-2 konten/2 minggu, 2-3 kunjungan/bulan)"
          emptyText="Belum ada deskripsi ITEM INVOICE tersimpan."
          deleteConfirmTitle="Hapus deskripsi ITEM INVOICE?"
          items={templateItems}
          isLoading={templatesQuery.isLoading}
          error={templatesQuery.error}
          multiline
          optionSchema={invoiceItemTemplateOptionSchema}
          onCreate={(value) => createTemplate.mutateAsync(value)}
          onUpdate={(id, value) => updateTemplate.mutateAsync({ id, description: value })}
          onDelete={(id) => deleteTemplate.mutateAsync(id)}
          isSubmittingCreate={createTemplate.isPending}
          isSubmittingUpdate={updateTemplate.isPending}
          isSubmittingDelete={deleteTemplate.isPending}
        />
      </div>
    </section>
  );
}
