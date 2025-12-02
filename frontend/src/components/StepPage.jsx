import { useEffect, useState } from "react";
import AIChatWizard from "./AIChatWizard";
import { documentService, utils } from "@/services/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const THEME_PRESETS = {
  "contexto-problema": {
    gradientFrom: "#e0f2fe",
    gradientTo: "#bae6fd",
    headerIcon: "lightbulb",
    iconBg: "from-sky-500 to-blue-500",
  },
  discovery: {
    gradientFrom: "#ede9fe",
    gradientTo: "#ddd6fe",
    headerIcon: "trend",
    iconBg: "from-indigo-500 to-purple-500",
  },
};

const INFO_PRESETS = {
  "contexto-problema": [
    {
      icon: "lightbulb",
      title: "Checklist de Contexto",
      items: [
        { label: "Mercado", value: "Segmento, publico e oportunidade" },
        { label: "Problema", value: "Dor observada e impacto" },
        { label: "Evidencias", value: "Dados, pesquisas e entrevistas" },
      ],
    },
  ],
  discovery: [
    {
      icon: "trend",
      title: "Hipoteses iniciais",
      items: [
        { label: "Suposicao", value: "O que acreditamos ser verdade" },
        { label: "Confirmacao", value: "Dados que precisamos coletar" },
        { label: "Risco", value: "O que acontece se estiver errado" },
      ],
    },
  ],
};

const StepPage = ({ stepData, onAdvanceStep }) => {
  const theme = stepData.theme || THEME_PRESETS[stepData.id];
  const infoBlocks = stepData.infoBlocks || INFO_PRESETS[stepData.id];

  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [docError, setDocError] = useState(null);
  const [projectId, setProjectId] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("genesix_project_id") || stepData.projectId || ""
      : ""
  );

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepData.id, projectId]);

  const loadDocuments = async () => {
    setIsLoadingDocs(true);
    try {
      const response = await documentService.getDocuments({
        etapa: stepData.id,
        ...(projectId ? { project_id: projectId } : {}),
        limit: 50,
      });
      setDocuments(response.data?.data || response.data || []);
      setDocError(null);
    } catch (err) {
      setDocError(utils?.formatApiError ? utils.formatApiError(err) : err.message);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const handleProjectChange = (value) => {
    setProjectId(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("genesix_project_id", value);
    }
  };

  const handleCreateDocument = async (content) => {
    if (!projectId) {
      throw new Error("Defina o ID do projeto para salvar o documento.");
    }

    await documentService.createDocument({
      project_id: projectId,
      titulo: `Documento de ${stepData.title}`,
      etapa: stepData.id,
      conteudo: content,
      formato: "markdown",
    });

    await loadDocuments();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Projeto (UUID)</span>
          <Input
            value={projectId}
            onChange={(e) => handleProjectChange(e.target.value)}
            placeholder="Informe o ID do projeto para salvar documentos"
            className="w-80"
          />
        </div>
        <Button variant="outline" onClick={loadDocuments} className="mt-5 h-9">
          Recarregar documentos
        </Button>
      </div>

      <AIChatWizard
        title={stepData.title}
        description={stepData.description}
        placeholder={stepData.placeholder}
        iaMessage={stepData.iaMessage}
        tasks={stepData.tasks}
        insights={stepData.insights}
        documents={documents}
        infoBlocks={infoBlocks}
        theme={theme}
        onAdvanceStep={onAdvanceStep}
        isLoadingDocuments={isLoadingDocs}
        documentsError={docError}
        onGenerateDocument={handleCreateDocument}
        projectId={projectId}
      />
    </div>
  );
};

export default StepPage;
