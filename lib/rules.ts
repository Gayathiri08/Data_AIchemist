export function buildCoRun(taskIds: string[]) {
  return { type: 'coRun', tasks: taskIds };
}
// TODO: more rule factories if needed
