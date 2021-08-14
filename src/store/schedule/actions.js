import SchedulesApi from '../../api/schedule';

const schedulesApi = new SchedulesApi();

export async function getUserSchedules(_, params = {}) {
  const response = await schedulesApi.getSchedules(params);
  return response;
}

export async function postDirectSchedule(_, payload) {
  const response = await schedulesApi.postDirectSchedule(payload);
  return response;
}

export async function updateSchedule(_, payload) {
  const response = await schedulesApi.updateSchedule(payload.id, {
    ...payload,
    id: undefined,
  });
  return response;
}

export async function cancelSchedule(_, payload) {
  const response = await schedulesApi.cancelSchedule(payload);
  return response;
}
