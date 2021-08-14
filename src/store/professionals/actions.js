import ProfessionalsApi from '../../api/professionals';

const professionalsApi = new ProfessionalsApi();

export async function getAreas() {
  const response = await professionalsApi.getAreas();
  return response;
}

export async function getProfessionalConferenceUrl(_, professionalUserId) {
  const response = await professionalsApi
    .getProfessionalConferenceUrl(professionalUserId)
    .then(r => r.result);
  return response;
}
