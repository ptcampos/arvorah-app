import _ from 'lodash';
import moment from 'moment';

import { isValid as isValidCnpj, format as formatCnpj } from '@fnando/cnpj';
import { isValid as isValidCpf, format as formatCpf } from '@fnando/cpf';
import emailValidator from 'email-validator';

import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;

export const formatId = id => {
  return _.padStart(id, 7, '0');
};

export const corStatusProposta = status => {
  if (status === 'pendente') {
    return 'orange';
  }
  if (status === 'em_analise' || status === 'pendencias-analise') {
    return 'blue';
  }
  if (status === 'deferido') {
    return 'green';
  }
  if (status === 'indeferido') {
    return 'red';
  }
  if (status === 'desistente') {
    return 'purple';
  }
  if (status === 'em-andamento') {
    return 'green';
  }
  if (status === 'aprovado') {
    return 'green';
  }
  if (status === 'reprovado') {
    return 'red';
  }
  if (status === 'cadastro-socios') {
    return 'blue';
  }
  if (status === 'faturamento') {
    return 'purple';
  }
  if (status === 'informacoes-patrimoniais') {
    return 'cyan';
  }
  if (status === 'garantias') {
    return 'teal-9';
  }
  return 'black';
};

export const statusFormatadoProposta = status => {
  if (status === 'pendente') {
    return 'Aguardando Documentação';
  }
  if (status === 'em_analise' || status === 'pendencias-analise') {
    return 'Em Análise';
  }
  if (status === 'deferido') {
    return 'Aprovado';
  }
  if (status === 'indeferido') {
    return 'Não se enquadra na Política';
  }
  if (status === 'desistente') {
    return 'Desistente';
  }
  if (status === 'em-andamento') {
    return 'Em Andamento';
  }
  if (status === 'aprovado') {
    return 'Aprovado';
  }
  if (status === 'reprovado') {
    return 'Não se enquadra';
  }
  if (status === 'cadastro-socios') {
    return 'Cadastrando Sócios';
  }
  if (status === 'faturamento') {
    return 'Cadastrando Faturamento';
  }
  if (status === 'informacoes-patrimoniais') {
    return 'Informações Patrimoniais';
  }
  if (status === 'garantias') {
    return 'Adicionando as Garantias';
  }
  return 'N/A';
};

export const statusFormatadoPropostaEmAndamento = status => {
  if (status === 'pendente') {
    return 'Aguardando Análise';
  }
  if (status === 'pendencias-analise') {
    return 'Com Pendências para Análise';
  }
  if (status === 'em_analise') {
    return 'Em Análise';
  }
  if (status === 'deferido') {
    return 'Aprovado';
  }
  if (status === 'indeferido') {
    return 'Não se enquadra na Política';
  }
  if (status === 'desistente') {
    return 'Desistente';
  }
  return 'N/A';
};

export const corStatusDocumento = status => {
  if (status === 'pendente') {
    return 'orange';
  }
  if (status === 'adicionado') {
    return 'green';
  }
  return 'black';
};

export const statusFormatadoDocumento = status => {
  if (status === 'pendente') {
    return 'Pendente';
  }
  if (status === 'adicionado') {
    return 'Adicionado';
  }
  return 'N/A';
};

export const tipoGarantiaFormatada = tipo => {
  switch (tipo) {
    case 'aval':
      return 'Avalista';
    case 'fianca':
      return 'Fiança';
    case 'veiculo':
      return 'Veículo';
    case 'imovel':
      return 'Imóvel';
    case 'fampe':
      return 'FAMPE';
    case 'maquinas-e-equipamentos':
      return 'Máquinas e Equipamentos';
    case 'outro':
      return 'Outros';
    default:
      return tipo;
  }
};

export const isDocumentoValidoByTipoPessoa = (val, tipoPessoa) => {
  if (tipoPessoa === 'pessoa-juridica') {
    return isValidCnpj(val);
  }
  if (tipoPessoa === 'pessoa-fisica') {
    return isValidCpf(val);
  }
  return false;
};

export const isEmailValido = email => {
  return emailValidator.validate(email);
};

export const messages = {
  'validar-cadastro': 'Não foi possível validar os dados informados com a base da Receita Federal',
  'nao-se-enquadra': 'Não se enquadra na Política de Crédito da Desenvolve MT',
};

export const descricaoDocumentacao = {
  'comprovante-de-endereco': 'Comprovante de Endereço',
  'documento-constitutivo': 'Documento Constitutivo da Empresa',
  'proposta-alvara-de-funcionamento': 'Alvará de Funcionamento',
  'proposta-alvara-de-vigilancia-sanitaria-caso-seja-necessario': 'Alvará de Vigilância Sanitária',
};

export const formatCnpjCpf = document => {
  if (!document) return '';

  const cnpjCpf = document.replace(/\D/g, '');

  if (cnpjCpf.length === 11) {
    return formatCpf(document);
  }

  return formatCnpj(document);
};

export const isValidDate = (stringDate, format = 'DD/MM/YYYY') => {
  if (!stringDate) {
    return true;
  }
  const valid = moment(stringDate, format).isValid();
  return valid;
};

export const goBack = () => {
  window.history.back();
};

export const copy = obj => {
  return JSON.parse(JSON.stringify(obj));
};

export const openExternalURL = url => {
  Browser.open({ url });
};

export const painDescription = pain => {
  switch (pain) {
    case 'comer_bem':
      return 'Comer Bem';
    case 'efeitos_colaterais':
      return 'Efeitos Colaterais';
    case 'espiritualidade':
      return 'Espiritualidade';
    case 'lidar_com_emocoes':
      return 'Lidar com Emoções';
    case 'me_exercitar':
      return 'Me Exercitar';
    case 'meus_direitos':
      return 'Meus Direitos';
    case 'sexualidade':
      return 'Sexualidade';
    case 'vida_apos_cancer':
      return 'Vida Após o Câncer';
    default:
      return pain;
  }
};

export const painIcon = pain => {
  switch (pain) {
    case 'comer_bem':
      return 'img:icons/fruit.svg';
    case 'efeitos_colaterais':
      return 'img:icons/side-effect.svg';
    case 'espiritualidade':
      return 'img:icons/pray.svg';
    case 'lidar_com_emocoes':
      return 'img:icons/emotions.svg';
    case 'me_exercitar':
      return 'img:icons/exercise.svg';
    case 'meus_direitos':
      return 'img:icons/auction.svg';
    case 'sexualidade':
      return 'img:icons/sexual.svg';
    case 'vida_apos_cancer':
      return 'img:icons/question.svg';
    default:
      return pain;
  }
};

export const painColor = pain => {
  switch (pain) {
    case 'comer_bem':
      return '#12908E';
    case 'efeitos_colaterais':
      return '#F98F45';
    case 'espiritualidade':
      return '#0682A6';
    case 'lidar_com_emocoes':
      return '#C53A22';
    case 'me_exercitar':
      return '#00475C';
    case 'meus_direitos':
      return '#4E4848';
    case 'sexualidade':
      return '#FF8884';
    case 'vida_apos_cancer':
      return '#FFA13E';
    default:
      return '#000000';
  }
};

export const formattedEventType = type => {
  switch (type) {
    case 'teleconsulta':
      return 'Teleconsulta';
    case 'exame':
      return 'Exame';
    case 'outra-atividade':
      return 'Outra Atividade';
    default:
      return type;
  }
};

export const formattedDate = dateHour => {
  return moment(dateHour).format('DD/MM/YYYY');
};

export const formattedHour = dateHour => {
  return moment(dateHour).format('HH:mm');
};
