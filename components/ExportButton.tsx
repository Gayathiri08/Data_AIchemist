import React from 'react';

type Props = {
  clients: any[];
  workers: any[];
  tasks: any[];
  rules: any[];
  weights: Record<string, number>;
};

export default function ExportButton({
  clients,
  workers,
  tasks,
  rules,
  weights,
}: Props) {
  const download = () => {
    const toCSV = (arr: any[]) => {
      if (!arr.length) return '';
      const headers = Object.keys(arr[0]);
      const rows = arr.map((r) =>
        headers.map((h) => `"${String(r[h] ?? '')}"`).join(',')
      );
      return [headers.join(','), ...rows].join('\n');
    };

    const blob = new Blob(
      [
        '--- clients.csv ---\n',
        toCSV(clients),
        '\n\n--- workers.csv ---\n',
        toCSV(workers),
        '\n\n--- tasks.csv ---\n',
        toCSV(tasks),
        '\n\n--- rules.json ---\n',
        JSON.stringify(rules, null, 2),
        '\n\n--- weights.json ---\n',
        JSON.stringify(weights, null, 2),
      ],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export_package.txt';
    a.click();
  };

  return (
    <button onClick={download} style={{ marginTop: 30 }}>
      Export Cleaned Data & Rules
    </button>
  );
}
