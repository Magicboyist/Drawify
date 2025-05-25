
"use client";

import { useState, type ChangeEvent, useRef } from "react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";
import { UploadCloud, Sparkles, Download, AlertCircle, RefreshCw, Palette, X } from "lucide-react";
import { enhanceSketch, type EnhanceSketchInput } from "@/ai/flows/enhance-sketch";

export default function HomePage() {
  const [sketchFile, setSketchFile] = useState<File | null>(null);
  const [sketchPreviewUrl, setSketchPreviewUrl] = useState<string | null>(null);
  const [styleDescription, setStyleDescription] = useState<string>("");
  const [generatedIllustrationUrl, setGeneratedIllustrationUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSketchFile(file);
      setError(null);
      setGeneratedIllustrationUrl(null); // Clear previous generation
      const reader = new FileReader();
      reader.onloadend = () => {
        setSketchPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhanceSketch = async () => {
    if (!sketchPreviewUrl) {
      setError("Lütfen önce bir çizim yükleyin.");
      return;
    }
    setIsLoading(true);
    setError(null);
    // setGeneratedIllustrationUrl(null); // Optionally clear previous illustration while new one loads

    try {
      const input: EnhanceSketchInput = {
        sketchDataUri: sketchPreviewUrl,
        styleDescription: styleDescription || undefined,
      };
      const result = await enhanceSketch(input);
      if (result.enhancedIllustrationDataUri) {
        setGeneratedIllustrationUrl(result.enhancedIllustrationDataUri);
      } else {
        setError("Yapay zeka bir çizim oluşturamadı. Lütfen tekrar deneyin.");
      }
    } catch (e: any) {
      console.error("AI Enhancement Error:", e);
      setError(`Bir hata oluştu: ${e.message || "Bilinmeyen bir hata."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedIllustrationUrl) return;
    const link = document.createElement("a");
    link.href = generatedIllustrationUrl;
    const fileName = "cizim";
    link.download = `donusturulen_${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setSketchFile(null);
    setSketchPreviewUrl(null);
    setGeneratedIllustrationUrl(null);
    setStyleDescription("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 space-y-3">
        <div className="text-center pt-4 pb-2 md:pt-6 md:pb-3">
           <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            <span className="block">Drawify ile Tanışın</span>
            <span className="block text-primary">Çizimlerinizi Hayata Geçirin</span>
          </h1>
          <p className="mt-2 max-w-md mx-auto text-xs text-muted-foreground sm:text-sm md:mt-3 md:text-lg md:max-w-2xl">
            El çizimlerinizi yükleyin, isteğe bağlı bir stil belirtin ve yapay zekanın sihrini görün. Saniyeler içinde benzersiz dijital sanat eserleri yaratın!
          </p>
        </div>

        <Card className="shadow-lg rounded-lg overflow-hidden border-border/50">
          <CardHeader className="bg-card-background p-3 md:p-4">
            <CardTitle className="flex items-center gap-1.5 text-base md:text-lg font-semibold">
              <UploadCloud className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              {!sketchPreviewUrl ? "Çiziminizi Yükleyin" : "Çiziminiz Yüklendi"}
            </CardTitle>
            {!sketchPreviewUrl && (
              <CardDescription className="text-xs md:text-sm">
                Başlamak için el çiziminizi yükleyin. Ardından isteğe bağlı olarak bir stil belirtebilirsiniz.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-3 md:p-4 space-y-2.5">
            {!sketchPreviewUrl && (
              <div className="space-y-1.5">
                <Label htmlFor="sketch-upload-area" className="text-xs md:text-sm font-medium">Çizim Alanı</Label>
                <div
                  id="sketch-upload-area"
                  onClick={triggerFileInput}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      const file = e.dataTransfer.files[0];
                      setSketchFile(file);
                      setError(null);
                      setGeneratedIllustrationUrl(null);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setSketchPreviewUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  className="mt-1 flex w-full flex-col justify-center items-center p-4 md:p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary transition-colors duration-300 ease-in-out bg-muted/20 hover:bg-primary/5 aspect-[3/1]"
                >
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                    <p className="text-sm md:text-base text-muted-foreground">
                      <span className="font-semibold text-primary">Dosya seçmek için tıklayın</span> veya sürükleyip bırakın
                    </p>
                    <p className="text-xs text-muted-foreground/80">PNG, JPG, WEBP (Maks. 5MB)</p>
                  </div>
                </div>
                <Input
                  ref={fileInputRef}
                  id="sketch-upload-hidden"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
            
            {sketchPreviewUrl && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs md:text-sm font-medium">Yüklenen Çizim Önizlemesi</Label>
                  <Button variant="outline" size="sm" onClick={handleClear} className="text-xs px-2 py-1 h-auto">
                    <X className="mr-1 h-3 w-3" />
                    Temizle
                  </Button>
                </div>
                <div className="border rounded-lg p-1 bg-muted/30 flex justify-center aspect-square max-w-xs mx-auto shadow-inner">
                  <Image src={sketchPreviewUrl} alt="Yüklenen çizim" width={280} height={280} className="object-contain rounded-md" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="style-description" className="text-xs md:text-sm font-medium flex items-center gap-1">
                <Palette className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary/80" />
                İstediğiniz Stil (İsteğe Bağlı)
              </Label>
              <Textarea
                id="style-description"
                placeholder="Örn: karikatür, sulu boya, siberpunk, van gogh tarzı..."
                value={styleDescription}
                onChange={(e) => setStyleDescription(e.target.value)}
                className="min-h-[60px] md:min-h-[80px] resize-y text-xs md:text-sm py-1.5"
                disabled={!sketchPreviewUrl || isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Çiziminizin hangi sanatsal tarzda dönüştürülmesini istediğinizi buraya yazabilirsiniz. Boş bırakırsanız, yapay zeka genel bir iyileştirme yapacaktır.
              </p>
            </div>

          </CardContent>
          <CardFooter className="p-3 md:p-4 bg-card-background border-t border-border/50">
            <Button
              onClick={handleEnhanceSketch}
              disabled={!sketchFile || isLoading}
              size="sm"
              className="w-full md:w-auto text-xs md:text-sm py-2 px-3 md:py-2 md:px-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <Sparkles className="mr-1 h-3.5 w-3.5 md:h-4 md:w-4" />
              {isLoading && !generatedIllustrationUrl ? "Dönüştürülüyor..." : "Çizimi Dönüştür"}
            </Button>
          </CardFooter>
        </Card>

        {isLoading && <Loader text="Çiziminiz işleniyor, lütfen bekleyin..." size={32} />}

        {error && (
          <Alert variant="destructive" className="shadow-md rounded-lg text-xs md:text-sm p-2.5 md:p-3">
            <AlertCircle className="h-3.5 w-3.5" />
            <AlertTitle className="text-sm md:text-base">Hata!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {generatedIllustrationUrl && (
          <Card className="shadow-lg rounded-lg overflow-hidden border-border/50">
            <CardHeader className="bg-card-background p-3 md:p-4">
              <CardTitle className="flex items-center gap-1.5 text-base md:text-lg font-semibold">
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                Oluşturulan İllüstrasyon
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 flex flex-col items-center gap-1.5">
              <div className="border rounded-lg p-1 bg-muted/30 max-w-full shadow-inner">
                 <img src={generatedIllustrationUrl} alt="Oluşturulan illüstrasyon" className="rounded-md max-w-full h-auto max-h-[45vh] md:max-h-[50vh] object-contain" />
              </div>
            </CardContent>
            <CardFooter className="p-3 md:p-4 bg-card-background border-t border-border/50 flex flex-wrap gap-2 justify-center md:justify-start">
              <Button
                onClick={handleEnhanceSketch}
                disabled={!sketchPreviewUrl || isLoading}
                size="sm"
                variant="outline"
                className="flex-grow md:flex-grow-0 text-xs md:text-sm shadow-sm hover:shadow-md transition-shadow px-2 py-1 h-auto"
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                {isLoading ? "Oluşturuluyor..." : "Tekrar Oluştur"}
              </Button>
              <Button
                onClick={handleDownloadImage}
                disabled={!generatedIllustrationUrl || isLoading}
                size="sm"
                className="flex-grow md:flex-grow-0 text-xs md:text-sm shadow-sm hover:shadow-md transition-shadow px-2 py-1 h-auto"
              >
                <Download className="mr-1 h-3 w-3" />
                İllüstrasyonu İndir
              </Button>
              <Button
                onClick={handleClear}
                disabled={isLoading}
                size="sm"
                variant="ghost"
                className="flex-grow md:flex-grow-0 text-xs md:text-sm text-muted-foreground hover:text-destructive transition-colors px-2 py-1 h-auto"
              >
                <X className="mr-1 h-3 w-3" />
                Temizle
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}

    