"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle, XCircle, Loader2, Building2, User } from "lucide-react";
import { API_CONFIG } from "@/app/lib/api/config";

interface ExtractedData {
  immeuble: {
    adresse: string | null;
    identifiant: string | null;
  };
  prestataire: {
    nom: string | null;
    contact: string | null;
  };
  reserves: Array<{
    description: string | null;
    page: number | null;
    niveau: string;
    type: string | null;
    dateDetection: string | null;
  }>;
}

interface UploadResponse {
  success: boolean;
  message: string;
  report_id: number;
  extracted_data: ExtractedData;
  linked_site_id?: number;
  linked_provider_id?: number;
  error?: string;
}

export default function PdfUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Veuillez sélectionner un fichier PDF");
        setFile(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("Le fichier est trop volumineux (max 10 MB)");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/reports/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Erreur lors de l'upload");
      }

      setResult(data);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setUploading(false);
    }
  };

  const getSeverityColor = (niveau: string) => {
    switch (niveau.toLowerCase()) {
      case "critique":
        return "bg-red-100 text-red-800 border-red-300";
      case "modéré":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "faible":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Import de Rapport PDF
          </h1>
          <p className="text-gray-600 mb-8">
            Importez un rapport PDF pour extraire automatiquement les informations
            sur l'immeuble, le prestataire et les réserves.
          </p>

          {/* Zone d'upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
              disabled={uploading}
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <span className="text-lg font-medium text-gray-700 mb-2">
                {file ? file.name : "Cliquez pour sélectionner un fichier PDF"}
              </span>
              <span className="text-sm text-gray-500">
                Taille maximale : 10 MB
              </span>
            </label>
          </div>

          {/* Bouton d'upload */}
          {file && !result && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Extraction en cours...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Analyser le PDF
                </>
              )}
            </button>
          )}

          {/* Erreur */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900">Erreur</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Résultat */}
          {result && result.success && (
            <div className="mt-6 space-y-6">
              {/* Header de succès */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-900">
                    Extraction réussie
                  </h3>
                  <p className="text-green-700 text-sm mt-1">
                    Rapport #{result.report_id} - {result.message}
                  </p>
                </div>
              </div>

              {/* Informations sur l'immeuble */}
              {(result.extracted_data.immeuble.adresse ||
                result.extracted_data.immeuble.identifiant) && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Immeuble concerné
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {result.extracted_data.immeuble.adresse && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Adresse :
                        </span>
                        <p className="text-gray-900 mt-1">
                          {result.extracted_data.immeuble.adresse}
                        </p>
                      </div>
                    )}
                    {result.extracted_data.immeuble.identifiant && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Identifiant :
                        </span>
                        <p className="text-gray-900 mt-1">
                          {result.extracted_data.immeuble.identifiant}
                        </p>
                      </div>
                    )}
                    {result.linked_site_id && (
                      <div className="mt-2 text-sm text-green-700">
                        ✓ Lié au site #{result.linked_site_id}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Informations sur le prestataire */}
              {(result.extracted_data.prestataire.nom ||
                result.extracted_data.prestataire.contact) && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Prestataire
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {result.extracted_data.prestataire.nom && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Nom :
                        </span>
                        <p className="text-gray-900 mt-1">
                          {result.extracted_data.prestataire.nom}
                        </p>
                      </div>
                    )}
                    {result.extracted_data.prestataire.contact && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Contact :
                        </span>
                        <p className="text-gray-900 mt-1">
                          {result.extracted_data.prestataire.contact}
                        </p>
                      </div>
                    )}
                    {result.linked_provider_id && (
                      <div className="mt-2 text-sm text-green-700">
                        ✓ Lié au prestataire #{result.linked_provider_id}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Liste des réserves */}
              {result.extracted_data.reserves &&
                result.extracted_data.reserves.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Réserves détectées ({result.extracted_data.reserves.length})
                    </h3>
                    <div className="space-y-4">
                      {result.extracted_data.reserves.map((reserve, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                                reserve.niveau
                              )}`}
                            >
                              {reserve.niveau}
                            </span>
                            {reserve.page && (
                              <span className="text-sm text-gray-500">
                                Page {reserve.page}
                              </span>
                            )}
                          </div>
                          {reserve.description && (
                            <p className="text-gray-700 text-sm leading-relaxed mb-2">
                              {reserve.description}
                            </p>
                          )}
                          <div className="flex gap-4 text-xs text-gray-500">
                            {reserve.type && <span>Type: {reserve.type}</span>}
                            {reserve.dateDetection && (
                              <span>Détecté le: {reserve.dateDetection}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Bouton pour recommencer */}
              <button
                onClick={() => {
                  setFile(null);
                  setResult(null);
                  setError(null);
                }}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Analyser un autre rapport
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
