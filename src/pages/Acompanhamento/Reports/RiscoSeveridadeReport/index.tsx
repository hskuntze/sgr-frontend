import { ApexOptions } from "apexcharts";
import { AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { toast } from "react-toastify";
import { RiscoSeveridade } from "types/relatorio/riscoseveridade";
import { requestBackend } from "utils/requests";

import "./styles.css";

const RiscoSeveridadeReport = () => {
  const [data, setData] = useState<RiscoSeveridade[]>([]);

  const loadData = useCallback(() => {
    const requestParams: AxiosRequestConfig = {
      url: "/identificacaoriscos/reports/riscoSeveridade",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setData(res.data as RiscoSeveridade[]);
      })
      .catch((err) => {
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
            type: "donut",
          },
          plotOptions: {
            pie: {
              expandOnClick: false,
              donut: {
                labels: {
                  show: true,
                  value: {
                    formatter: (val) => {
                      return `${val}`;
                    },
                  },
                  total: {
                    show: true,
                    formatter: () => {
                      return `${
                        item.baixo + item.medio + item.alto + item.extremo
                      }`;
                    },
                  },
                },
              },
            },
          },
          colors: ["#9DD755", "#F7F823", "#FCC916", "#F8222B"],
          labels: ["Baixo", "Médio", "Alto", "Extremo"],
          tooltip: {
            y: {
              formatter: (val: number) => {
                return `${val}`;
              },
            },
          },
        };

        const series = [item.baixo, item.medio, item.alto, item.extremo];

        return (
          <div key={item.risco} style={{ width: "400px", textAlign: "center" }}>
            <h5>{item.risco}</h5>
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height={300}
            />
          </div>
        );
      })}
    </div>
  );
};

export default RiscoSeveridadeReport;
