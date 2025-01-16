/**
 * Função que recebe uma data (em string) no formato 'yyyy-mm-dd' e formata para 'dd/mm/yyyy'
 * @param date - String
 * @returns String formatada
 */
export const formatarData = (date: string) => {
  if (date) {
    const [year, month, day] = date.split("-"); // Divide a string em ano, mês e dia
    return `${day}/${month}/${year}`;
  } else {
    return "";
  }
};
