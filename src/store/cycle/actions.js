import CycleApi from '../../api/cycle';
import CyclePainApi from '../../api/cyclePains';

const cycleApi = new CycleApi();
const cyclePainsApi = new CyclePainApi();

export async function create(_, payload) {
  const cycle = await cycleApi.create(payload);
  return cycle;
}

export async function getUserCycle() {
  const cycle = await cycleApi.getUserCycle().then(r => r.result);
  return cycle;
}

export async function getCycleCronogram(_, cycleId) {
  const cycleCronogram = await cycleApi.getCycleCronogram(cycleId).then(r => r.result);
  return cycleCronogram;
}

export async function getCyclePains(_, cycleId) {
  const cyclePains = await cyclePainsApi.findAll({ cycleId }).then(r => r.result);
  return cyclePains;
}

export async function saveInformativeContentOpenedDate(_, informativeContentId) {
  await cycleApi.saveInformativeContentOpenedDate(informativeContentId).then(r => r.result);
}

export async function saveInformativeContentRating(_, payload) {
  await cycleApi.saveInformativeContentRating(payload).then(r => r.result);
}

export async function setCurrentInformativeContent({ commit }, informativeContent) {
  commit('setCurrentInformativeContent', informativeContent);
}

export function getProfessionalCycleWithStatus(_, payload) {
  return cycleApi.getProfessionalCycleWithStatus(payload).then(r => r.result);
}

export function createAndOpenChatWithProfessionalInCycle(_, cycleId) {
  return cycleApi.createAndOpenChatWithProfessionalInCycle(cycleId).then(r => r.result);
}

export async function getChatMessages(_, chatCode) {
  return cycleApi.getChatMessages(chatCode).then(r => r.result);
}

export async function sendMessage(_, payload) {
  return cycleApi.sendMessage(payload).then(r => r.result);
}
