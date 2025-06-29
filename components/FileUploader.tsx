import React from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

type Props = {
  onDataLoaded: (data: any[], entity: 'clients' | 'workers' | 'tasks') => void;
};

export default function FileUploader({ onDataLoaded }: Props) {
  const load = (file: File, entity: 'clients' | 'workers' | 'tasks') => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (r) => onDataLoaded(r.data, entity),
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target!.result as ArrayBuffer, { type: 'array' });
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        onDataLoaded(data, entity);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <label>
        Clients CSV/XLSX:{' '}
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) =>
            e.target.files?.[0] && load(e.target.files[0], 'clients')
          }
        />
      </label>
      <br />
      <label>
        Workers CSV/XLSX:{' '}
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) =>
            e.target.files?.[0] && load(e.target.files[0], 'workers')
          }
        />
      </label>
      <br />
      <label>
        Tasks CSV/XLSX:{' '}
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) =>
            e.target.files?.[0] && load(e.target.files[0], 'tasks')
          }
        />
      </label>
    </div>
  );
}
