import { FileTextIcon } from "lucide-react";
import { envs } from "@/config/envs";
import { getFilePreviewMeta } from "@/lib";

type Props = {
  path: string;
};

export const FilePreviewCard = ({ path }: Props) => {
  const fileName = path.split("/").pop() ?? "";
  const meta = getFilePreviewMeta(path);

  const isImage = meta.type === "image";

  return (
    <div className="bg-muted rounded-lg p-3 flex flex-col items-center justify-center group transition-shadow hover:shadow-lg">
      <a
        href={`${envs.api}/${path}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center w-full"
      >
        <div className="rounded-lg flex items-center justify-center w-24 h-32 mb-2 border border-gray-200 shadow-sm overflow-hidden">
          {isImage ? (
            <img
              className="rounded-md border object-cover w-24 h-32 shadow transition-transform duration-200 group-hover:scale-105"
              src={`${envs.api}/${path}`}
              alt={`Soporte de Cotización ${fileName}`}
            />
          ) : (
            <FileTextIcon
              className={`h-10 w-10 mb-1 ${
                meta.color || "text-gray-500"
              }`}
            />
          )}
        </div>

        <span
          className={`text-xs font-medium truncate max-w-[88px] text-center mb-1 ${meta.color}`}
        >
          {fileName}
        </span>

        <span className="text-xs underline dark:text-foreground">
          Ver {meta.label}
        </span>
      </a>
    </div>
  );
};
