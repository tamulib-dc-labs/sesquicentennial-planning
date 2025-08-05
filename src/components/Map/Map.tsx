import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import { Box, Flex, Select, Slider, Text } from "@radix-ui/themes";
import {
  FeatureGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState, useMemo } from "react";

import { IconButton } from "@radix-ui/themes";
import Leaflet from "leaflet";
import MDXCard from "../MDX/Card";
import { MapStyled } from "@components/Map/Map.styled";
import MarkerClusterGroup from "@components/Map/MarkerClusterGroup";
import { MarkerIcon } from "@components/Map/MarkerIcon";
import { getBounds } from "@lib/iiif/navPlace";
import { headerHeight } from "@src/styles/global";

// Added back to support labels from navPlace
import { getLabel } from "@hooks/getLabel";

interface MapProps {
  manifests: any;
}

declare type NamedTileLayer = Leaflet.TileLayer & {
  name: string;
  url: string;
  attribution: string;
};

interface MapVars {
  defaultBounds: Leaflet.LatLngBoundsExpression;
  enabled: boolean;
  icon: Leaflet.IconOptions;
  tileLayers: NamedTileLayer[];
}

// @ts-ignore
const MAP_VARS: MapVars = process.env.CANOPY_CONFIG.map;

// Helper function to parse dates from navDate
const parseNavDate = (navDate: any): Date | null => {
  if (!navDate) return null;
  
  // Handle different navDate formats
  if (typeof navDate === 'string') {
    const parsed = new Date(navDate);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  if (Array.isArray(navDate) && navDate.length > 0) {
    const parsed = new Date(navDate[0]);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  if (typeof navDate === 'object' && navDate.value) {
    const parsed = new Date(navDate.value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  return null;
};

const Map: React.FC<MapProps> = ({ manifests }) => {
  const [tileLayer, setTileLayer] = useState<NamedTileLayer>(
    MAP_VARS.tileLayers[0]
  );

  const defaultBounds = MAP_VARS.defaultBounds;
  const mapRef = useRef<Leaflet.Map>(null);
  const [bounds, setBounds] =
    useState<Leaflet.LatLngBoundsExpression>(defaultBounds);

  const [selectedDateRange, setSelectedDateRange] = useState<[number, number]>([0, 0]);

  // Calculate date range from manifests
  const { minYear, maxYear, manifestsWithDates } = useMemo(() => {
    const manifestsWithValidDates = manifests
      .map((item: any) => ({
        ...item,
        parsedDate: parseNavDate(item.navDate)
      }))
      .filter((item: any) => item.parsedDate !== null);

    if (manifestsWithValidDates.length === 0) {
      return { minYear: new Date().getFullYear(), maxYear: new Date().getFullYear(), manifestsWithDates: manifests };
    }

    const years = manifestsWithValidDates.map((item: any) => item.parsedDate.getFullYear());
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    return { minYear, maxYear, manifestsWithDates: manifestsWithValidDates };
  }, [manifests]);

  // Initialize selected date range
  useEffect(() => {
    setSelectedDateRange([minYear, maxYear]);
  }, [minYear, maxYear]);

  // Filter manifests based on selected date range
  const filteredManifests = useMemo(() => {
    // Always start with original manifests to preserve structure
    return manifests.filter((item: any) => {
      const parsedDate = parseNavDate(item.navDate);
      
      // If no valid date, include the item
      if (!parsedDate) return true;
      
      // Filter based on date range
      const year = parsedDate.getFullYear();
      return year >= selectedDateRange[0] && year <= selectedDateRange[1];
    });
  }, [manifests, selectedDateRange]);

  useEffect(() => {
    const manifestBounds = getBounds(filteredManifests);
    manifestBounds.length > 0 && setBounds(manifestBounds);
  }, [filteredManifests]);

  useEffect(() => {
    if (mapRef.current && bounds) {
      mapRef.current.fitBounds(bounds);
    }
  }, [mapRef, bounds]);

  const handleTileLayerChange = (value: string) => {
    const newTileLayer = MAP_VARS.tileLayers.find(
      (tile) => tile.name === value
    );
    if (newTileLayer) {
      setTileLayer(newTileLayer);
    }
  };

  const handleDateRangeChange = (value: number[]) => {
    setSelectedDateRange([value[0], value[1]]);
  };

  // Code to Handle the Popup to Ensure it's centered
  const handlePopupOpen = (e: any) => {
    const popup = e.popup;
    const map = mapRef.current;
    
    if (!map || !popup) return;
    
    // Force popup to recalculate position after content loads
    setTimeout(() => {
      popup.update();
      // Trigger auto-pan after popup dimensions are known
      if (popup.isOpen()) {
        const popupLatLng = popup.getLatLng();
        map.panTo(popupLatLng, { animate: true });
      }
    }, 50);
    
    setTimeout(() => {
      if (popup.isOpen()) {
        popup.update();
      }
    }, 200);
  };

  return (
    <MapStyled
      css={{ top: headerHeight, height: `calc(100vh - ${headerHeight}px)` }}
    >
      <MapContainer
        className={"map-container"}
        bounds={bounds}
        scrollWheelZoom={true}
        zoomControl={false}
        ref={mapRef}
      >
        <Box
          style={{
            position: "absolute",
            zIndex: 1000,
            top: 0,
            right: 0,
            padding: "var(--space-5)",
          }}
        >
          <Flex gap="4">
            {MAP_VARS.tileLayers.length > 1 && (
              <Select.Root
                defaultValue={tileLayer.name}
                onValueChange={handleTileLayerChange}
                size="3"
              >
                <Select.Trigger
                  style={{
                    boxShadow: "var(--shadow-3)",
                    background: "var(--gray-1)",
                  }}
                />
                <Select.Content>
                  <Select.Group>
                    <Select.Label>Layers</Select.Label>
                    {MAP_VARS.tileLayers.map((tile: any, index: number) => (
                      <Select.Item key={index} value={tile.name}>
                        {tile.name}
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            )}
            <Flex direction="column" gap="2">
              <IconButton
                aria-label="zoom in"
                size="3"
                onClick={() => mapRef.current?.zoomIn()}
                style={{ boxShadow: "var(--shadow-3)", cursor: "pointer" }}
              >
                <PlusIcon />
              </IconButton>
              <IconButton
                aria-label="zoom out"
                size="3"
                onClick={() => mapRef.current?.zoomOut()}
                style={{ boxShadow: "var(--shadow-3)", cursor: "pointer"}}
              >
                <MinusIcon />
              </IconButton>
            </Flex>
          </Flex>
        </Box>

        {/* Date Slider Control */}
        {manifestsWithDates.length > 0 && minYear !== maxYear && (
          <Box
            style={{
              position: "absolute",
              zIndex: 1000,
              bottom: 0,
              left: 0,
              right: 0,
              padding: "var(--space-5)",
              background: "var(--gray-1)",
              borderTop: "1px solid var(--gray-6)",
              boxShadow: "var(--shadow-3)",
            }}
          >
            <Flex direction="column" gap="3">
              <Flex justify="between" align="center">
                <Text size="2" weight="medium">
                  Date Range: {selectedDateRange[0]} - {selectedDateRange[1]}
                </Text>
                <Text size="1" color="gray">
                  {filteredManifests.length} of {manifests.length} items
                </Text>
              </Flex>
              <Box className="custom-slider">
                <Slider
                  value={selectedDateRange}
                  onValueChange={handleDateRangeChange}
                  min={minYear}
                  max={maxYear}
                  step={1}
                  minStepsBetweenThumbs={1}
                  style={{ width: "100%" }}
                />
              </Box>
              <Flex justify="between">
                <Text size="1" color="gray">{minYear}</Text>
                <Text size="1" color="gray">{maxYear}</Text>
              </Flex>
            </Flex>
          </Box>
        )}

        <LayersControl position="bottomright">
          <LayersControl.BaseLayer name={tileLayer.name} checked>
            <TileLayer
              url={tileLayer.url}
              attribution={tileLayer.attribution}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <MarkerClusterGroup key={`cluster-${filteredManifests.length}-${selectedDateRange[0]}-${selectedDateRange[1]}`}>
          <FeatureGroup>
            {filteredManifests.map((item: any) =>
              item.features.map((feature: any, index: any) => (
                <Marker
                  position={[
                    feature.geometry.coordinates[1],
                    feature.geometry.coordinates[0],
                  ]}
                  icon={MarkerIcon(item.thumbnail[0].id, getLabel(feature?.properties?.label))}
                  key={`${item.id}-${index}-${selectedDateRange[0]}-${selectedDateRange[1]}`}
                  eventHandlers={{
                    popupopen: handlePopupOpen
                  }}
                >
                  <Popup 
                    className="canopy-map-popup"
                    autoPan={true}
                    autoPanPadding={[20, 20]}
                    autoPanPaddingTopLeft={[20, 20]}
                    autoPanPaddingBottomRight={[20, 20]}
                    keepInView={true}
                  >
                    <MDXCard 
                      iiifContent={item.id} 
                      label={getLabel(feature?.properties?.label) as string | undefined} 
                    />
                  </Popup>
                </Marker>
              ))
            )}
          </FeatureGroup>
        </MarkerClusterGroup>
      </MapContainer>
    </MapStyled>
  );
};

export default Map;