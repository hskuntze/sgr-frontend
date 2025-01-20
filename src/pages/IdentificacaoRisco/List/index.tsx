import "./styles.css";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Loader from "components/Loader";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { TablePagination } from "@mui/material";
import { formatarData } from "utils/functions";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import { IdentificacaoRiscoType } from "types/identificacaorisco";
import IdentificacaoRiscoCard from "components/IdentificacaoRiscoCard";

const IdentificacaoRiscoList = () => {
  const [irs, setIrs] = useState<IdentificacaoRiscoType[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/identificacaoriscos",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setIrs(res.data as IdentificacaoRiscoType[]);
      })
      .catch((err) => {
        toast.error("Erro ao tentar resgatar os capacitados.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    pageNumber: number
  ) => {
    setPage(pageNumber);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value.toLowerCase());
    setPage(0);
  };

  const filteredData = irs.filter((c) => {
    const searchTerm = filter.trim();
    if (!searchTerm) return true;

    return (
      c.id.toLowerCase().includes(searchTerm) ||
      (c.projeto.toLowerCase().includes(searchTerm) ?? false) ||
      (c.contrato.toLowerCase().includes(searchTerm) ?? false) ||
      (c.tipoRisco.toLowerCase().includes(searchTerm) ?? false) ||
      (c.risco.toLowerCase().includes(searchTerm) ?? false) ||
      (c.conjunto.toLowerCase().includes(searchTerm) ?? false) ||
      (c.evento.toLowerCase().includes(searchTerm) ?? false) ||
      (c.descricaoRisco.toLowerCase().includes(searchTerm) ?? false)
    );
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleExportToExcel = () => {
    if (filteredData) {
      const irsProcessados = filteredData.map((t) => ({
        ID: t.id,
        Projeto: t.projeto,
        Contrato: t.contrato,
        "Tipo de Risco": t.tipoRisco,
        Risco: t.risco,
        Conjunto: t.conjunto,
        Evento: t.evento,
        "Descrição do risco": t.descricaoRisco,
        Causa: t.causa,
        "Data do Risco": formatarData(t.dataRisco),
        Ano: t.ano,
        "Data Limite": formatarData(t.dataLimite),
        Categoria: t.categoria,
        Probabilidade: t.probabilidade,
        Impacto: t.impacto,
        Criticidade: t.criticidade,
        "Criticidade (Severidade)": t.severidade,
        Consequência: t.consequencia,
        Tratamento: t.tratamento,
        "Impacto Financeiro": t.impactoFinanceiro,
        "Planos de Contingência": t.planoContingencia,
        "Responsável pelo Risco": t.responsavelRisco,
        "Responsável pelo Conjunto": t.responsavelConjunto,
        Status: t.status,
      }));

      const ws = XLSX.utils.json_to_sheet(irsProcessados);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Identificação de Riscos");
      XLSX.writeFile(wb, "identificacaoriscos.xlsx");
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Identificação de Riscos", 15, 20);

    doc.setFontSize(12);
    const yStart = 30;
    let y = yStart;
    const lineHeight = 10;
    const marginLeft = 15;
    const colWidth = 70;

    filteredData?.forEach((b, i) => {
      doc.setFont("helvetica", "bold");
      doc.text(b.id, marginLeft, y);
      y += lineHeight;

      const data = [
        ["ID", b.id],
        ["Projeto", b.projeto],
        ["Contrato", b.contrato],
        ["Tipo de Risco", b.tipoRisco],
        ["Risco: CONTRATUAL/PROJETO", b.risco],
        ["Conjunto", b.conjunto],
        ["Evento (Descrição completa)", b.evento],
        ["Descrição do Risco", b.descricaoRisco],
        ["Causa", b.causa],
        ["Data do Risco", b.dataRisco ? formatarData(b.dataRisco) : "-"],
        ["Ano", String(b.ano)],
        ["Data Limite", b.dataLimite ? formatarData(b.dataLimite) : "-"],
        ["Categoria", b.categoria],
        ["Probabilidade", b.probabilidade],
        ["Impacto", b.impacto],
        ["Criticidade", String(b.criticidade)],
        ["Criticidade (Severidade)", b.severidade],
        ["Tratamento", b.tratamento],
        ["Impacto Financeiro", b.impactoFinanceiro ?? "-"],
        ["Planos de Contingência", b.planoContingencia ?? "-"],
        ["Responsável pelo Risco", b.responsavelRisco],
        ["Responsável pelo Conjunto", b.responsavelConjunto],
        ["Status", b.status],
      ];

      data.forEach(([k, v]) => {
        doc.setFont("helvetica", "bold");
        doc.text(k, marginLeft, y);
        doc.setFont("helvetica", "normal");
        const textLines = doc.splitTextToSize(v, 100); // Define a largura máxima de 100px
        doc.text(textLines, marginLeft + colWidth, y);

        y += textLines.length * lineHeight;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      y += 10;
    });

    doc.save("identificacaoriscos.pdf");
  };

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <>
      <div className="top-list-buttons">
        <Link to="/sgr/identificacaoriscos/inserir">
          <button type="button" className="button create-button">
            Nova Identificação de Risco
          </button>
        </Link>
        <button
          onClick={handleExportPDF}
          type="button"
          className="act-button create-button"
        >
          <i className="bi bi-filetype-pdf" />
        </button>
        <button
          onClick={handleExportToExcel}
          type="button"
          className="act-button create-button"
        >
          <i className="bi bi-file-earmark-excel" />
        </button>
      </div>
      <div className="filtro-container">
        <form>
          <div className="filtro-input-div form-floating">
            <input
              type="text"
              className="form-control filtro-input"
              id="nome-treinamento-filtro"
              placeholder="Digite um termo para filtrar"
              onChange={handleFilterChange}
            />
            <label htmlFor="nome-treinamento-filtro">
              Digite um termo para filtrar
            </label>
          </div>
          <button className="search-button" type="button">
            <i className="bi bi-search" />
          </button>
        </form>
      </div>
      <div className="list-container">
        {loading ? (
          <div className="loader-div">
            <Loader height="100" width="100" />
          </div>
        ) : (
          <table className="table-container">
            <thead className="table-head">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Projeto</th>
                <th scope="col">Contrato</th>
                <th scope="col">Tipo do Risco</th>
                <th scope="col">Risco</th>
                <th scope="col">Conjunto</th>
                <th scope="col">Evento</th>
                <th scope="col">Descrição do Risco</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {paginatedData.length > 0 ? (
                paginatedData.map((t) => (
                  <IdentificacaoRiscoCard onLoad={loadInfo} key={t.id} element={t} />
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <div className="no-elements-on-table">
                      <span>Não existem elementos a serem exibidos.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <TablePagination
                    className="table-pagination-container"
                    component="div"
                    count={filteredData.length}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Registros por página: "
                    labelDisplayedRows={({ from, to, count }) => {
                      return `${from} - ${to} de ${count}`;
                    }}
                    classes={{
                      selectLabel: "pagination-select-label",
                      displayedRows: "pagination-displayed-rows-label",
                      select: "pagination-select",
                      toolbar: "pagination-toolbar",
                    }}
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </>
  );
};

export default IdentificacaoRiscoList;
