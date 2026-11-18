import { get, set } from 'idb-keyval';
import { Download, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useInvoiceItemTemplates, useInvoiceRecipients } from '../hooks/useInvoiceOptions';
import type { InvoiceFormState, InvoiceItem, InvoiceTaxItem } from '../types/invoice.types';
import { generatePdf } from '../utils/generatePdf';
import {
  createDefaultInvoiceState,
  formatIndonesianLongDate,
  formatInvoiceNumber,
  formatShortSlashDate,
  normalizeStoredInvoiceState,
} from '../utils/invoiceDate';
import {
  computeInvoiceTaxSummary,
  formatInvoiceRp,
  sanitizeTaxRateInput,
} from '../utils/invoiceTax';
import { EditableOptionPicker, type SelectableOption } from './EditableOptionPicker';
import { InvoiceDatePicker } from './InvoiceDatePicker';

const INVOICE_STORAGE_KEY = 'invoiceData';

export function InvoiceGenerator() {
  const [data, setData] = useState<InvoiceFormState>(() => createDefaultInvoiceState());
  const [isHydrated, setIsHydrated] = useState(false);

  const recipientsQuery = useInvoiceRecipients();
  const templatesQuery = useInvoiceItemTemplates();

  useEffect(() => {
    let active = true;
    get<unknown>(INVOICE_STORAGE_KEY)
      .then((val) => {
        if (!active) return;
        const normalized = normalizeStoredInvoiceState(val);
        if (normalized) setData(normalized);
      })
      .finally(() => {
        if (active) setIsHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    set(INVOICE_STORAGE_KEY, data);
  }, [data, isHydrated]);

  const recipientOptions: SelectableOption[] = useMemo(
    () =>
      (recipientsQuery.data ?? []).map((recipient) => ({
        id: recipient.id,
        label: recipient.name,
      })),
    [recipientsQuery.data],
  );

  const itemTemplateOptions: SelectableOption[] = useMemo(
    () =>
      (templatesQuery.data ?? []).map((template) => ({
        id: template.id,
        label: template.description,
      })),
    [templatesQuery.data],
  );

  const formattedTanggal = useMemo(
    () => formatIndonesianLongDate(data.tanggalIso),
    [data.tanggalIso],
  );

  const formattedNoInvoiceDate = useMemo(
    () => formatShortSlashDate(data.noInvoiceDateIso),
    [data.noInvoiceDateIso],
  );

  const combinedNoInvoice = useMemo(
    () => formatInvoiceNumber(data.noInvoiceCode, data.noInvoiceDateIso),
    [data.noInvoiceCode, data.noInvoiceDateIso],
  );

  const subTotal = useMemo(
    () => data.items.reduce((sum, item) => sum + item.harga * item.jml, 0),
    [data.items],
  );

  const taxSummary = useMemo(
    () => computeInvoiceTaxSummary(subTotal, data.taxes),
    [subTotal, data.taxes],
  );

  const handleKepadaChange = (value: string) => {
    setData((prev) => ({ ...prev, kepada: value }));
  };

  const handleTanggalChange = (iso: string) => {
    setData((prev) => ({
      ...prev,
      tanggalIso: iso,
      noInvoiceDateIso: prev.hasCustomNoInvoiceDate ? prev.noInvoiceDateIso : iso,
    }));
  };

  const handleNoInvoiceCodeChange = (value: string) => {
    setData((prev) => ({ ...prev, noInvoiceCode: value }));
  };

  const handleNoInvoiceDateChange = (iso: string) => {
    setData((prev) => ({
      ...prev,
      noInvoiceDateIso: iso,
      hasCustomNoInvoiceDate: iso !== prev.tanggalIso,
    }));
  };

  const handleResetNoInvoiceDateSync = () => {
    setData((prev) => ({
      ...prev,
      noInvoiceDateIso: prev.tanggalIso,
      hasCustomNoInvoiceDate: false,
    }));
  };

  const handleAddItem = () => {
    setData((prev) => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), keterangan: '', harga: 0, jml: 1 }],
    }));
  };

  const handleRemoveItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const handleNumericItemChange = (id: string, field: 'harga' | 'jml', rawValue: string) => {
    const digitsOnly = rawValue.replace(/\D/g, '');
    handleItemChange(id, field, digitsOnly ? Number(digitsOnly) : 0);
  };

  const handleAddTax = () => {
    const newTax: InvoiceTaxItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: '',
      rateInput: '',
    };
    setData((prev) => ({
      ...prev,
      taxes: [...prev.taxes, newTax],
    }));
  };

  const handleRemoveTax = (id: string) => {
    setData((prev) => ({
      ...prev,
      taxes: prev.taxes.filter((tax) => tax.id !== id),
    }));
  };

  const handleTaxNameChange = (id: string, value: string) => {
    setData((prev) => ({
      ...prev,
      taxes: prev.taxes.map((tax) => (tax.id === id ? { ...tax, name: value } : tax)),
    }));
  };

  const handleTaxRateChange = (id: string, rawValue: string) => {
    const sanitized = sanitizeTaxRateInput(rawValue);
    setData((prev) => ({
      ...prev,
      taxes: prev.taxes.map((tax) => (tax.id === id ? { ...tax, rateInput: sanitized } : tax)),
    }));
  };

  const handleDownloadPdf = () => {
    generatePdf(
      {
        kepada: data.kepada,
        tanggal: formattedTanggal,
        noInvoice: combinedNoInvoice,
        items: data.items,
        taxes: taxSummary.activeTaxes.map((tax) => ({
          detailLabel: tax.detailLabel,
          amount: tax.amount,
        })),
      },
      subTotal,
      taxSummary.grandTotal,
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <CardTitle>Form Invoice</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="invoice-kepada" className="font-semibold text-sm">
              KEPADA
            </label>
            <EditableOptionPicker
              id="invoice-kepada"
              value={data.kepada}
              onChange={handleKepadaChange}
              options={recipientOptions}
              placeholder="Ketik atau pilih penerima (contoh: Jogja Lodge)"
              searchPlaceholder="Cari penerima..."
              emptyText="Belum ada opsi KEPADA di database."
              groupHeading="Daftar Penerima"
              pickerLabel="Pilih KEPADA dari database"
              isLoading={recipientsQuery.isLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="invoice-tanggal" className="font-semibold text-sm">
              TANGGAL
            </label>
            <InvoiceDatePicker
              id="invoice-tanggal"
              valueIso={data.tanggalIso}
              onChangeIso={handleTanggalChange}
              displayLabel={formattedTanggal}
              placeholder="Pilih tanggal invoice..."
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="invoice-number-code" className="font-semibold text-sm">
                NO INVOICE
              </label>
              {data.hasCustomNoInvoiceDate ? (
                <button
                  type="button"
                  onClick={handleResetNoInvoiceDateSync}
                  className="inline-flex items-center gap-1 font-medium text-[#1b3b2c] text-xs hover:underline"
                >
                  <RotateCcw className="size-3" />
                  Samakan dengan TANGGAL
                </button>
              ) : null}
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_200px_minmax(0,1fr)]">
              <Input
                id="invoice-number-code"
                placeholder="Nomor / kode (contoh: 138BRG)"
                value={data.noInvoiceCode}
                onChange={(e) => handleNoInvoiceCodeChange(e.target.value)}
                className="h-9"
              />
              <InvoiceDatePicker
                id="invoice-number-date"
                valueIso={data.noInvoiceDateIso}
                onChangeIso={handleNoInvoiceDateChange}
                displayLabel={formattedNoInvoiceDate}
                placeholder="Pilih tanggal"
              />
              <div className="flex h-9 items-center justify-between gap-2 rounded-lg border bg-slate-50 px-3 text-sm">
                <span className="shrink-0 font-medium text-slate-500 text-xs">Preview:</span>
                <span
                  className={
                    data.noInvoiceCode.trim()
                      ? 'truncate font-semibold text-[#1b3b2c]'
                      : 'truncate text-muted-foreground'
                  }
                >
                  {data.noInvoiceCode.trim()
                    ? combinedNoInvoice
                    : `Contoh: 138BRG ${formattedNoInvoiceDate}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold text-sm">ITEM INVOICE</span>
            <Button size="sm" variant="ghost" onClick={handleAddItem}>
              <Plus className="mr-1 h-4 w-4" /> Tambah Item
            </Button>
          </div>
          <div className="overflow-hidden overflow-x-auto rounded-md border">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left">KETERANGAN</th>
                  <th className="w-[140px] p-3 text-right">HARGA (Rp)</th>
                  <th className="w-[90px] p-3 text-right">JML</th>
                  <th className="w-[140px] p-3 text-right">TOTAL</th>
                  <th className="w-[48px] p-3 text-center" />
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} className="border-t align-top">
                    <td className="p-2">
                      <EditableOptionPicker
                        value={item.keterangan}
                        onChange={(val) => handleItemChange(item.id, 'keterangan', val)}
                        options={itemTemplateOptions}
                        placeholder="Ketik atau pilih deskripsi item..."
                        searchPlaceholder="Cari deskripsi item..."
                        emptyText="Belum ada deskripsi item di database."
                        groupHeading="Template Deskripsi Item"
                        pickerLabel="Pilih deskripsi item dari database"
                        isLoading={templatesQuery.isLoading}
                        multiline
                        popoverWidthClassName="w-[420px] max-w-[90vw]"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        className="h-9 text-right"
                        value={item.harga === 0 ? '' : String(item.harga)}
                        onChange={(e) => handleNumericItemChange(item.id, 'harga', e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="1"
                        className="h-9 text-right"
                        value={item.jml === 0 ? '' : String(item.jml)}
                        onChange={(e) => handleNumericItemChange(item.id, 'jml', e.target.value)}
                      />
                    </td>
                    <td className="p-3 pt-4 text-right font-medium">
                      {(item.harga * item.jml).toLocaleString('id-ID')}
                    </td>
                    <td className="p-2 pt-2.5 text-center">
                      {data.items.length > 1 ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-sm">PAJAK (POTONGAN)</span>
              <Button size="sm" variant="ghost" onClick={handleAddTax}>
                <Plus className="mr-1 h-4 w-4" /> Tambah Pajak
              </Button>
            </div>
            {data.taxes.length === 0 ? (
              <div className="rounded-md border border-dashed px-4 py-3 text-slate-500 text-xs">
                Belum ada potongan pajak. Klik &ldquo;Tambah Pajak&rdquo; jika ingin menambahkan
                potongan (contoh: POT PPh 2,5%).
              </div>
            ) : (
              <div className="overflow-hidden overflow-x-auto rounded-md border">
                <table className="w-full min-w-[540px] text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left">NAMA PAJAK</th>
                      <th className="w-[150px] p-3 text-right">PERSENTASE</th>
                      <th className="w-[170px] p-3 text-right">POTONGAN</th>
                      <th className="w-[48px] p-3 text-center" />
                    </tr>
                  </thead>
                  <tbody>
                    {data.taxes.map((tax, index) => {
                      const computed = taxSummary.computedTaxes[index];
                      const amount = computed?.amount ?? 0;
                      const rate = computed?.rate ?? 0;
                      return (
                        <tr key={tax.id} className="border-t align-middle">
                          <td className="p-2">
                            <Input
                              type="text"
                              placeholder="Contoh: POT PPh"
                              className="h-9"
                              value={tax.name}
                              onChange={(e) => handleTaxNameChange(tax.id, e.target.value)}
                            />
                          </td>
                          <td className="p-2">
                            <div className="relative flex items-center">
                              <Input
                                type="text"
                                inputMode="decimal"
                                placeholder="0"
                                className="h-9 pr-7 text-right"
                                value={tax.rateInput}
                                onChange={(e) => handleTaxRateChange(tax.id, e.target.value)}
                              />
                              <span className="pointer-events-none absolute right-2.5 text-slate-500 text-xs">
                                %
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-right font-medium text-slate-700">
                            {rate > 0 ? `- ${formatInvoiceRp(amount)}` : '-'}
                          </td>
                          <td className="p-2 text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Hapus pajak"
                              className="text-red-500 hover:bg-red-50 hover:text-red-700"
                              onClick={() => handleRemoveTax(tax.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col items-end gap-2 text-sm">
            <div className="flex w-full max-w-md justify-between gap-4 p-2">
              <span className="shrink-0 font-semibold text-slate-500">SUB TOTAL :</span>
              <span className="font-semibold">{formatInvoiceRp(subTotal)}</span>
            </div>
            <div className="flex w-full max-w-md items-start justify-between gap-4 p-2">
              <span className="shrink-0 font-semibold text-slate-500">PAJAK :</span>
              {taxSummary.activeTaxes.length === 0 ? (
                <span className="font-semibold">-</span>
              ) : (
                <div className="flex flex-col items-end gap-1 text-right font-semibold">
                  {taxSummary.activeTaxes.map((tax) => (
                    <span key={tax.id}>{tax.detailLabel}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex w-full max-w-md justify-between gap-4 rounded-md bg-slate-50 p-2 text-lg">
              <span className="shrink-0 font-bold">TOTAL :</span>
              <span className="font-bold">{formatInvoiceRp(taxSummary.grandTotal)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end px-6 pt-4 pb-6">
        <Button
          size="lg"
          className="w-full bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90 sm:w-auto"
          onClick={handleDownloadPdf}
        >
          <Download className="mr-2 h-5 w-5" /> Download PDF
        </Button>
      </CardFooter>
    </Card>
  );
}
