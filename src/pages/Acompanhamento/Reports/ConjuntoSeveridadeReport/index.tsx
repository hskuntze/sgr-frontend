import { ApexOptions } from "apexcharts";
import { AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { toast } from "react-toastify";
import { ConjuntoSeveridade } from "types/relatorio/conjuntoseveridade";
import { requestBackend } from "utils/requests";

import "./styles.css";

const ConjuntoSeveridadeReport = () => {
  const [data, setData] = useState<ConjuntoSeveridade[]>([]);

  const loadData = useCallback(() => {
    const requestParams: AxiosRequestConfig = {
      url: "/identificacaoriscos/reports/conjuntoSeveridade",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as ConjuntoSeveridade[]);
      })
      .catch(() => {
        toast.error("Erro ao carregar dados de acompanhamento.");
      })
      .finally(() => {});
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="severity-column-chart">
      {data.map((item) => {
        const options: ApexOptions = {
          chart: {
            type: "bar",
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "35%",
            },
          },
          colors: ["#9DD755", "#F7F823", "#FCC916", "#F8222B", "#7AA4D6"],
          xaxis: {
            categories: ["Baixo", "Médio", "Alto", "Extremo", "Total"],
            labels: {
              show: true,
            },
          },
          yaxis: {
            title: {
              text: "Quantidade",
            },
          },
          tooltip: {
            y: {
              formatter: (val: number) => `${val} registros`,
            },
          },
        };

        const series = [
          {
            name: "Criticidade (Severidade)",
            data: [
              {
                x: "Baixo",
                y: item.baixo,
                fillColor: "#9BCE71",
              },
              {
                x: "Médio",
                y: item.medio,
                fillColor: "#F5FA12",
              },
              {
                x: "Alto",
                y: item.alto,
                fillColor: "#F2BF27",
              },
              {
                x: "Extremo",
                y: item.extremo,
                fillColor: "#F22222",
              },
              {
                x: "Total",
                y: item.total,
                fillColor: "#6A92C7",
              },
            ],
          },
        ];

        return (
          <div
            key={item.conjunto}
            style={{ width: "400px", textAlign: "center" }}
          >
            <h4>{item.conjunto}</h4>
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={300}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ConjuntoSeveridadeReport;
