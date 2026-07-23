import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Download } from 'lucide-react';
import { get, set } from 'idb-keyval';
import { generatePdf } from '../utils/generatePdf';

export interface InvoiceItem {
  id: string;
  keterangan: string;
  harga: number;
  jml: number;
}

export interface InvoiceData {
  kepada: string;
  tanggal: string;
  noInvoice: string;
  items: InvoiceItem[];
}

export function InvoiceGenerator() {
  const [data, setData] = useState<InvoiceData>({
    kepada: '',
    tanggal: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    noInvoice: '',
    items: [{ id: Date.now().toString(), keterangan: '', harga: 0, jml: 1 }],
  });

  useEffect(() => {
    get<InvoiceData>('invoiceData').then((val) => {
      if (val) setData(val);
    });
  }, []);

  useEffect(() => {
    set('invoiceData', data);
  }, [data]);

  const handleUpdateField = (field: keyof InvoiceData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
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
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const subTotal = data.items.reduce((sum, item) => sum + item.harga * item.jml, 0);



  const handleDownloadPdf = () => {
    generatePdf(data, subTotal);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle>Form Invoice</CardTitle>

      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">KEPADA</label>
            <Input
              placeholder="Contoh: HAUFF"
              value={data.kepada}
              onChange={(e) => handleUpdateField('kepada', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">TANGGAL</label>
            <Input
              placeholder="Contoh: Kamis, 11 April 2026"
              value={data.tanggal}
              onChange={(e) => handleUpdateField('tanggal', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">NO INVOICE</label>
            <Input
              placeholder="Contoh: 138BRG 11/04/2026"
              value={data.noInvoice}
              onChange={(e) => handleUpdateField('noInvoice', e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold">ITEM INVOICE</label>
            <Button size="sm" variant="ghost" onClick={handleAddItem}>
              <Plus className="mr-1 h-4 w-4" /> Tambah Item
            </Button>
          </div>
          <div className="border rounded-md overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left">KETERANGAN</th>
                  <th className="p-3 text-right w-[150px]">HARGA (Rp)</th>
                  <th className="p-3 text-right w-[100px]">JML</th>
                  <th className="p-3 text-right w-[150px]">TOTAL</th>
                  <th className="p-3 text-center w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">
                      <Input
                        value={item.keterangan}
                        onChange={(e) => handleItemChange(item.id, 'keterangan', e.target.value)}
                        placeholder="Deskripsi item..."
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        className="text-right"
                        value={item.harga}
                        onChange={(e) => handleItemChange(item.id, 'harga', Number(e.target.value))}
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        className="text-right"
                        value={item.jml}
                        onChange={(e) => handleItemChange(item.id, 'jml', Number(e.target.value))}
                      />
                    </td>
                    <td className="p-3 text-right font-medium">
                      {(item.harga * item.jml).toLocaleString('id-ID')}
                    </td>
                    <td className="p-2 text-center">
                      {data.items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-end gap-2 mt-4 text-sm">
            <div className="flex justify-between w-64 p-2">
              <span className="font-semibold text-slate-500">SUB TOTAL :</span>
              <span className="font-semibold">RP {subTotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between w-64 p-2">
              <span className="font-semibold text-slate-500">PAJAK :</span>
              <span className="font-semibold">-</span>
            </div>
            <div className="flex justify-between w-64 p-2 bg-slate-50 rounded-md text-lg">
              <span className="font-bold">TOTAL :</span>
              <span className="font-bold">RP {subTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-4 pb-6 px-6">
        <Button size="lg" className="bg-[#1b3b2c] text-white hover:bg-[#1b3b2c]/90 w-full sm:w-auto" onClick={handleDownloadPdf}>
          <Download className="mr-2 h-5 w-5" /> Download PDF
        </Button>
      </CardFooter>
    </Card>
  );
}
