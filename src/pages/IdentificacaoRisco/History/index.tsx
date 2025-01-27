import { AxiosRequestConfig } from "axios";
import Loader from "components/Loader";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { requestBackend } from "utils/requests";

const IdentificacaoRiscoHistory = () => {
  const urlParams = useParams();
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState();

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: `/identificacaoriscos/${urlParams.id}`,
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setHistorico(res.data);
      })
      .catch((err) => {
        toast.error(
          "Erro ao resgatar dados do histórico da identificação de risco."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlParams.id]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <div>
      {loading ? (
        <div className="loader-div">
          <Loader width="160px" height="160px" />
        </div>
      ) : (
        <div>Histórico do registro {urlParams.id}</div>
      )}
    </div>
  );
};

export default IdentificacaoRiscoHistory;
