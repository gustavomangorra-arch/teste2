import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Lightbulb,
  MessageSquare,
  RefreshCcw,
  Send,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

const ICON_MAP = {
  trend: TrendingUp,
  lightbulb: Lightbulb,
  target: Target,
  alert: AlertTriangle,
  message: MessageSquare,
  users: Users,
  file: FileText,
};

const DEFAULT_THEME = {
  gradientFrom: "#ede9fe",
  gradientTo: "#f5d0fe",
  tagColor: "text-purple-600",
  accent: "bg-purple-500",
  border: "border-purple-100",
  iconBg: "from-purple-500 to-pink-500",
  iconColor: "text-white",
  headerIcon: "users",
};

const normalizeTasks = (tasks = []) =>
  tasks.map((task, index) => ({
    id: task.id ?? index + 1,
    text: task.text ?? task,
    completed: Boolean(task.completed),
  }));

const AIChatWizard = ({
  title,
  description,
  placeholder = "Descreva os pontos que a IA precisa considerar...",
  iaMessage = "Compartilhe detalhes sobre esta etapa para que eu possa gerar um documento completo.",
  tasks = [],
  insights = [],
  documents = [],
  infoBlocks = [],
  theme = DEFAULT_THEME,
  onAdvanceStep,
  onGenerateDocument,
  isLoadingDocuments = false,
  documentsError = null,
  projectId,
}) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [generatedDocument, setGeneratedDocument] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskList, setTaskList] = useState(() => normalizeTasks(tasks));

  useEffect(() => {
    setTaskList(normalizeTasks(tasks));
  }, [tasks, title]);

  useEffect(() => {
    setMessages([
      {
        id: "ia-intro",
        sender: "IA",
        text: iaMessage,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setGeneratedDocument(null);
    setInputMessage("");
  }, [iaMessage, title]);

  const hasInsights = insights && insights.length > 0;
  const hasInfoBlocks = infoBlocks && infoBlocks.length > 0;

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userInput = inputMessage.trim();
    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: userInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    if (!onGenerateDocument) return;

    setIsGenerating(true);
    try {
      await onGenerateDocument(userInput);
      const confirmation = {
        id: Date.now() + 1,
        sender: "IA",
        text: "Documento salvo no backend. Ajuste ou envie novos pontos para gerar outra versao.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, confirmation]);
      setGeneratedDocument({
        title: `Documento de ${title}`,
        content: userInput,
        status: "saved",
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "IA",
          text: error?.message || "Nao foi possivel salvar o documento.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTaskToggle = (taskId) => {
    setTaskList((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const HeaderIcon = ICON_MAP[theme.headerIcon] || ICON_MAP.users;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-purple-500 font-semibold mb-1">
              Etapa do Fluxo
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="text-gray-600 mt-1 max-w-2xl">{description}</p>
            {projectId ? (
              <p className="text-xs text-green-700 mt-1">Projeto ativo: {projectId}</p>
            ) : (
              <p className="text-xs text-amber-700 mt-1">Informe o projeto para salvar documentos.</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${theme.iconBg} flex items-center justify-center`}>
              {HeaderIcon && <HeaderIcon className={`w-6 h-6 ${theme.iconColor}`} />}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-sm border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                  Chat com a IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-2xl border ${
                        message.sender === "IA"
                          ? "bg-purple-50 border-purple-100"
                          : "bg-white border-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700">
                          {message.sender === "IA" ? "IA GenesiX" : "Voce"}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {message.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {message.text}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <Textarea
                      placeholder={placeholder}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="min-h-28 pr-20"
                      disabled={isGenerating}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="absolute right-2 bottom-2 h-10"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <RefreshCcw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    A mensagem sera enviada para o backend. Cada envio salva um rascunho para esta etapa.
                  </p>
                </div>
              </CardContent>
            </Card>

            {generatedDocument && (
              <Card className="shadow-sm border border-green-100 bg-green-50/60">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" /> Documento salvo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-800">
                  <p className="font-semibold">{generatedDocument.title}</p>
                  <div className="p-3 bg-white rounded-lg border border-green-100 whitespace-pre-wrap">
                    {generatedDocument.content}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <Card
              className="shadow-sm border-none"
              style={{
                background: "white",
                boxShadow: "0 15px 40px rgba(15, 23, 42, 0.08)",
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Progresso
                </CardTitle>
                <p className="text-xs text-gray-500">Tarefas da etapa</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="rounded-full h-2 transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
                      width: `${
                        Math.round((taskList.filter((t) => t.completed).length / (taskList.length || 1)) * 100) || 0
                      }%`,
                    }}
                  />
                </div>
                {taskList.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between px-3 py-2 border border-gray-100 rounded-xl bg-white"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => handleTaskToggle(task.id)}
                      />
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`text-sm ${
                          task.completed
                            ? "line-through text-gray-400"
                            : "text-gray-800"
                        }`}
                      >
                        {task.text}
                      </label>
                    </div>
                  </div>
                ))}
                <div className="flex items-center text-xs text-gray-500 border rounded-xl px-3 py-2 bg-rose-50 border-rose-100">
                  <AlertTriangle className="w-4 h-4 mr-2 text-rose-500" />
                  {taskList.filter((t) => !t.completed).length} tarefa(s) restante(s)
                </div>
              </CardContent>
            </Card>

            {hasInfoBlocks && (
              <div className="grid grid-cols-1 gap-3">
                {infoBlocks.map((block, index) => {
                  const Icon = ICON_MAP[block.icon] || ICON_MAP.lightbulb;
                  return (
                    <Card key={`${block.title}-${index}`} className="shadow-sm">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-lg"
                            style={{
                              background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
                            }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <h4 className="font-semibold text-gray-900">
                            {block.title}
                          </h4>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {block.items?.map((item, idx) => (
                            <p key={idx}>
                              <span className="font-semibold">{item.label}: </span>
                              {item.value}
                            </p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hasInsights ? (
                  insights.map((insight, index) => {
                    const Icon = ICON_MAP[insight.icon] || ICON_MAP.lightbulb;
                    return (
                      <div
                        key={`${insight.title}-${index}`}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-start space-x-2">
                          <Icon className="w-4 h-4 mt-0.5 text-purple-600" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-0.5">
                              {insight.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">Nenhum insight registrado para esta etapa.</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                  Documentos da etapa
                </CardTitle>
                {documentsError && (
                  <p className="text-xs text-red-600">{documentsError}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {isLoadingDocuments ? (
                  <p className="text-sm text-gray-500">Carregando documentos...</p>
                ) : documents.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum documento salvo para esta etapa.</p>
                ) : (
                  documents.map((doc, index) => (
                    <div
                      key={`${doc.id || doc.name}-${index}`}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {doc.titulo || doc.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doc.status || "rascunho"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">ID: {doc.id || "sem id"}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatWizard;


