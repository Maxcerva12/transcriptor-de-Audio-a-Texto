"use client";

import { useState, useRef } from "react";
import { Mic, Volume2, AlertCircle, CheckCircle, X, ArrowDown, FileAudio, Info, Globe } from "lucide-react";
import {
  FileDropzone,
  ProgressBar,
  TranscriptionOptions,
  TranscriptionResult,
  Header,
  Footer,
  Hero,
  Section
} from "@/components";
import { TranscriptionService } from "@/services/transcription";
import { TranscriptionState, TranscriptionRequest } from "@/types";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [transcriptionState, setTranscriptionState] =
    useState<TranscriptionState>({
      isTranscribing: false,
      progress: null,
      result: null,
      error: null,
    });

  const [options, setOptions] = useState({
    model: "base" as string,
    language: "auto" as string,
    task: "transcribe" as "transcribe" | "translate",
  });
  
  // Refs para desplazamiento
  const fileUploadSectionRef = useRef<HTMLDivElement>(null);
  const comoFuncionaRef = useRef<HTMLDivElement>(null);
  const caracteristicasRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setTranscriptionState((prev) => ({
      ...prev,
      result: null,
      error: null,
    }));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setTranscriptionState({
      isTranscribing: false,
      progress: null,
      result: null,
      error: null,
    });
  };

  const handleTranscribe = async () => {
    if (!selectedFile) return;

    const taskId = TranscriptionService.generateTaskId();
    setCurrentTaskId(taskId);

    setTranscriptionState((prev) => ({
      ...prev,
      isTranscribing: true,
      progress: { loaded: 0, total: 0, percentage: 0 },
      result: null,
      error: null,
    }));

    try {
      const result = await TranscriptionService.transcribeAudio(
        selectedFile,
        options,
        (progress) => {
          setTranscriptionState((prev) => ({
            ...prev,
            progress,
          }));
        },
        taskId
      );

      setTranscriptionState((prev) => ({
        ...prev,
        isTranscribing: false,
        result,
        progress: null,
      }));
      
      setCurrentTaskId(null);
      
      toast.success("¡Transcripción completada exitosamente!", {
        description: "Tu audio ha sido transcrito correctamente."
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      
      if (errorMessage.includes("cancelada") || errorMessage.includes("cancelled")) {
        console.log("Transcripción cancelada correctamente");
        setTranscriptionState((prev) => ({
          ...prev,
          isTranscribing: false,
          error: null,
          progress: null,
        }));
        setCurrentTaskId(null);
        return;
      }
      
      setTranscriptionState((prev) => ({
        ...prev,
        isTranscribing: false,
        error: errorMessage,
        progress: null,
      }));
      setCurrentTaskId(null);
      
      toast.error("Error en la transcripción", {
        description: errorMessage
      });
    }
  };

  const handleCancelTranscription = async () => {
    if (!currentTaskId) {
      console.warn("No hay task_id para cancelar");
      return;
    }

    try {
      console.log(`Intentando cancelar transcripción con ID: ${currentTaskId}`);
      await TranscriptionService.cancelTranscription(currentTaskId);
      
      setTranscriptionState((prev) => ({
        ...prev,
        isTranscribing: false,
        error: null,
        progress: null,
        result: null,
      }));
      
      setCurrentTaskId(null);
      console.log("Transcripción cancelada exitosamente");
      
      toast.info("Transcripción cancelada", {
        description: "Has cancelado la transcripción en curso."
      });
      
    } catch (error) {
      console.error("Error cancelando transcripción:", error);
      
      setTranscriptionState((prev) => ({
        ...prev,
        isTranscribing: false,
        error: null,
        progress: null,
      }));
      
      setCurrentTaskId(null);
    }
  };

  const handleNewTranscription = () => {
    setSelectedFile(null);
    setTranscriptionState({
      isTranscribing: false,
      progress: null,
      result: null,
      error: null,
    });
  };
  
  const scrollToFileUpload = () => {
    if (fileUploadSectionRef.current) {
      fileUploadSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const scrollToComoFunciona = () => {
    const element = document.getElementById('como-funciona');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const scrollToCaracteristicas = () => {
    const element = document.getElementById('caracteristicas');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster position="top-center" />
      <Header 
        onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onHowItWorksClick={scrollToComoFunciona}
        onFeaturesClick={scrollToCaracteristicas}
      />

      {!transcriptionState.result && !transcriptionState.isTranscribing && !selectedFile && (
        <Hero 
          onGetStartedClick={scrollToFileUpload}
          onHowItWorksClick={scrollToComoFunciona}
        />
      )}
      
      {/* Main Content */}
      <main className="flex-grow">
        {/* File Upload Section */}
        <Section 
          id="transcription" 
          color={selectedFile ? "default" : "muted"}
          className="scroll-mt-20"
        >
          <div ref={fileUploadSectionRef} className="max-w-3xl mx-auto">
            {/* Título de sección */}
            <div className="text-center mb-8">
              {!selectedFile && !transcriptionState.result && (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Comienza tu transcripción ahora
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Sube tu archivo de audio y deja que la IA haga el trabajo
                  </p>
                </>
              )}
              
              {selectedFile && !transcriptionState.result && (
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-4">
                  <FileAudio className="w-4 h-4 mr-2" /> 
                  Archivo listo para transcribir
                </div>
              )}
            </div>

            {/* File Upload Box */}
            {!transcriptionState.result && (
              <Card className="border-2 shadow-md mb-6">
                <CardHeader className={selectedFile ? "pb-0" : ""}>
                  <CardTitle className="flex items-center">
                    <FileAudio className="w-5 h-5 mr-2 text-primary" />
                    Sube tu archivo de audio
                  </CardTitle>
                  {!selectedFile && (
                    <CardDescription>
                      Formatos soportados: MP3, WAV, FLAC, M4A, OGG, WMA, AAC (máx. 100MB)
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-4">
                  <FileDropzone
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                    onRemoveFile={handleRemoveFile}
                    disabled={transcriptionState.isTranscribing}
                  />
                </CardContent>
              </Card>
            )}

            {/* Alerta informativa */}
            {!selectedFile && !transcriptionState.result && (
              <Alert variant="default" className="bg-muted/50 border-muted mb-6">
                <Info className="h-4 w-4 text-primary" />
                <AlertDescription className="text-sm text-muted-foreground">
                  Todos los archivos son procesados de forma segura y eliminados 
                  automáticamente después de la transcripción. No se almacenan 
                  permanentemente tus datos.
                </AlertDescription>
              </Alert>
            )}

          {/* Options */}
            {selectedFile && !transcriptionState.result && (
              <div className="mt-6">
                <TranscriptionOptions
                  options={options}
                  onOptionsChange={setOptions}
                  disabled={transcriptionState.isTranscribing}
                />
              </div>
            )}

            {/* Action Button */}
            {selectedFile && !transcriptionState.isTranscribing && !transcriptionState.result && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleTranscribe}
                  className="px-8 py-6 text-lg shadow-lg"
                  size="lg"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Transcribir Audio
                </Button>
              </div>
            )}
          </div>
        </Section>

        {/* Sección de Cómo Funciona */}
        {!selectedFile && !transcriptionState.result && !transcriptionState.isTranscribing && (
          <Section id="como-funciona" color="accent" className="scroll-mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Cómo funciona
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Transcribir audio nunca fue tan fácil. Nuestro proceso simplificado
                convierte tus archivos de audio en texto de alta calidad en pocos pasos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Sube tu archivo",
                  description: "Arrastra y suelta cualquier archivo de audio o selecciónalo desde tu dispositivo.",
                  icon: <FileAudio className="w-5 h-5 text-primary" />
                },
                {
                  step: "2",
                  title: "Configura opciones",
                  description: "Selecciona el idioma y el modelo de transcripción según tus necesidades.",
                  icon: <Info className="w-5 h-5 text-primary" />
                },
                {
                  step: "3",
                  title: "Recibe el resultado",
                  description: "Obtén una transcripción precisa, descárgala o cópiala fácilmente.",
                  icon: <CheckCircle className="w-5 h-5 text-primary" />
                }
              ].map((step, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-x-6 -translate-y-6"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {step.step}
                  </div>
                  <CardHeader>
                    <div className="p-3 bg-primary/10 rounded-lg w-fit">
                      {step.icon}
                    </div>
                    <CardTitle className="mt-4">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {/* Características */}
        {!selectedFile && !transcriptionState.result && !transcriptionState.isTranscribing && (
          <Section id="caracteristicas" className="scroll-mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Características
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Nuestra herramienta de transcripción utiliza lo último en tecnología de IA para ofrecerte resultados superiores.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Múltiples idiomas",
                  description: "Soporte para más de 30 idiomas con detección automática del idioma hablado.",
                  icon: <Globe className="w-5 h-5" />
                },
                {
                  title: "Privacidad garantizada",
                  description: "Tus archivos se procesan de manera segura y no se almacenan permanentemente.",
                  icon: <Info className="w-5 h-5" />
                },
                {
                  title: "Precisión excepcional",
                  description: "Tecnología OpenAI Whisper con reconocimiento líder en la industria.",
                  icon: <CheckCircle className="w-5 h-5" />
                },
                {
                  title: "Totalmente gratuito",
                  description: "Sin límites de uso, registros ni restricciones ocultas.",
                  icon: <Mic className="w-5 h-5" />
                },
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="border bg-card rounded-lg p-6 flex items-start space-x-4 hover:shadow-md transition-shadow"
                >
                  <div className="rounded-full bg-primary/10 p-3 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}


        {/* Progress */}
        {transcriptionState.isTranscribing && (
          <Section>
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Transcribiendo Audio...
                  </h3>
                  
                  {/* Botón de cancelar */}
                  <button
                    onClick={() => {
                      console.log("Botón de cancelar presionado, currentTaskId:", currentTaskId);
                      handleCancelTranscription();
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-200 border border-destructive/20 hover:border-destructive/30"
                    title="Cancelar transcripción"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                </div>

                {transcriptionState.progress && (
                  <div className="space-y-4">
                    <ProgressBar
                      progress={transcriptionState.progress.percentage}
                      label="Subiendo archivo..."
                      showPercentage={true}
                    />

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <span>
                        {transcriptionState.progress.percentage < 100
                          ? "Subiendo archivo..."
                          : `Procesando audio con Whisper (modelo: ${options.model})...`}
                      </span>
                    </div>
                    
                    {/* Tiempo estimado */}
                    <div className="text-xs text-gray-500">
                      Tiempo estimado: ~{(() => {
                        const times: Record<string, number> = {
                          tiny: 3, base: 5, small: 8, medium: 12,
                          "large-v1": 16, "large-v2": 18, "large-v3": 20,
                          large: 22, turbo: 10
                        };
                        return times[options.model] || 5;
                      })()} minutos
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>
        )}

        {/* Error */}
        {transcriptionState.error && (
          <Section>
            <div className="max-w-3xl mx-auto">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      Error en la transcripción
                    </p>
                    <p className="mt-1 text-sm text-red-700">
                      {transcriptionState.error}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* Result */}
        {transcriptionState.result && (
          <Section>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-lg">
                <div className="flex">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-foreground">
                      ¡Transcripción completada exitosamente!
                    </p>
                  </div>
                </div>
              </div>

              <TranscriptionResult
                result={transcriptionState.result}
                fileName={selectedFile?.name}
              />

              <div className="flex justify-center">
                <Button
                  onClick={handleNewTranscription}
                  className="px-6 py-3"
                >
                  Nueva Transcripción
                </Button>
              </div>
            </div>
          </Section>
        )}
      </main>

      <Footer />
    </div>
  );
}
