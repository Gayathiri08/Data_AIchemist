import React, { useState } from 'react';

// Rule type
export type Rule = {
  type: string;
  tasks?: string[];
  [key: string]: any;
};

type Props = {
  tasks: any[];
  workers: any[];  // ✅ Add this line to fix the error
  onAddRule: (r: Rule) => void;
};

export default function RuleBuilder({ tasks, workers, onAddRule }: Props) {
  // Co-run rule state
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const addCoRun = () => {
    if (selectedTasks.length < 2) return;
    onAddRule({ type: 'coRun', tasks: selectedTasks });
    setSelectedTasks([]);
  };

  // Slot-restriction rule state
  const [minSlots, setMinSlots] = useState(1);

  // Load-limit rule state
  const [group, setGroup] = useState('');
  const [maxSlots, setMaxSlots] = useState(1);

  // Phase-window rule state
  const [taskId, setTaskId] = useState('');
  const [phases, setPhases] = useState('');

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Co-Run Rule</h3>
      <select
        multiple
        value={selectedTasks}
        onChange={(e) =>
          setSelectedTasks(Array.from(e.target.selectedOptions, (o) => o.value))
        }
        style={{ width: 200, height: 100 }}
      >
        {tasks.map((t: any) => (
          <option key={t.TaskID} value={t.TaskID}>
            {t.TaskID}
          </option>
        ))}
      </select>
      <br />
      <button onClick={addCoRun}>Add Co-Run</button>

      <hr />
      <h3>Slot-Restriction Rule</h3>
      <label>
        Min Common Slots:{' '}
        <input
          type="number"
          min={1}
          value={minSlots}
          onChange={(e) => setMinSlots(Number(e.target.value))}
        />
      </label>
      <button
        onClick={() => onAddRule({ type: 'slotRestriction', minCommonSlots: minSlots })}
        style={{ marginLeft: 10 }}
      >
        Add Slot Restriction
      </button>

      <hr />
      <h3>Load-Limit Rule</h3>
      <label>
        Worker Group:{' '}
        <select value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="">Select group</option>
          {[...new Set(workers.map((w) => w.WorkerGroup))].map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Max Slots per Phase:{' '}
        <input
          type="number"
          min={1}
          value={maxSlots}
          onChange={(e) => setMaxSlots(Number(e.target.value))}
        />
      </label>
      <button
        onClick={() =>
          group && onAddRule({ type: 'loadLimit', group, maxSlotsPerPhase: maxSlots })
        }
        style={{ marginLeft: 10 }}
      >
        Add Load Limit
      </button>

      <hr />
      <h3>Phase-Window Rule</h3>
      <label>
        Task:{' '}
        <select value={taskId} onChange={(e) => setTaskId(e.target.value)}>
          <option value="">Select Task</option>
          {tasks.map((t) => (
            <option key={t.TaskID} value={t.TaskID}>
              {t.TaskID}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Allowed Phases:{' '}
        <input
          placeholder="e.g. 1-3 or 2,4,5"
          value={phases}
          onChange={(e) => setPhases(e.target.value)}
        />
      </label>
      <button
        onClick={() =>
          taskId &&
          phases &&
          onAddRule({ type: 'phaseWindow', task: taskId, allowedPhases: phases })
        }
        style={{ marginLeft: 10 }}
      >
        Add Phase Window
      </button>
    </div>
  );
}
