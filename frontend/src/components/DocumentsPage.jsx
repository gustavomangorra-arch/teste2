import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  FileText,
  Search,
  Filter,
  ArrowRight,
  Lightbulb,
  BarChart3,
  Palette,
  Target,
  CheckCircle,
  MessageSquare,
  Rocket,
} from "lucide-react";
import { documentService, utils } from "@/services/api";

const STEP_META = {
  "contexto-problema": { title: "Definicao do Problema", icon: Target, color: "from-blue-500 to-purple-600" },
  discovery: { title: "Discovery", icon: Lightbulb, color: "from-green-500 to-teal-600" },
  "swot-csd": { title: "SWOT & CSD", icon: BarChart3, color: "from-yellow-500 to-orange-600" },
  personas: { title: "Personas", icon: MessageSquare, color: "from-orange-500 to-pink-500" },
  "pesquisa-usuarios": { title: "Pesquisa de Usuario", icon: Search, color: "from-pink-500 to-red-600" },
  "validacao-hipoteses": { title: "Validacao de Hipoteses", icon: CheckCircle, color: "from-purple-500 to-pink-600" },
  "features-priorizacao": { title: "Features e Priorizacao", icon: Palette, color: "from-indigo-500 to-blue-600" },
  "user-stories-fluxos": { title: "User Stories e Fluxos", icon: FileText, color: "from-red-500 to-orange-500" },
  "criterios-metricas": { title: "Criterios e Metricas", icon: Target, color: "from-cyan-500 to-blue-500" },
  "roadmap-backlog": { title: "Roadmap & Backlog", icon: BarChart3, color: "from-red-500 to-pink-600" },
  prototipo: { title: "Prototipo", icon: Palette, color: "from-teal-500 to-emerald-600" },
  "prd-final": { title: "PRD Final", icon: FileText, color: "from-gray-500 to-gray-600" },
  lancamento: { title: "Lancamento", icon: Rocket, color: "from-red-500 to-pink-600" },
};

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await documentService.getDocuments({ limit: 200, search: search || undefined });
      const items = response.data?.data || response.data || [];
      setDocuments(items);
      if (!selectedStep && items.length) {
        setSelectedStep(items[0].etapa);
      }
      setError(null);
    } catch (err) {
      setError(utils?.formatApiError ? utils.formatApiError(err) : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const grouped = useMemo(() => {
    return documents.reduce((acc, doc) => {
      const step = doc.etapa || "sem-etapa";
      acc[step] = acc[step] || [];
      acc[step].push(doc);
      return acc;
    }, {});
  }, [documents]);

  const stepCards = useMemo(() => {
    return Object.entries(grouped).map(([step, docs]) => {
      const meta = STEP_META[step] || { title: step, icon: FileText, color: "from-gray-500 to-gray-600" };
      return {
        id: step,
        title: meta.title,
        icon: meta.icon,
        color: meta.color,
        count: docs.length,
      };
    });
  }, [grouped]);

  const filteredDocs = useMemo(() => {
    const docs = selectedStep ? grouped[selectedStep] || [] : documents;
    if (!search) return docs;
    return docs.filter((doc) => doc.titulo?.toLowerCase().includes(search.toLowerCase()));
  }, [documents, grouped, search, selectedStep]);

  const totalDocuments = documents.length;

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDocuments();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Documentos</h1>
          <p className="text-sm text-gray-600">Dados carregados diretamente do backend</p>
        </div>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                className="pl-9 h-9"
                placeholder="Buscar por titulo"
                value={search}
                onChange={handleSearch}
              />
            </div>
            <Button type="submit" className="h-9">Filtrar</Button>
          </form>
          <Button variant="outline" className="h-9" onClick={loadDocuments}>
            <Filter className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
      )}

      <Card className="bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Resumo</CardTitle>
            <CardDescription>Visao geral dos documentos no banco</CardDescription>
          </div>
          <Badge variant="secondary">{totalDocuments} documento(s)</Badge>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-gray-600">Carregando documentos...</div>
          ) : stepCards.length === 0 ? (
            <div className="text-gray-600">Nenhum documento encontrado.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {stepCards.map((step) => {
                const Icon = step.icon;
                const isActive = selectedStep === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setSelectedStep(step.id)}
                    className={`text-left p-4 rounded-xl border transition shadow-sm bg-gradient-to-br ${step.color} ${
                      isActive ? "ring-2 ring-offset-2 ring-indigo-500" : ""} text-white`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-semibold">{step.title}</span>
                      </div>
                      <Badge className="bg-white/20 text-white" variant="secondary">
                        {step.count}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Documentos da etapa</CardTitle>
              <CardDescription>
                {selectedStep ? STEP_META[selectedStep]?.title || selectedStep : "Selecione uma etapa para filtrar"}
              </CardDescription>
            </div>
            <Badge variant="secondary">{filteredDocs.length} resultado(s)</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="text-gray-600">Carregando documentos...</div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-gray-600">Nenhum documento nesta etapa.</div>
          ) : (
            filteredDocs.map((doc) => {
              const meta = STEP_META[doc.etapa] || {};
              const Icon = meta.icon || FileText;
              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{doc.titulo}</p>
                      <p className="text-xs text-gray-500">{doc.status || "rascunho"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {doc.project?.nome && <Badge variant="outline">{doc.project.nome}</Badge>}
                    <span>{doc.formato || "markdown"}</span>
                    {doc.updated_at && <span>{new Date(doc.updated_at).toLocaleDateString()}</span>}
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      Ver
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsPage;
