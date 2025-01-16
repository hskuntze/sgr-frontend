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

type FormData = {
  id: string;
  projeto: string;
  contrato: string;
  tipoRisco: string;
  risco: string;
  conjunto: string;
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
  responsavelConjunto: string;
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
    if (isEditing) {
      const requestParams: AxiosRequestConfig = {
        url: `/identificacaoriscos/${urlParams.id}`,
        withCredentials: true,
        method: "GET",
      };

      requestBackend(requestParams)
        .then((res) => {
          let data = res.data as IdentificacaoRiscoType;

          setValue("id", data.id);
          setValue("projeto", data.projeto);
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
          setValue("responsavelConjunto", data.responsavelConjunto);
          setValue("responsavelRisco", data.responsavelRisco);
          setValue("status", data.status);
          setValue("severidade", data.severidade);
          setValue("tipoRisco", data.tipoRisco);
          setValue("tratamento", data.tratamento);
          setValue("risco", data.risco);
        })
        .catch((err) => {
          toast.error("Erro ao carregar informações da avaliação.");
        });
    }
  }, [isEditing, urlParams.id, setValue]);

  useEffect(() => {
    if (urlParams.id && urlParams.id !== "inserir") {
      setIsEditing(true);
    }
  }, [urlParams]);

  useEffect(() => {
    loadInfo();
  }, [isEditing, loadInfo]);

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
                className={`form-control`}
                id="id-risco"
                placeholder="ID da Identificação de Risco"
                {...register("id", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="id-risco">ID</label>
              <div className="invalid-feedback d-block">
                {errors.id?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <input
                type="text"
                className={`form-control`}
                id="projeto"
                placeholder="Projeto"
                {...register("projeto", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="projeto">Projeto</label>
              <div className="invalid-feedback d-block">
                {errors.projeto?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <input
                type="text"
                className={`form-control`}
                id="contrato"
                placeholder="Contrato"
                {...register("contrato", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="contrato">Contrato</label>
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
              <input
                type="text"
                className={`form-control`}
                id="conjunto"
                placeholder="Conjunto"
                {...register("conjunto", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="conjunto">Conjunto</label>
              <div className="invalid-feedback d-block">
                {errors.conjunto?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <textarea
                className={`form-control ${errors.evento ? "is-invalid" : ""}`}
                id="evento"
                placeholder="Descreva o evento"
                {...register("evento")}
                rows={10}
              />
              <label htmlFor="evento">Evento</label>
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
                {...register("descricaoRisco")}
                rows={10}
              />
              <label htmlFor="descricaoRisco">Descrição do risco</label>
              <div className="invalid-feedback d-block">
                {errors.descricaoRisco?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <textarea
                className={`form-control ${errors.causa ? "is-invalid" : ""}`}
                id="causa"
                placeholder="Causa"
                {...register("causa")}
                rows={10}
              />
              <label htmlFor="causa">Causa</label>
              <div className="invalid-feedback d-block">
                {errors.causa?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
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
                      className="form-control"
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
              <label htmlFor="ano">Ano</label>
              <div className="invalid-feedback d-block">
                {errors.ano?.message}
              </div>
            </div>

            <div className="element-input-group form-floating">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="dataLimite"
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
                      label={`Data do limite`}
                      className="form-control"
                    />
                  )}
                />
              </LocalizationProvider>
              <div className="invalid-feedback d-block">
                {errors.dataLimite?.message}
              </div>
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
                    <option value="ADMINISTRATIVA">ADMINISTRATIVA</option>
                    <option value="ECONÔMICOS">ECONÔMICOS</option>
                    <option value="MATERIAL">MATERIAL</option>
                    <option value="ORGANIZACIONAL">ORGANIZACIONAL</option>
                    <option value="POLÍTICOS">POLÍTICOS</option>
                    <option value="SERVIÇOS">SERVIÇOS</option>
                    <option value="TÉCNICO">TÉCNICO</option>
                    <option value="TECNOLÓGICOS">TECNOLÓGICOS</option>
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
                  >
                    <option value="">Selecione uma probabilidade</option>
                    <option value="MUITO ALTO">MUITO ALTO</option>
                    <option value="ALTO">ALTO</option>
                    <option value="MÉDIO">MÉDIO</option>
                    <option value="BAIXO">BAIXO</option>
                    <option value="MUITO BAIXO">MUITO BAIXO</option>
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
                  >
                    <option value="">Selecione uma impacto</option>
                    <option value="MUITO ALTO">MUITO ALTO</option>
                    <option value="ALTO">ALTO</option>
                    <option value="MÉDIO">MÉDIO</option>
                    <option value="BAIXO">BAIXO</option>
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
                className={`form-control`}
                id="criticidade"
                placeholder="Criticidade"
                {...register("criticidade", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="criticidade">Criticidade</label>
              <div className="invalid-feedback d-block">
                {errors.criticidade?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <Controller
                name="severidade"
                control={control}
                rules={{
                  required: "Campo obrigatório",
                }}
                render={({ field }) => (
                  <select
                    id="severidade"
                    className={`form-control ${
                      errors.severidade ? "is-invalid" : ""
                    }`}
                    {...field}
                    value={field.value}
                  >
                    <option value="">Selecione uma severidade</option>
                    <option value="EXTREMO">EXTREMO</option>
                    <option value="ALTO">ALTO</option>
                    <option value="MÉDIO">MÉDIO</option>
                    <option value="BAIXO">BAIXO</option>
                  </select>
                )}
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
                {...register("consequencia")}
                rows={10}
              />
              <label htmlFor="consequencia">Consequência</label>
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
                {...register("tratamento")}
                rows={10}
              />
              <label htmlFor="tratamento">Tratamento</label>
              <div className="invalid-feedback d-block">
                {errors.tratamento?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <input
                type="text"
                className={`form-control`}
                id="impacto-financeiro"
                placeholder="Impacto Financeiro"
                {...register("impactoFinanceiro", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="impacto-financeiro">Impacto Financeiro</label>
              <div className="invalid-feedback d-block">
                {errors.impactoFinanceiro?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <textarea
                className={`form-control ${
                  errors.planoContingencia ? "is-invalid" : ""
                }`}
                id="planoContingencia"
                placeholder="Descreva o plano de contingência"
                {...register("planoContingencia")}
                rows={10}
              />
              <label htmlFor="planoContingencia">Plano de contingência</label>
              <div className="invalid-feedback d-block">
                {errors.planoContingencia?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <input
                type="text"
                className={`form-control`}
                id="responsavel-risco"
                placeholder="Responsável pelo Risco"
                {...register("responsavelRisco", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="responsavel-risco">Responsável pelo Risco</label>
              <div className="invalid-feedback d-block">
                {errors.responsavelRisco?.message}
              </div>
            </div>
            <div className="element-input-group form-floating">
              <input
                type="text"
                className={`form-control`}
                id="responsavel-conjunto"
                placeholder="Responsável pelo Conjunto"
                {...register("responsavelConjunto", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="responsavel-conjunto">
                Responsável pelo conjunto
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
