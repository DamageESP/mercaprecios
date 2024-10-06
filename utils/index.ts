// Format date in format DD/MM/YYYY
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("es-ES");
};

export const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};
