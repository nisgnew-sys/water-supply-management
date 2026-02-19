import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface GISMapProps {
    markers: {
        id: string;
        position: [number, number];
        title: string;
        type: 'SOURCE' | 'WTP';
    }[];
}

export default function GISMap({ markers }: GISMapProps) {
    const center: [number, number] = markers.length > 0 ? markers[0].position : [26.1158, 91.7086]; // Default to Guwahati

    return (
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker) => (
                <Marker key={marker.id} position={marker.position}>
                    <Popup>
                        <strong>{marker.title}</strong>
                        <br />
                        Type: {marker.type}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
