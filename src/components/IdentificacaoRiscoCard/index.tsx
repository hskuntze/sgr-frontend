import "./styles.css";
import { Link } from "react-router-dom";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import { IdentificacaoRiscoType } from "types/identificacaorisco";

interface Props {
  element: IdentificacaoRiscoType;
  onLoad: () => void; //Trigger para que ao deletar o registro recarregue as informações da página
}

/**
 * Elemento para exibição na listagem de identificação de riscos
 */
const IdentificacaoRiscoCard = ({ element, onLoad }: Props) => {
  const deleteElement = (id: string) => {
    let confirm = window.confirm(
      "Você tem certeza que deseja deletar esse elemento?"
    );

    if (confirm) {
      const requestParams: AxiosRequestConfig = {
        url: `/identificacaoriscos/${id}`,
        method: "DELETE",
        withCredentials: true,
      };

      requestBackend(requestParams)
        .then(() => {
          toast.success("Deletado com sucesso.");

          onLoad();
        })
        .catch((err) => {
          toast.error("Erro ao deletar.");
        });
    }
  };

  return (
    <tr className="card-container">
      <td>
        <div className="card-content">{element.id}</div>
      </td>
      <td>
        <div className="card-content">
          {element.projeto}
        </div>
      </td>
      <td>
        <div className="card-content">
          {element.contrato}
        </div>
      </td>
      <td>
        <div className="card-content">{element.tipoRisco}</div>
      </td>
      <td>
        <div className="card-content">{element.risco}</div>
      </td>
      <td>
        <div className="card-content">
          {element.conjunto}
        </div>
      </td>
      <td>
        <div className="card-content">
          {element.evento}
        </div>
      </td>
      <td>
        <div className="card-content">
          {element.descricaoRisco}
        </div>
      </td>
      <td>
        <div className="card-buttons">
          <Link to={`/sgr/identificacaoriscos/visualizar/${element.id}`}>
            <button className="act-button submit-button">
              <i className="bi bi-file-earmark-text" />
            </button>
          </Link>
          <Link to={`/sgr/identificacaoriscos/${element.id}`}>
            <button className="act-button edit-button" type="button">
              <i className="bi bi-pencil" />
            </button>
          </Link>
          <button
            className="act-button delete-button"
            type="button"
            onClick={() => deleteElement(element.id)}
          >
            <i className="bi bi-trash" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default IdentificacaoRiscoCard;
