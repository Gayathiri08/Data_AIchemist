// pages/index.tsx
import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import DataGrid, { ValidationError } from '../components/DataGrid';
import RuleBuilder, { Rule } from '../components/RuleBuilder';
import RuleList from '../components/RuleList';
import PrioritySlider from '../components/PrioritySlider';
import ExportButton from '../components/ExportButton';
import {
  validateMissingColumns,
  validateDuplicateIDs,
  validateListField,
  validateRange,
  validateJSONField,
  validateUnknownReferences,
  validateOverloadedWorkers,
  validateSkillCoverage,
} from '../lib/validation';

type Entity = 'clients' | 'workers' | 'tasks';

export default function Home() {
  // Milestone 1 State
  const [clients, setClients] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  // Milestone 2 State
  const [rules, setRules] = useState<Rule[]>([]);
  const [weights, setWeights] = useState({ priority: 0.5, fairness: 0.5 });

  // Milestone 3 State (AI NL filter)
  const [nlFilter, setNlFilter] = useState('');
  const [filterFn, setFilterFn] = useState<(row: any) => boolean>(() => () => true);

  // --- Handle File Upload ---
  const handleDataLoad = (data: any[], entity: Entity) => {
    if (entity === 'clients') setClients(data);
    if (entity === 'workers') setWorkers(data);
    if (entity === 'tasks') setTasks(data);
    runValidations();
    suggestRules({ clients, workers, tasks });
  };

  // --- Handle Inline Cell Edit ---
  const handleCellEdit = (entity: Entity, rowIndex: number, field: string, value: any) => {
    const map = { clients: setClients, workers: setWorkers, tasks: setTasks };
    map[entity]((prev) => {
      const copy = [...prev];
      copy[rowIndex] = { ...copy[rowIndex], [field]: value };
      return copy;
    });
    setTimeout(runValidations, 0);
  };

  // --- Run Validations ---
  const runValidations = () => {
    const errs: ValidationError[] = [];

    // Clients
    errs.push(...validateMissingColumns(clients, [
      'ClientID','ClientName','PriorityLevel','RequestedTaskIDs','GroupTag','AttributesJSON'
    ]));
    errs.push(...validateDuplicateIDs(clients, 'ClientID'));
    errs.push(...validateListField(clients, 'RequestedTaskIDs'));
    errs.push(...validateRange(clients, 'PriorityLevel', 1, 5));
    errs.push(...validateJSONField(clients, 'AttributesJSON'));
    errs.push(...validateUnknownReferences(clients, tasks));

    // Workers
    errs.push(...validateMissingColumns(workers, [
      'WorkerID','WorkerName','Skills','AvailableSlots','MaxLoadPerPhase','WorkerGroup','QualificationLevel'
    ]));
    errs.push(...validateDuplicateIDs(workers, 'WorkerID'));
    errs.push(...validateListField(workers, 'AvailableSlots'));
    errs.push(...validateRange(workers, 'MaxLoadPerPhase', 1, Infinity));
    errs.push(...validateOverloadedWorkers(workers));

    // Tasks
    errs.push(...validateMissingColumns(tasks, [
      'TaskID','TaskName','Category','Duration','RequiredSkills','PreferredPhases','MaxConcurrent'
    ]));
    errs.push(...validateDuplicateIDs(tasks, 'TaskID'));
    errs.push(...validateRange(tasks, 'Duration', 1, Infinity));
    errs.push(...validateRange(tasks, 'MaxConcurrent', 1, Infinity));
    errs.push(...validateListField(tasks, 'RequiredSkills'));
    errs.push(...validateListField(tasks, 'PreferredPhases'));
    errs.push(...validateSkillCoverage(tasks, workers));

    setErrors(errs);
  };

  // --- AI Natural Language Filter ---
  async function applyNLFilter() {
    const res = await fetch('/api/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: nlFilter }),
    });

    const { generated_text } = await res.json();
    const expr = generated_text.trim();

    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function('row', `return (${expr})`) as (row: any) => boolean;
      setFilterFn(() => fn);
    } catch (err) {
      console.error('Error parsing AI filter expression:', err);
    }
  }

  // --- AI Rule Recommendations ---
  async function suggestRules(dataSets: { clients: any[]; workers: any[]; tasks: any[] }) {
    const prompt = `
Here are tasks:
${JSON.stringify(dataSets.tasks, null, 2)}
Suggest coRun rules as JSON array like:
[{ "type":"coRun", "tasks":["T1", "T2"] }]`;

    const res = await fetch('/api/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const { generated_text } = await res.json();
    try {
      const recs: Rule[] = JSON.parse(generated_text);
      recs.forEach(addRule);
    } catch {
      console.error('Failed to parse AI-suggested rules');
    }
  }

  // --- Rule Handlers ---
  const addRule = (r: Rule) => setRules((rs) => [...rs, r]);
  const removeRule = (i: number) => setRules((rs) => rs.filter((_, j) => j !== i));

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', background: 'white' }}>
      <h1>Data Alchemist – All Milestones</h1>

      {/* M1: Upload */}
      <FileUploader onDataLoaded={handleDataLoad} />

      {/* M3: NL Filter */}
      <div style={{ marginTop: 20 }}>
        <h3>🔍 Natural-Language Filter (applies to all entities)</h3>
        <input
          style={{ width: '60%' }}
          placeholder='e.g. "Duration > 1 and PreferredPhases includes 2"'
          value={nlFilter}
          onChange={(e) => setNlFilter(e.target.value)}
        />
        <button onClick={applyNLFilter} style={{ marginLeft: 10 }}>
          Apply Filter
        </button>
      </div>

      {/* M1: Grids */}
      <section style={{ marginTop: 20 }}>
        <h2>Clients</h2>
        <DataGrid
          rowData={clients.filter(filterFn)}
          onCellEdit={(i, f, v) => handleCellEdit('clients', i, f, v)}
          validationErrors={errors.filter((e) =>
            ['ClientID', 'RequestedTaskIDs', 'PriorityLevel', 'AttributesJSON'].includes(e.col)
          )}
           

        />
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Workers</h2>
        <DataGrid
          rowData={workers.filter(filterFn)}
          onCellEdit={(i, f, v) => handleCellEdit('workers', i, f, v)}
          validationErrors={errors.filter((e) =>
            ['WorkerID', 'AvailableSlots'].includes(e.col)
          )}
        />
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>Tasks</h2>
        <DataGrid
          rowData={tasks.filter(filterFn)}
          onCellEdit={(i, f, v) => handleCellEdit('tasks', i, f, v)}
          validationErrors={errors.filter((e) =>
            ['TaskID', 'Duration', 'MaxConcurrent', 'RequiredSkills', 'PreferredPhases'].includes(e.col)
          )}
        />
      </section>

      {/* M2: Rules + Prioritization */}
      <div style={{ marginTop: 40, borderTop: '1px solid #ddd', paddingTop: 20 }}>
        <h2>Business Rules</h2>
        <RuleBuilder tasks={tasks} workers={workers} onAddRule={addRule} />
        <RuleList rules={rules} onRemove={removeRule} />

        <h2>Prioritization</h2>
        <PrioritySlider
          label="Priority vs Fairness"
          value={weights.priority}
          onChange={(v) => setWeights((w) => ({ ...w, priority: v }))}
        />
        <PrioritySlider
          label="Efficiency vs Cost"
          value={weights.fairness}
          onChange={(v) => setWeights((w) => ({ ...w, fairness: v }))}
        />

        <ExportButton
          clients={clients}
          workers={workers}
          tasks={tasks}
          rules={rules}
          weights={weights}
        />
      </div>
    </div>
  );
}
