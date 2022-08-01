// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";
import { useEffect, useRef, useState } from "react";

import styles from "./Map.module.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

const Map = (props) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(props.lng || 25.332044);
  const [lat, setLat] = useState(props.lat || 42.753217);
  const [zoom, setZoom] = useState(props.zoom || 5.17);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    if (props.route) {
      map.current.on("load", () => {
        const geojson = {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: props.route.map((loc) => [
                loc.longitude,
                loc.latitude,
              ]),
            },
          },
        };
        map.current.addSource("route", geojson);
        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#f00",
            "line-width": 3,
          },
        });

        // Geographic coordinates of the LineString
        const coordinates = geojson.data.geometry.coordinates;

        // Create a 'LngLatBounds' with both corners at the first coordinate.
        const bounds = new mapboxgl.LngLatBounds(
          coordinates[0],
          coordinates[0]
        );

        // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
        for (const coord of coordinates) {
          bounds.extend(coord);
        }

        map.current.fitBounds(bounds, {
          padding: 20,
        });
      });
    }
  });

  return (
    <div
      ref={mapContainer}
      className={`${styles.map} ${props.className}`}
    ></div>
  );
};

export default Map;
