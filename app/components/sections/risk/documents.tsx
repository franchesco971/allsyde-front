'use client'

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  FolderOpen,
  FileText,
  Image,
  Download,
  ChevronRight,
  Shield,
  Calendar,
  AlertTriangle,
  File,
  LucideIcon
} from "lucide-react";
import { Site } from "@/app/lib/types/site";

type SeverityType = "critique" | "majeure" | "mineure";
type DevisStatus = "accepted" | "refused" | "pending";
type ObligationStatus = "conforme" | "non_conforme";
type DocumentType = "rapport" | "preuve" | "devis" | "bc" | "pdf" | "excel";

interface Reserve {
  reserve_id: string;
  description: string;
  severity: SeverityType;
  status: string;
  created_at: string;
  proofs?: string[];
  devis_amount?: number;
  devis_status?: DevisStatus;
}

interface Obligation {
  obligation_id: string;
  name: string;
  status: ObligationStatus;
}

interface Document {
  type: DocumentType;
  name: string;
  date?: string;
  icon?: LucideIcon;
  status?: DevisStatus;
}

interface DocumentsProps {
  readonly site: Site;
}

interface FolderItemProps {
  readonly name: string;
  readonly icon: LucideIcon;
  readonly count: number;
  readonly isExpanded: boolean;
  readonly onClick: () => void;
}

interface ReserveFolderProps {
  readonly reserve: Reserve;
}

interface DocumentItemProps {
  readonly name: string;
  readonly type: DocumentType;
  readonly status?: DevisStatus;
}

