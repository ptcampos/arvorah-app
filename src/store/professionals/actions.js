import ProfessionalsApi from '../../api/professionals';

const professionalsApi = new ProfessionalsApi();

export async function getAreas() {
  const response = await professionalsApi.getAreas();
  return response;
}
