import Papa from "papaparse";
import { toast } from "sonner";

type CSVValue = string | number | boolean | null | undefined;

export const generateCSV = (
  headers: string[],
  data: CSVValue[][],
  filename: string
) => {
  if (!data || data.length === 0) {
    toast.error("No hay datos para exportar.");
    return null;
  }

  const csv = Papa.unparse(
    {
      fields: headers,
      data
    },
    {
      delimiter: ",",
      quotes: true,
      skipEmptyLines: true
    }
  );

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${new Date()
    .toISOString()
    .split("T")[0]}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
