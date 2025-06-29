import React from 'react';

type Props = {
  label: string;
  value: number;
  onChange: (v: number) => void;
};

export default function PrioritySlider({ label, value, onChange }: Props) {
  return (
    <div style={{ marginTop: 20 }}>
      <label style={{ color: 'white' }}>
        {label}: {Math.round(value * 100)}%
      </label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: 200, marginLeft: 10 }}
      />
    </div>
  );
}
