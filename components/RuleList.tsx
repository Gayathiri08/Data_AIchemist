import React from 'react';

export type Rule = { type: string; [key: string]: any };

type Props = {
  rules: Rule[];
  onRemove: (index: number) => void;
};

export default function RuleList({ rules, onRemove }: Props) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Current Rules</h3>
      <ul>
        {rules.map((r, i) => (
          <li key={i} style={{ marginBottom: 5, color: 'white' }}>
            <code style={{ color: 'white' }}>{JSON.stringify(r)}</code>{' '}
            <button onClick={() => onRemove(i)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
