'use client'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { IMotionData } from '@/shared/models/motioninterfaces'
import DynamicMap from '../dynamic-map/DynamicMap'

interface MapProps {
    motionData: IMotionData | null;
    defaultPosition: { lat: number; lng: number };
    defaultSensitivity: number;
}

const Map = ({ motionData, defaultPosition, defaultSensitivity }: MapProps) => {
    return (
        <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
            <MapContainer
                center={motionData?.position ?? defaultPosition}
                zoom={18}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DynamicMap
                    motionData={motionData}
                    defaultPosition={defaultPosition}
                    defaultSensitivity={defaultSensitivity}
                />
            </MapContainer>
        </div>
    )
}

export default Map