export default function Documents({ site }: DocumentsProps) {
  const [reserves, setReserves] = useState<Reserve[]>([]);
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["reserves"]);

  useEffect(() => {
    // TODO: Implémenter le chargement des données depuis l'API
    // Simuler un chargement pour l'instant
    const loadData = async () => {
      setLoading(true);
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Données mock - à remplacer par les appels API
      setReserves([]);
      setObligations([]);
      setLoading(false);
    };

    loadData();
  }, [site.id]);

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => 
      prev.includes(folder) 
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#00A69C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const reservesWithDocs = reserves.filter(r => r.status !== "cloturee" || (r.proofs && r.proofs.length > 0));

  return (
    <div className="space-y-6" data-testid="documents-content">
      {/* Header */}
      <div>
        <h2 className="font-heading text-xl font-semibold text-slate-900">Documents du site</h2>
        <p className="text-sm text-slate-500 mt-1">
          Dossier réglementaire structuré par réserves et obligations
        </p>
      </div>

      <Card className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <CardContent className="p-6">
          {/* Arborescence */}
          <div className="space-y-2">
            {/* Dossier Réserves */}
            <FolderItem
              name="Réserves"
              icon={AlertTriangle}
              count={reservesWithDocs.length}
              isExpanded={expandedFolders.includes("reserves")}
              onClick={() => toggleFolder("reserves")}
            />
            
            {expandedFolders.includes("reserves") && (
              <div className="ml-6 space-y-2">
                {reservesWithDocs.length === 0 ? (
                  <p className="text-sm text-slate-500 py-2 pl-4">Aucune réserve avec documents</p>
                ) : (
                  reservesWithDocs.map((reserve) => (
                    <ReserveFolder key={reserve.reserve_id} reserve={reserve} />
                  ))
                )}
              </div>
            )}

            {/* Dossier Obligations */}
            <FolderItem
              name="Obligations"
              icon={Shield}
              count={obligations.length}
              isExpanded={expandedFolders.includes("obligations")}
              onClick={() => toggleFolder("obligations")}
            />
            
            {expandedFolders.includes("obligations") && (
              <div className="ml-6 space-y-2">
                {obligations.map((obl) => (
                  <div
                    key={obl.obligation_id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700 flex-1">{obl.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {obl.status === "conforme" ? "Conforme" : "Réserve"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Dossier Planning */}
            <FolderItem
              name="Planning"
              icon={Calendar}
              count={4}
              isExpanded={expandedFolders.includes("planning")}
              onClick={() => toggleFolder("planning")}
            />
            
            {expandedFolders.includes("planning") && (
              <div className="ml-6 space-y-2">
                <DocumentItem name="Planning annuel 2026.pdf" type="pdf" />
                <DocumentItem name="Calendrier contrôles Q1.pdf" type="pdf" />
                <DocumentItem name="Planning Bureau de contrôle.pdf" type="pdf" />
                <DocumentItem name="Échéancier réglementaire.xlsx" type="excel" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FolderItem({ name, icon: Icon, count, isExpanded, onClick }: FolderItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
    >
      <div className={`transform transition-transform ${isExpanded ? "rotate-90" : ""}`}>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
      <FolderOpen className={`w-5 h-5 ${isExpanded ? "text-[#00A69C]" : "text-slate-400"}`} />
      <span className="font-medium text-slate-900 flex-1 text-left">{name}</span>
      <Badge variant="outline" className="text-xs">{count}</Badge>
    </button>
  );
}

function getSeverityColor(severity: SeverityType): string {
  switch (severity) {
    case "critique":
      return "text-red-600";
    case "majeure":
      return "text-orange-600";
    case "mineure":
      return "text-yellow-600";
    default:
      return "text-yellow-600";
  }
}

function getReserveDocuments(reserve: Reserve): Document[] {
  const docs: Document[] = [];
  
  docs.push({ type: "rapport", name: "Rapport de contrôle.pdf" });
  
  if (reserve.proofs && reserve.proofs.length > 0) {
    reserve.proofs.forEach((proof, i) => {
      docs.push({ type: "preuve", name: `Preuve_${i + 1}.jpg` });
    });
  }

  if (reserve.devis_amount) {
    docs.push({ 
      type: "devis", 
      name: `Devis_${reserve.devis_amount}€.pdf`, 
      status: reserve.devis_status 
    });
  }

  if (reserve.devis_status === "accepted") {
    docs.push({ type: "bc", name: "Bon_de_commande.pdf" });
  }

  return docs;
}

function ReserveFolder({ reserve }: ReserveFolderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const documents = getReserveDocuments(reserve);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <div className={`transform transition-transform ${isExpanded ? "rotate-90" : ""}`}>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
        <FolderOpen className={`w-4 h-4 ${isExpanded ? "text-[#00A69C]" : "text-slate-400"}`} />
        <span className="text-sm text-slate-700 flex-1 text-left truncate">{reserve.description}</span>
        <Badge className={`text-xs ${getSeverityColor(reserve.severity)} bg-transparent border-none`}>
          {reserve.severity}
        </Badge>
      </button>
      
      {isExpanded && (
        <div className="ml-10 space-y-1 mt-1">
          {documents.map((doc) => (
            <DocumentItem key={`${reserve.reserve_id}-${doc.type}-${doc.name}`} name={doc.name} type={doc.type} status={doc.status} />
          ))}
        </div>
      )}
    </div>
  );
}

function getDevisStatusLabel(status: DevisStatus): string {
  switch (status) {
    case "accepted":
      return "Accepté";
    case "refused":
      return "Refusé";
    case "pending":
      return "En attente";
    default:
      return "En attente";
  }
}

function getDevisStatusClasses(status: DevisStatus): string {
  switch (status) {
    case "accepted":
      return "bg-green-50 text-green-700";
    case "refused":
      return "bg-red-50 text-red-700";
    case "pending":
      return "bg-yellow-50 text-yellow-700";
    default:
      return "bg-yellow-50 text-yellow-700";
  }
}

function DocumentItem({ name, type, status }: DocumentItemProps) {
  const getIcon = () => {
    if (type === "preuve" && (name.includes(".jpg") || name.includes(".png"))) {
      return <Image className="w-4 h-4 text-purple-500" />;
    }
    if (type === "excel" || name.includes(".xlsx")) {
      return <File className="w-4 h-4 text-green-600" />;
    }
    return <FileText className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group">
      {getIcon()}
      <span className="text-sm text-slate-600 flex-1">{name}</span>
      {status && (
        <Badge className={`text-xs ${getDevisStatusClasses(status)}`}>
          {getDevisStatusLabel(status)}
        </Badge>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
}
