import React from 'react';

export interface ValidationError {
  row: number;
  col: string;
  message: string;
}

type Props = {
  rowData: Record<string, any>[];
  onCellEdit: (rowIndex: number, field: string, value: any) => void;
  validationErrors: ValidationError[];
};

export default function DataGrid({
  rowData,
  onCellEdit,
  validationErrors,
}: Props) {
  if (!rowData.length) return null;
  const cols = Object.keys(rowData[0]);

  return (
    <table
      style={{
        borderCollapse: 'collapse',
        width: '100%',
        marginTop: 10,
        backgroundColor: 'white',
      }}
    >
      <thead>
        <tr>
          {cols.map((c) => (
            <th
              key={c}
              style={{
                border: '1px solid #ccc',
                padding: 6,
                background: '#eee',
                textTransform: 'capitalize',
                color: 'black',
              }}
            >
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rowData.map((row, i) => (
          <tr key={i}>
            {cols.map((c) => {
              const errs = validationErrors.filter(
                (e) => e.row === i && e.col === c
              );
              return (
                <td
                  key={c}
                  style={{
                    border: '1px solid #ccc',
                    padding: 0,
                    background: errs.length ? '#ffe6e6' : 'white',
                  }}
                >
                  <input
                    style={{
                      width: '100%',
                      border: 'none',
                      padding: 6,
                      backgroundColor: 'white',
                      color: 'black',
                      fontFamily: 'inherit',
                    }}
                    value={row[c] ?? ''}
                    onChange={(e) => onCellEdit(i, c, e.target.value)}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
