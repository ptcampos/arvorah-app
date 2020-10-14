import CycleApi from '../../api/cycle';

const cycleApi = new CycleApi();

export async function create(_, payload) {
  const cycle = await cycleApi.create(payload);
  return cycle;
}

export async function getUserCycle() {
  const cycle = await cycleApi.getUserCycle().then(r => r.result);
  return cycle;
}
