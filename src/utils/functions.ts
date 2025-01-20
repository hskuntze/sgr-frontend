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

/**
 * Função que formata o perfil do usuário
 * @param perfil
 * @returns
 */
export const formatarPerfil = (perfil: string) => {
  const perfis: { [key: string]: string } = {
    PERFIL_ADMIN: "Administrador",
    PERFIL_USER: "Usuário",
  };

  return perfis[perfil];
};
