import InformativeContentApi from '../../api/informativeContent';

const informativeContentApi = new InformativeContentApi();

export async function listInformativeContent() {
  const informativeContent = await informativeContentApi.findAll();
  return informativeContent;
}

export async function getContentById(_, id) {
  const informativeContent = await informativeContentApi.findOne(id);
  return informativeContent;
}

export async function getCategoryBySlug(_, slug) {
  const category = await informativeContentApi.findCategoryBySlug(slug);
  return category;
}
