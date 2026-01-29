'use client'

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { AlertTriangle, Calendar, MapPin, Shield, Clock } from "lucide-react";
import { Site } from "@/app/lib/types/site";

interface SiteWithMapData extends Site {
  latitude: number;
  longitude: number;
  complianceRate: number;
}

interface SiteIndicators {
  criticalReserves: number;
  lateReserves: number;
  upcomingControls: number;
}

interface SitePopupProps {
  readonly site: SiteWithMapData;
  readonly indicators: SiteIndicators;
}

interface SiteIndicatorsProps {
  readonly site: SiteWithMapData;
  readonly indicators: SiteIndicators;
}

interface SiteListItemProps {
  readonly site: SiteWithMapData;
  readonly isSelected: boolean;
  readonly onClick: () => void;
  readonly indicators: SiteIndicators;
}

interface CartographieProps {
  readonly sites: SiteWithMapData[];
  readonly selectedSite: SiteWithMapData | null;
  readonly setSelectedSite: (site: SiteWithMapData | null) => void;
}

interface MapUpdaterProps {
  readonly center: [number, number] | null;
  readonly zoom?: number;
}

function createCustomIcon(complianceRate: number, isSelected: boolean): DivIcon {
  const color = complianceRate >= 70 ? "#22c55e" : complianceRate >= 50 ? "#f97316" : "#ef4444";
  const size = isSelected ? 40 : 30;
  
  return new DivIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ${isSelected ? 'transform: scale(1.2);' : ''}
      transition: all 0.2s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MapUpdater({ center, zoom }: MapUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);

  return null;
}

function getComplianceColor(complianceRate: number): string {
  if (complianceRate >= 70) return "text-green-600";
  if (complianceRate >= 50) return "text-orange-600";
  return "text-red-600";
}

function getComplianceBgColor(complianceRate: number): string {
  if (complianceRate >= 70) return "bg-green-500";
  if (complianceRate >= 50) return "bg-orange-500";
  return "bg-red-500";
}

function getCriticalReservesCount(complianceRate: number): number {
  if (complianceRate < 50) return 3;
  if (complianceRate < 70) return 1;
  return 0;
}

function getLateReservesCount(complianceRate: number): number {
  if (complianceRate < 60) return 2;
  if (complianceRate < 80) return 1;
  return 0;
}

