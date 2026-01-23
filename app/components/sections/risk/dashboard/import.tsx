import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Upload } from "lucide-react";

export default function RiskDashboardImport({
  handleImport,
  importing,
  importProgress,
}: Readonly<{
  handleImport: () => void;
  importing: boolean;
  importProgress: number;
}>) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            Import automatique des rapports
          </h3>
          <p className="text-sm text-muted-foreground">
            Connectez-vous aux organismes de contrôle
          </p>
        </div>
        <Button onClick={handleImport} disabled={importing}>
          <Upload className="w-4 h-4 mr-2" />
          {importing ? "Import en cours..." : "Importer rapport"}
        </Button>
      </div>

      {importing && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground ai-processing">
              Analyse IA en cours...
            </span>
            <span className="text-sm font-semibold text-foreground">
              {importProgress}%
            </span>
          </div>
          <Progress value={importProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {importProgress < 50 && "Connexion à Bureau Veritas API..."}
            {importProgress >= 50 &&
              importProgress < 75 &&
              "Lecture du rapport PDF par IA..."}
            {importProgress >= 75 &&
              importProgress < 100 &&
              "Extraction IA des réserves et obligations..."}
            {importProgress === 100 &&
              "Assignation automatique aux prestataires"}
          </p>
        </div>
      )}
    </Card>
  );
}
