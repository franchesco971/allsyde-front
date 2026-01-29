import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  ChevronDown,
  ChevronRight,
  LogOut,
  Building2,
  Settings,
  CreditCard,
  FileText,
  BarChart3,
  FolderOpen,
  Users,
  Leaf,
  Lock,
  LayoutDashboard,
  ClipboardList,
  Calendar,
  AlertTriangle,
  Map,
  FileArchive
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Sidebar({ user, sites, selectedSite, setSelectedSite, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRiskModuleOpen, setIsRiskModuleOpen] = useState(true);

  // Modules grisés (à venir)
  const disabledModules = [
    { icon: BarChart3, label: "Budget" },
    { icon: CreditCard, label: "Devis / Bons de commande" },
    { icon: FileText, label: "Contrats" },
    { icon: FolderOpen, label: "PPA / CAPEX" },
    { icon: Leaf, label: "ESG / EEG" },
  ];

  // Sous-pages du module Maîtrise des Risques
  const riskSubPages = [
    { icon: LayoutDashboard, label: "Tableau de bord", path: "/dashboard" },
    { icon: ClipboardList, label: "Obligations", path: "/dashboard/obligations" },
    { icon: Calendar, label: "Planning", path: "/dashboard/planning" },
    { icon: AlertTriangle, label: "Réserves", path: "/dashboard/reserves" },
    { icon: Map, label: "Cartographie", path: "/dashboard/cartographie" },
    { icon: Users, label: "Prestataires", path: "/dashboard/prestataires" },
    { icon: FileArchive, label: "Documents", path: "/dashboard/documents" },
  ];

  const isSubPageActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    }
    return location.pathname.startsWith(path);
  };

  const isInRiskModule = () => {
    return location.pathname.startsWith("/dashboard");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-40">
        {/* Logo */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00A69C] flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-slate-900">AllSyde</h1>
              <p className="text-xs text-slate-500">Premium v5 <span className="bg-[#00A69C] text-white px-1.5 py-0.5 rounded text-[10px] ml-1">IA</span></p>
            </div>
          </div>
        </div>

        {/* Site selector */}
        <div className="p-4 border-b border-slate-100">
          <button
            data-testid="back-to-sites"
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#00A69C] transition-colors mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux sites
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                data-testid="site-selector"
                className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-[#00A69C]" />
                  <div className="text-left">
                    <p className="font-medium text-slate-900 text-sm">{selectedSite?.name || "Sélectionner"}</p>
                    <p className="text-xs text-slate-500">{selectedSite?.asset_type || ""}</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {sites.map((site) => (
                <DropdownMenuItem
                  key={site.site_id}
                  onClick={() => setSelectedSite(site)}
                  className="cursor-pointer"
                >
                  <Building2 className="w-4 h-4 mr-2 text-slate-400" />
                  <div>
                    <p className="font-medium">{site.name}</p>
                    <p className="text-xs text-slate-500">{site.asset_type}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Modules</p>
          
          {/* Module Maîtrise des Risques - EN PREMIER et ACTIF */}
          <div className="mb-2">
            <button
              onClick={() => {
                setIsRiskModuleOpen(!isRiskModuleOpen);
                if (!isInRiskModule()) {
                  navigate("/dashboard");
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isInRiskModule()
                  ? "bg-[#00A69C] text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              data-testid="sidebar-maitrise-des-risques"
            >
              <Shield className="w-5 h-5" />
              <span className="flex-1 text-left">Maîtrise des Risques</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isRiskModuleOpen ? "" : "-rotate-90"}`} />
            </button>

            {/* Sous-navigation dépliable */}
            {isRiskModuleOpen && (
              <ul className="mt-1 ml-3 pl-3 border-l-2 border-slate-200 space-y-0.5">
                {riskSubPages.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = isSubPageActive(item.path);
                  
                  return (
                    <li key={index}>
                      <button
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                          isActive
                            ? "bg-teal-50 text-[#00A69C] font-medium"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                        data-testid={`subnav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-[#00A69C]" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Séparateur visuel */}
          <div className="my-3 px-3">
            <div className="h-px bg-slate-200"></div>
          </div>

          {/* Modules grisés */}
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 px-3">À venir</p>
          <ul className="space-y-1">
            {disabledModules.map((item, index) => {
              const Icon = item.icon;
              
              return (
                <li key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 cursor-not-allowed"
                        data-testid={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="flex-1 text-left">{item.label}</span>
                        <Lock className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-slate-800 text-white">
                      <p>Module à venir</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-slate-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                data-testid="user-menu"
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Avatar className="w-9 h-9">
                  <AvatarImage src={user?.picture} alt={user?.name} />
                  <AvatarFallback className="bg-[#00A69C] text-white text-sm">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
                data-testid="logout-btn"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </TooltipProvider>
  );
}
