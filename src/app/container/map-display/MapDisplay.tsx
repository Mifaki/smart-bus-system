'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { IMotionData } from '@/shared/models/motioninterfaces'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/container/card'
import DynamicMap from '../dynamic-map/DynamicMap'

const DEFAULT_POSITION = { lat: -7.9797, lng: 112.6304 };
const SENSITIVITY = 0.0001;

export function MapDisplay() {
    const [motionData, setMotionData] = useState<IMotionData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/motion');
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();
                setMotionData(data);
                setError(null);
            } catch (err) {
                setError('Error fetching motion data');
                console.error(err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
                <MapContainer
                    center={motionData?.position || DEFAULT_POSITION}
                    zoom={18}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DynamicMap
                        motionData={motionData}
                        defaultPosition={DEFAULT_POSITION}
                        defaultSensitivity={SENSITIVITY}
                    />
                </MapContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Current Position</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {motionData?.position ? (
                            <div className="space-y-2">
                                <p>Latitude: {motionData.position.lat.toFixed(6)}°</p>
                                <p>Longitude: {motionData.position.lng.toFixed(6)}°</p>
                                <p>Acceleration X: {motionData.accelerometer.x.toFixed(2)} g</p>
                                <p>Acceleration Y: {motionData.accelerometer.y.toFixed(2)} g</p>
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Last Update</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {motionData?.timestamp ? (
                            <p>{new Date(motionData.timestamp).toLocaleString()}</p>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}