export default function Cartography({ sites, selectedSite, setSelectedSite }: CartographieProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (selectedSite) {
      setMapCenter([selectedSite.latitude, selectedSite.longitude]);
    }
  }, [selectedSite]);

  const getSiteIndicators = (site: SiteWithMapData): SiteIndicators => {
    const complianceRate = site.complianceRate;
    const criticalReserves = getCriticalReservesCount(complianceRate);
    const lateReserves = getLateReservesCount(complianceRate);
    const upcomingControls = 2;
    
    return { criticalReserves, lateReserves, upcomingControls };
  };

  const filteredSites = sites.filter((site: SiteWithMapData) => {
    const indicators = getSiteIndicators(site);
    if (filter === "critical") return indicators.criticalReserves > 0;
    if (filter === "late") return indicators.lateReserves > 0;
    if (filter === "controls") return indicators.upcomingControls > 0;
    return true;
  });

  return (
    <div className="h-full flex gap-6">
      <Card className="w-96 flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="font-heading">Sites ({filteredSites.length})</CardTitle>
          <div className="flex gap-2 mt-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="flex-1"
            >
              Tous
            </Button>
            <Button
              variant={filter === "critical" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("critical")}
              className="flex-1"
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Critiques
            </Button>
            <Button
              variant={filter === "late" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("late")}
              className="flex-1"
            >
              <Calendar className="h-4 w-4 mr-1" />
              En retard
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredSites.map((site) => (
              <SiteListItem
                key={site.id}
                site={site}
                isSelected={selectedSite?.id === site.id}
                onClick={() => {
                  setSelectedSite(site);
                  setMapCenter([site.latitude, site.longitude]);
                }}
                indicators={getSiteIndicators(site)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardContent className="p-0 h-full">
          <MapContainer
            center={mapCenter}
            zoom={6}
            className="h-full w-full rounded-lg"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={mapCenter} zoom={selectedSite ? 13 : 6} />
            {filteredSites.map((site) => (
              <Marker
                key={site.id}
                position={[site.latitude, site.longitude]}
                icon={createCustomIcon(site.complianceRate, selectedSite?.id === site.id)}
                eventHandlers={{
                  click: () => setSelectedSite(site),
                }}
              >
                <Popup>
                  <SitePopup site={site} indicators={getSiteIndicators(site)} />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          {selectedSite && (
            <div className="absolute top-4 left-4 right-4 z-[1000]">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="font-heading flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {selectedSite.label}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSite(null)}
                    >
                      ×
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SiteIndicators
                    site={selectedSite}
                    indicators={getSiteIndicators(selectedSite)}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SitePopup({ site, indicators }: SitePopupProps) {
  const assetTypeLabel = typeof site.assetType === 'object' && site.assetType !== null 
    ? site.assetType.label 
    : 'Non spécifié';

  return (
    <div className="p-2 min-w-[250px]">
      <h3 className="font-heading font-semibold text-slate-900 mb-1">{site.label}</h3>
      <div className="space-y-2 text-sm">
        <Badge variant="outline" className="text-xs">{assetTypeLabel}</Badge>
        <div className={getComplianceColor(site.complianceRate)}>
          {site.complianceRate}% de conformité
        </div>
        <div className="text-xs space-y-1 text-slate-600">
          {indicators.criticalReserves > 0 && (
            <div className="flex items-center gap-1 text-red-600">
              <AlertTriangle className="w-3 h-3" />
              {indicators.criticalReserves} réserve(s) critique(s)
            </div>
          )}
          {indicators.lateReserves > 0 && (
            <div className="flex items-center gap-1 text-orange-600">
              <Clock className="w-3 h-3" />
              {indicators.lateReserves} en retard
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SiteIndicators({ site, indicators }: SiteIndicatorsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
        <span className="text-sm text-slate-600">Conformité</span>
        <span className={`font-bold ${getComplianceColor(site.complianceRate)}`}>
          {site.complianceRate}%
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center p-3 rounded-lg bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600 mb-1" />
          <span className="text-2xl font-bold text-red-600">{indicators.criticalReserves}</span>
          <span className="text-xs text-slate-600">Critiques</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg bg-orange-50">
          <Clock className="h-5 w-5 text-orange-600 mb-1" />
          <span className="text-2xl font-bold text-orange-600">{indicators.lateReserves}</span>
          <span className="text-xs text-slate-600">En retard</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-lg bg-blue-50">
          <Calendar className="h-5 w-5 text-blue-600 mb-1" />
          <span className="text-2xl font-bold text-blue-600">{indicators.upcomingControls}</span>
          <span className="text-xs text-slate-600">À venir</span>
        </div>
      </div>
    </div>
  );
}

function SiteListItem({ site, isSelected, onClick, indicators }: SiteListItemProps) {
  const assetTypeLabel = typeof site.assetType === 'object' && site.assetType !== null 
    ? site.assetType.label 
    : 'Non spécifié';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-full mt-1.5 ${getComplianceBgColor(site.complianceRate)}`} />
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-medium text-slate-900 mb-1 truncate">
            {site.label}
          </h3>
          <p className="text-xs text-slate-500 mb-2 truncate">{site.address}</p>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">{assetTypeLabel}</Badge>
            <span className={`text-xs font-semibold ${getComplianceColor(site.complianceRate)}`}>
              {site.complianceRate}%
            </span>
          </div>
          {(indicators.criticalReserves > 0 || indicators.lateReserves > 0) && (
            <div className="flex gap-2 text-xs">
              {indicators.criticalReserves > 0 && (
                <span className="flex items-center gap-1 text-red-600">
                  <Shield className="w-3 h-3" />
                  {indicators.criticalReserves}
                </span>
              )}
              {indicators.lateReserves > 0 && (
                <span className="flex items-center gap-1 text-orange-600">
                  <Clock className="w-3 h-3" />
                  {indicators.lateReserves}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
