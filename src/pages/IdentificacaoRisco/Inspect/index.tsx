import { AxiosRequestConfig } from "axios";
import Loader from "components/Loader";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IdentificacaoRiscoType } from "types/identificacaorisco";
import { formatarData } from "utils/functions";
import { requestBackend } from "utils/requests";

const IdentificacaoRiscoInspect = () => {
  const urlParams = useParams();

  const [identificacaoRisco, setIdentificacaoRisco] =
    useState<IdentificacaoRiscoType>();
  const [loading, setLoading] = useState(false);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: `/identificacaoriscos/${urlParams.id}`,
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setIdentificacaoRisco(res.data as IdentificacaoRiscoType);
      })
      .catch((err) => {
        toast.error("Erro ao resgatar dados da identificação de risco.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlParams.id]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <div className="inspect-container">
      <div>
        {loading ? (
          <div className="loading-div">
            <Loader />
          </div>
        ) : (
          <div className="inspect-content">
            <h5>{identificacaoRisco?.id}</h5>
            <span>
              <b>Projeto: </b> {identificacaoRisco?.projeto}
            </span>
            <span>
              <b>Contrato: </b> {identificacaoRisco?.contrato}
            </span>
            <span>
              <b>Tipo de risco: </b> {identificacaoRisco?.tipoRisco}
            </span>
            <span>
              <b>Risco: CONTRATUAL/PROJETO </b> {identificacaoRisco?.risco}
            </span>
            <span>
              <b>Conjunto: </b> {identificacaoRisco?.conjunto}
            </span>
            <span>
              <b>Evento: </b> {identificacaoRisco?.evento}
            </span>
            <span>
              <b>Descrição do Risco: </b> {identificacaoRisco?.descricaoRisco}
            </span>
            <span>
              <b>Causa: </b> {identificacaoRisco?.causa}
            </span>
            <span>
              <b>Data do Risco: </b>{" "}
              {identificacaoRisco?.dataRisco
                ? formatarData(identificacaoRisco?.dataRisco)
                : "-"}
            </span>
            <span>
              <b>Ano: </b> {identificacaoRisco?.ano}
            </span>
            <span>
              <b>Data Limite: </b>{" "}
              {identificacaoRisco?.dataLimite
                ? formatarData(identificacaoRisco?.dataLimite)
                : "-"}
            </span>
            <span>
              <b>Categoria: </b> {identificacaoRisco?.categoria}
            </span>
            <span>
              <b>Probabilidade: </b> {identificacaoRisco?.probabilidade}
            </span>
            <span>
              <b>Impacto: </b> {identificacaoRisco?.impacto}
            </span>
            <span>
              <b>Criticidade: </b> {identificacaoRisco?.criticidade}
            </span>
            <span>
              <b>Criticidade (Severidade): </b> {identificacaoRisco?.severidade}
            </span>
            <span>
              <b>Tratamento: </b> {identificacaoRisco?.tratamento}
            </span>
            <span>
              <b>Impacto Financeiro: </b>{" "}
              {identificacaoRisco?.impactoFinanceiro ?? "-"}
            </span>
            <span>
              <b>Planos de Contingência: </b>{" "}
              {identificacaoRisco?.planoContingencia ?? "-"}
            </span>
            <span>
              <b>Responsável pelo Risco: </b>{" "}
              {identificacaoRisco?.responsavelRisco}
            </span>
            <span>
              <b>Responsável pelo Conjunto: </b>{" "}
              {identificacaoRisco?.responsavelConjunto}
            </span>
            <span>
              <b>Status: </b> {identificacaoRisco?.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdentificacaoRiscoInspect;
