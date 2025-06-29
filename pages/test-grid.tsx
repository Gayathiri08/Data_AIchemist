// pages/test-grid.tsx
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';

// 1) Define the row-data type
interface Car {
  make: string;
  model: string;
  price: number;
}

export default function TestGrid() {
  // 2) Provide typed row data
  const rowData: Car[] = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford',   model: 'Mondeo', price: 32000 },
    { make: 'Porsche',model: 'Boxter', price: 72000 },
  ];

  // 3) Define your columns as ColDef<Car>[]
  const columnDefs: ColDef<Car>[] = [
    { field: 'make',  headerName: 'Make'  },
    { field: 'model', headerName: 'Model' },
    { field: 'price', headerName: 'Price' },
  ];

  return (
    <div style={{ margin: 20 }}>
      <h1>AG Grid Smoke Test</h1>
      <div
        className="ag-theme-alpine"
        style={{ height: 300, width: '100%', border: '1px solid #999' }}
      >
        <AgGridReact<Car>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ resizable: true, flex: 1 }}
        />
      </div>
    </div>
  );
}
