import { useState, useEffect } from 'react';
import GISMap from '../components/GISMap';
import api from '../lib/api';

export default function GISPage() {
    const [markers, setMarkers] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [sourcesRes, plantsRes] = await Promise.all([
                api.get('/production/sources'),
                api.get('/production/treatment-plants')
            ]);

            const sourceMarkers = sourcesRes.data.map((s: any) => ({
                id: s._id,
                position: [s.location.coordinates[1], s.location.coordinates[0]], // GeoJSON is [lng, lat], Leaflet needs [lat, lng]
                title: s.name,
                type: 'SOURCE'
            }));

            const plantMarkers = plantsRes.data.map((p: any) => ({
                id: p._id,
                position: [p.location.coordinates[1], p.location.coordinates[0]],
                title: p.name,
                type: 'WTP'
            }));

            setMarkers([...sourceMarkers, ...plantMarkers]);
        } catch (error) {
            console.error("Failed to fetch GIS data", error);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <GISMap markers={markers} />
        </div>
    );
}
