import { Conjunto } from "./conjunto";

export type IdentificacaoRiscoType = {
  id: string;
  projeto: string;
  identificadoPor: string;
  contrato: string;
  tipoRisco: string;
  risco: string;
  conjunto: Conjunto;
  evento: string;
  descricaoRisco: string;
  causa: string;
  dataRisco: string;
  ano: number;
  dataLimite: string;
  categoria: string;
  probabilidade: string;
  impacto: string;
  criticidade: number;
  severidade: string;
  consequencia: string;
  tratamento: string;
  impactoFinanceiro: string;
  planoContingencia: string;
  responsavelRisco: string;
  status: string;
};
