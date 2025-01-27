import "./styles.css";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IdentificacaoRiscoType } from "types/identificacaorisco";
import { requestBackend } from "utils/requests";
import { ResponsavelConjunto } from "types/responsavelconjunto";
import { Conjunto } from "types/conjunto";

type FormData = {
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
  responsavelConjunto: ResponsavelConjunto;
  status: string;
};

type UrlParams = {
  id: string;
};

const IdentificacaoRiscoForm = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<FormData>();

  const [isEditing, setIsEditing] = useState(false);
  const [conjuntos, setConjuntos] = useState<Conjunto[]>([]);
  const [conjuntoSelecionado, setConjuntoSelecionado] = useState<Conjunto>();
  const [probabilidadeSelecionada, setProbabilidadeSelecionada] =
    useState<string>();
  const [impactoSelecionado, setImpactoSelecionado] = useState<string>("");

  const navigate = useNavigate();

  const urlParams = useParams<UrlParams>();

  const onSubmit = (formData: FormData) => {
    const requestParams: AxiosRequestConfig = {
      url: `${
        isEditing
          ? `/identificacaoriscos/${urlParams.id}`
          : "/identificacaoriscos"
      }`,
      method: isEditing ? "PUT" : "POST",
      withCredentials: true,
      data: {
        ...formData,
        conjunto: conjuntoSelecionado,
        impacto: impactoSelecionado,
      },
    };

    requestBackend(requestParams)
      .then(() => {
        toast.success(
          `Sucesso ao ${isEditing ? "atualizar" : "registrar"} a avaliação`
        );

        navigate("/sgr/identificacaoriscos");
      })
      .catch(() => {
        toast.error(
          `Erro ao ${isEditing ? "atualizar" : "registrar"} a avaliação`
        );
      });
  };

  const loadInfo = useCallback(() => {
    const requestConjuntoParams: AxiosRequestConfig = {
      url: "/conjuntos",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestConjuntoParams)
      .then((res) => {
        setConjuntos(res.data as Conjunto[]);
      })
      .catch((err) => {
        toast.error("Erro ao tentar carregar os Conjuntos.");
      });

    if (isEditing) {
      const requestParams: AxiosRequestConfig = {
        url: `/identificacaoriscos/${urlParams.id}`,
        withCredentials: true,
        method: "GET",
      };

      requestBackend(requestParams)
        .then((res) => {
          let data = res.data as IdentificacaoRiscoType;

          setValue("projeto", data.projeto);
          setValue("identificadoPor", data.identificadoPor);
          setValue("dataLimite", data.dataLimite);
          setValue("dataRisco", data.dataRisco);
          setValue("ano", data.ano);
          setValue("categoria", data.categoria);
          setValue("causa", data.causa);
          setValue("conjunto", data.conjunto);
          setValue("consequencia", data.consequencia);
          setValue("contrato", data.contrato);
          setValue("criticidade", data.criticidade);
          setValue("descricaoRisco", data.descricaoRisco);
          setValue("evento", data.evento);
          setValue("impacto", data.impacto);
          setValue("impactoFinanceiro", data.impactoFinanceiro);
          setValue("planoContingencia", data.planoContingencia);
          setValue("probabilidade", data.probabilidade);
          setValue("projeto", data.projeto);
          setValue("responsavelRisco", data.responsavelRisco);
          setValue("status", data.status);
          setValue("severidade", data.severidade);
          setValue("tipoRisco", data.tipoRisco);
          setValue("tratamento", data.tratamento);
          setValue("risco", data.risco);
          setValue(
            "responsavelConjunto.nome",
            data.conjunto.responsavelConjunto.nome
          );

          setConjuntoSelecionado(data.conjunto);
          setProbabilidadeSelecionada(data.probabilidade);
          setImpactoSelecionado(data.impacto);
        })
        .catch((err) => {
          toast.error("Erro ao carregar informações da avaliação.");
        });
    }
  }, [isEditing, urlParams.id, setValue]);

  const handleSelectConjunto = (cj: Conjunto) => {
    if (cj !== undefined) {
      setConjuntoSelecionado(cj);
      setValue("responsavelConjunto", cj.responsavelConjunto);
    } else {
      let mock = {
        nome: "",
        id: 0,
        responsavelConjunto: { id: 0, nome: "" },
      };
      setConjuntoSelecionado(mock);
      setValue("responsavelConjunto", mock.responsavelConjunto);
    }
  };

  const calcularCriticidade = useCallback(() => {
    if (probabilidadeSelecionada && impactoSelecionado) {
      const valores: { [key: string]: number } = {
        "MUITO BAIXO": 1,
        BAIXO: 2,
        MÉDIO: 3,
        ALTO: 4,
        "MUITO ALTO": 5,
      };

      let valorImpacto = valores[impactoSelecionado];
      let valorProbabilidade = valores[probabilidadeSelecionada];

      let total = valorImpacto * valorProbabilidade;
      setValue("criticidade", total);

      let novaSeveridade = "";
      if (total < 2.9) {
        novaSeveridade = "BAIXO";
      } else if (total < 7.9) {
        novaSeveridade = "MÉDIO";
      } else if (total < 14.9) {
        novaSeveridade = "ALTO";
      } else {
        novaSeveridade = "EXTREMO";
      }

      setValue("severidade", novaSeveridade);
    }
  }, [probabilidadeSelecionada, impactoSelecionado, setValue]);

  useEffect(() => {
    if (urlParams.id && urlParams.id !== "inserir") {
      setIsEditing(true);
    }
  }, [urlParams]);

  useEffect(() => {
    loadInfo();
  }, [isEditing, loadInfo]);

  useEffect(() => {
    calcularCriticidade();
  }, [calcularCriticidade]);

  return (
    <div className="element-container">
      <h3 className="form-title">Identificação de Risco</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="element-form">
        <div className="element-content">
          <div className="element-left">
            <h6 className="mt-3">
              <b>DADOS DA IDENTIFICAÇÃO DE RISCO</b>
            </h6>
            <div className="element-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.tipoRisco ? "is-invalid" : ""
                }`}
                id="projeto"
                placeholder="Projeto"
                {...register("projeto", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="projeto">
                Projeto
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.projeto?.message}
              </div>
            </div>
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Tipo<span className="campo-obrigatorio">*</span>
              </span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.identificadoPor ? "is-invalid" : ""
                  }`}
                  value="Contratada-EMBRAER"
                  id="Contratada-EMBRAER"
                  {...register("identificadoPor", {
                    required: "Campo obrigatório",
                  })}
                />
                <label htmlFor="Contratada-EMBRAER">Contratada (EMBRAER)</label>
                <div className="invalid-feedback d-block">
                  {errors.identificadoPor?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.identificadoPor ? "is-invalid" : ""
                  }`}
                  value="Contratante-EB"
                  id="Contratante-EB"
                  {...register("identificadoPor", {
                    required: "Campo obrigatório",
                  })}
                />
                <label htmlFor="Contratante-EB">Contratante (EB)</label>
                <div className="invalid-feedback d-block">
                  {errors.identificadoPor?.message}
                </div>
              </div>
            </div>
            <div className="element-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.tipoRisco ? "is-invalid" : ""
                }`}
                id="contrato"
                placeholder="Contrato"
                {...register("contrato", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="contrato">
                Contrato
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.contrato?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <Controller
                name="tipoRisco"
                control={control}
                rules={{
                  required: "Campo obrigatório",
                }}
                render={({ field }) => (
                  <select
                    id="tipo-risco"
                    className={`form-control ${
                      errors.tipoRisco ? "is-invalid" : ""
                    }`}
                    {...field}
                    value={field.value}
                  >
                    <option value="">Selecione um tipo de risco</option>
                    <option value="OPERACIONAL">OPERACIONAL</option>
                    <option value="TÁTICO">TÁTICO</option>
                    <option value="ESTRATÉGICO">ESTRATÉGICO</option>
                  </select>
                )}
              />
              <label htmlFor="tipo-risco" className="label-obrigatorio">
                Tipo de risco
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.tipoRisco?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <Controller
                name="risco"
                control={control}
                rules={{
                  required: "Campo obrigatório",
                }}
                render={({ field }) => (
                  <select
                    id="risco"
                    className={`form-control ${
                      errors.risco ? "is-invalid" : ""
                    }`}
                    {...field}
                    value={field.value}
                  >
                    <option value="">Selecione um risco</option>
                    <option value="PROJETO">PROJETO</option>
                    <option value="CONTRATUAL">CONTRATUAL</option>
                  </select>
                )}
              />
              <label htmlFor="risco" className="label-obrigatorio">
                Risco
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.risco?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <Controller
                name="conjunto"
                control={control}
                rules={{
                  required: "Campo obrigatório",
                }}
                render={({ field }) => (
                  <select
                    id="conjunto"
                    className={`form-select ${
                      errors.conjunto ? "is-invalid" : ""
                    }`}
                    value={field.value?.id ?? ""}
                    onChange={(e) => {
                      const selectedConjunto = conjuntos.find(
                        (cj) => cj.id === Number(e.target.value)
                      ) as Conjunto;
                      field.onChange(selectedConjunto ?? null);
                      handleSelectConjunto(selectedConjunto);
                    }}
                  >
                    <option value="">Selecione um conjunto</option>
                    {conjuntos &&
                      conjuntos.length > 0 &&
                      conjuntos.map((cj) => (
                        <option value={cj.id}>{cj.nome}</option>
                      ))}
                  </select>
                )}
              />
              <label htmlFor="conjunto">
                Conjunto
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.conjunto?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <textarea
                className={`form-control ${errors.evento ? "is-invalid" : ""}`}
                id="evento"
                placeholder="Descreva o evento"
                {...register("evento", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="evento">
                Evento
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.evento?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <textarea
                className={`form-control ${
                  errors.descricaoRisco ? "is-invalid" : ""
                }`}
                id="descricaoRisco"
                placeholder="Descrição do risco"
                {...register("descricaoRisco", {
                  required: "Campo obrigatório",
                })}
                rows={10}
              />
              <label htmlFor="descricaoRisco">
                Descrição do risco
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.descricaoRisco?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <textarea
                className={`form-control ${errors.causa ? "is-invalid" : ""}`}
                id="causa"
                placeholder="Causa"
                {...register("causa", {
                  required: "Campo obrigatório",
                })}
                rows={10}
              />
              <label htmlFor="causa">
                Causa
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.causa?.message}
              </div>
            </div>
            <div className="element-input-group">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="dataRisco"
                  control={control}
                  rules={{
                    required: "Campo obrigatório",
                  }}
                  render={({ field }) => (
                    <MobileDatePicker
                      {...field}
                      format="DD/MM/YYYY"
                      onChange={(date) => field.onChange(date)}
                      value={dayjs(field.value)}
                      label={`Data do risco`}
                      className={`form-control ${
                        errors.dataRisco ? "is-invalid" : ""
                      }`}
                    />
                  )}
                />
              </LocalizationProvider>
              <div className="invalid-feedback d-block">
                {errors.dataRisco?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <input
                type="text"
                className={`form-control ${errors.ano ? "is-invalid" : ""}`}
                id="ano"
                placeholder="Ano"
                {...register("ano", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="ano">
                Ano
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.ano?.message}
              </div>
            </div>
            <div className="element-input-group">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="dataLimite"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MobileDatePicker
                        {...field}
                        format="DD/MM/YYYY"
                        onChange={(date) => field.onChange(date)}
                        value={dayjs(field.value) ?? ""}
                        label={`Data limite`}
                        className={`form-control`}
                      />
                      <button
                        className="button act-button"
                        onClick={() => field.onChange(null)}
                        style={{ marginTop: "8px" }}
                        type="button"
                      >
                        <i
                          className="bi bi-x-octagon"
                          style={{ fontSize: "20px" }}
                        />
                      </button>
                    </div>
                  )}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="element-right">
            <div className="element-input-group form-floating">
              <Controller
                name="categoria"
                control={control}
                rules={{
                  required: "Campo obrigatório",
                }}
                render={({ field }) => (
                  <select
                    id="categoria"
                    className={`form-control ${
                      errors.categoria ? "is-invalid" : ""
                    }`}
                    {...field}
                    value={field.value}
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="TÉCNICO">TÉCNICO</option>
                    <option value="GERENCIAMENTO">GERENCIAMENTO</option>
                    <option value="EXTERNO">EXTERNO</option>
                    <option value="ORGANIZACIONAL">ORGANIZACIONAL</option>
                  </select>
                )}
              />
              <label htmlFor="categoria" className="label-obrigatorio">
                Categoria
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.tipoRisco?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <Controller
                name="probabilidade"
                control={control}
                rules={{
                  required: "Campo obrigatório",
                }}
                render={({ field }) => (
                  <select
                    id="probabilidade"
                    className={`form-control ${
                      errors.probabilidade ? "is-invalid" : ""
                    }`}
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      setProbabilidadeSelecionada(e.target.value);
                    }}
                  >
                    <option value="">Selecione uma probabilidade</option>
                    <option value="MUITO BAIXO">MUITO BAIXO</option>
                    <option value="BAIXO">BAIXO</option>
                    <option value="MÉDIO">MÉDIO</option>
                    <option value="ALTO">ALTO</option>
                    <option value="MUITO ALTO">MUITO ALTO</option>
                  </select>
                )}
              />
              <label htmlFor="probabilidade" className="label-obrigatorio">
                Probabilidade
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.tipoRisco?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <Controller
                name="impacto"
                control={control}
                rules={{
                  required: "Campo obrigatório",
                }}
                render={({ field }) => (
                  <select
                    id="impacto"
                    className={`form-control ${
                      errors.impacto ? "is-invalid" : ""
                    }`}
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      setImpactoSelecionado(e.target.value);
                    }}
                  >
                    <option value="">Selecione um impacto</option>
                    <option value="MUITO BAIXO">MUITO BAIXO</option>
                    <option value="BAIXO">BAIXO</option>
                    <option value="MÉDIO">MÉDIO</option>
                    <option value="ALTO">ALTO</option>
                    <option value="MUITO ALTO">MUITO ALTO</option>
                  </select>
                )}
              />
              <label htmlFor="impacto" className="label-obrigatorio">
                Impacto
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.impacto?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.criticidade ? "is-invalid" : ""
                }`}
                id="criticidade"
                placeholder="Criticidade"
                {...register("criticidade")}
                disabled
              />
              <label htmlFor="criticidade">
                Criticidade
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.criticidade?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.severidade ? "is-invalid" : ""
                }`}
                placeholder="Criticidade (Severidade)"
                {...register("severidade")}
                disabled
              />
              <label htmlFor="severidade" className="label-obrigatorio">
                Criticidade (Severidade)
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.severidade?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <textarea
                className={`form-control ${
                  errors.consequencia ? "is-invalid" : ""
                }`}
                id="consequencia"
                placeholder="Descreva a consequência"
                {...register("consequencia", {
                  required: "Campo obrigatório",
                })}
                rows={10}
              />
              <label htmlFor="consequencia">
                Consequência
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.consequencia?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <textarea
                className={`form-control ${
                  errors.tratamento ? "is-invalid" : ""
                }`}
                id="tratamento"
                placeholder="Descreva o tratamento"
                {...register("tratamento", {
                  required: "Campo obrigatório",
                })}
                rows={10}
              />
              <label htmlFor="tratamento">
                Tratamento
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.tratamento?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.tipoRisco ? "is-invalid" : ""
                }`}
                id="impacto-financeiro"
                placeholder="Impacto Financeiro"
                {...register("impactoFinanceiro")}
              />
              <label htmlFor="impacto-financeiro">Impacto Financeiro</label>
            </div>
            <div className="element-input-group form-floating">
              <textarea
                className={`form-control`}
                id="planoContingencia"
                placeholder="Descreva o plano de contingência"
                {...register("planoContingencia")}
                rows={10}
              />
              <label htmlFor="planoContingencia">Plano de contingência</label>
            </div>
            <div className="element-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.tipoRisco ? "is-invalid" : ""
                }`}
                id="responsavel-risco"
                placeholder="Responsável pelo Risco"
                {...register("responsavelRisco", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="responsavel-risco">
                Responsável pelo Risco
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.responsavelRisco?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.tipoRisco ? "is-invalid" : ""
                }`}
                id="responsavel-conjunto"
                placeholder="Responsável pelo Conjunto"
                {...register("responsavelConjunto.nome", {
                  required: "Campo obrigatório",
                })}
                disabled
              />
              <label htmlFor="responsavel-conjunto">
                Responsável pelo conjunto
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.responsavelConjunto?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <Controller
                name="status"
                control={control}
                rules={{
                  required: "Campo obrigatório",
                }}
                render={({ field }) => (
                  <select
                    id="status"
                    className={`form-control ${
                      errors.status ? "is-invalid" : ""
                    }`}
                    {...field}
                    value={field.value}
                  >
                    <option value="">Selecione uma status</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Fechado com impacto">
                      Fechado com impacto
                    </option>
                    <option value="Fechado sem impacto">
                      Fechado sem impacto
                    </option>
                    <option value="Descartado">Descartado</option>
                  </select>
                )}
              />
              <label htmlFor="status" className="label-obrigatorio">
                Status
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.status?.message}
              </div>
            </div>
          </div>
        </div>
        <div className="form-buttons">
          <button className="button submit-button">Salvar</button>
          <Link to={"/sgr"}>
            <button type="button" className="button delete-button">
              Voltar
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default IdentificacaoRiscoForm;
