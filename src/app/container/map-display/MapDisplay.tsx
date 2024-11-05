'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { IMotionData } from '@/shared/models/motioninterfaces'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/container/card'

const Map = dynamic(
  () => import('./Map'), 
  { 
    ssr: false,
    loading: () => <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg bg-gray-100 animate-pulse" />
  }
)

const DEFAULT_POSITION = { lat: -7.9797, lng: 112.6304 };
const SENSITIVITY = 0.0001;

export function MapDisplay() {
    const [motionData, setMotionData] = useState<IMotionData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/motion');
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();
                setMotionData(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 gap-6">
            <Map 
                motionData={motionData}
                defaultPosition={DEFAULT_POSITION}
                defaultSensitivity={SENSITIVITY}
            />
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