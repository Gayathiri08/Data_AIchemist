export interface ValidationError {
  row: number;
  col: string;
  message: string;
}

export function validateMissingColumns(
  data: any[],
  required: string[]
): ValidationError[] {
  if (!data.length) return [];
  return required
    .filter((col) => !(col in data[0]))
    .map((col) => ({
      row: 0,
      col,
      message: `Missing required column "${col}"`,
    }));
}

export function validateDuplicateIDs(
  data: any[],
  idField: string
): ValidationError[] {
  const seen = new Set<string>();
  const errors: ValidationError[] = [];
  data.forEach((r, i) => {
    const id = String(r[idField] ?? '');
    if (!id) {
      errors.push({ row: i, col: idField, message: 'Empty ID' });
    } else if (seen.has(id)) {
      errors.push({ row: i, col: idField, message: `Duplicate ID "${id}"` });
    } else {
      seen.add(id);
    }
  });
  return errors;
}

export function validateListField(
  data: any[],
  field: string
): ValidationError[] {
  const errors: ValidationError[] = [];
  data.forEach((r, i) => {
    const val = String(r[field] ?? '').trim();
    if (!val) return;
    val.split(',').forEach((item) => {
      if (isNaN(Number(item))) {
        errors.push({
          row: i,
          col: field,
          message: `Non-numeric list item "${item}"`,
        });
      }
    });
  });
  return errors;
}

export function validateRange(
  data: any[],
  field: string,
  min: number,
  max: number
): ValidationError[] {
  const errors: ValidationError[] = [];
  data.forEach((r, i) => {
    const num = Number(r[field]);
    if (isNaN(num) || num < min || num > max) {
      errors.push({
        row: i,
        col: field,
        message: `${field} must be between ${min} and ${max}`,
      });
    }
  });
  return errors;
}

export function validateJSONField(
  data: any[],
  field: string
): ValidationError[] {
  const errors: ValidationError[] = [];
  data.forEach((r, i) => {
    try {
      JSON.parse(r[field]);
    } catch {
      errors.push({
        row: i,
        col: field,
        message: `Invalid JSON in "${field}"`,
      });
    }
  });
  return errors;
}

export function validateUnknownReferences(
  clients: any[],
  tasks: any[]
): ValidationError[] {
  const validIDs = new Set(tasks.map((t) => String(t.TaskID)));
  const errs: ValidationError[] = [];
  clients.forEach((c, i) => {
    (String(c.RequestedTaskIDs) || '')
      .split(',')
      .map((s) => s.trim())
      .forEach((tid) => {
        if (tid && !validIDs.has(tid)) {
          errs.push({
            row: i,
            col: 'RequestedTaskIDs',
            message: `Unknown TaskID "${tid}"`,
          });
        }
      });
  });
  return errs;
}

export function validateOverloadedWorkers(workers: any[]): ValidationError[] {
  const errs: ValidationError[] = [];
  workers.forEach((w, i) => {
    let slots: any[] = [];
    try {
      slots = Array.isArray(w.AvailableSlots)
        ? w.AvailableSlots
        : JSON.parse(w.AvailableSlots || '[]');
    } catch {}
    if (slots.length < Number(w.MaxLoadPerPhase)) {
      errs.push({
        row: i,
        col: 'AvailableSlots',
        message: `Only ${slots.length} slots < MaxLoadPerPhase ${w.MaxLoadPerPhase}`,
      });
    }
  });
  return errs;
}

export function validateSkillCoverage(
  tasks: any[],
  workers: any[]
): ValidationError[] {
  const workerSkills = new Set(
    workers.flatMap((w) =>
      String(w.Skills).split(',').map((s) => s.trim())
    )
  );
  const errs: ValidationError[] = [];
  tasks.forEach((t, i) => {
    (String(t.RequiredSkills) || '')
      .split(',')
      .map((s) => s.trim())
      .forEach((skill) => {
        if (skill && !workerSkills.has(skill)) {
          errs.push({
            row: i,
            col: 'RequiredSkills',
            message: `No worker has skill "${skill}"`,
          });
        }
      });
  });
  return errs;
}
