'use client'

import { IMotionData } from "@/shared/models/motioninterfaces";
import { useEffect, useRef, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";

interface IDynamicMap {
    motionData: IMotionData | null;
    defaultPosition: { lat: number; lng: number };
    defaultSensitivity: number
}

const DynamicMap = ({
    motionData,
    defaultPosition,
}: IDynamicMap) => {
    const POSITION_THRESHOLD = 0.0005; 
    const MOVEMENT_STEPS = 20;
    const STEP_INTERVAL = 50; 

    const [position, setPosition] = useState(defaultPosition);
    const [isMoving, setIsMoving] = useState(false);
    const previousPosition = useRef(defaultPosition);
    const map = useMap();

    const calculateDistance = (pos1: typeof defaultPosition, pos2: typeof defaultPosition) => {
        const latDiff = Math.abs(pos1.lat - pos2.lat);
        const lngDiff = Math.abs(pos1.lng - pos2.lng);
        return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    };

    const interpolatePosition = (
        start: typeof defaultPosition,
        end: typeof defaultPosition,
        progress: number
    ) => {
        return {
            lat: start.lat + (end.lat - start.lat) * progress,
            lng: start.lng + (end.lng - start.lng) * progress,
        };
    };

    useEffect(() => {
        if (!motionData || isMoving) return;

        const newPosition = motionData.position;
        const distance = calculateDistance(previousPosition.current, newPosition);

        if (distance > POSITION_THRESHOLD) {
            setIsMoving(true);
            let step = 0;

            const animate = () => {
                if (step < MOVEMENT_STEPS) {
                    const progress = step / MOVEMENT_STEPS;
                    const interpolated = interpolatePosition(
                        previousPosition.current,
                        newPosition,
                        progress
                    );

                    setPosition(interpolated);
                    map.panTo(interpolated);
                    step++;

                    setTimeout(animate, STEP_INTERVAL);
                } else {
                    setPosition(newPosition);
                    map.panTo(newPosition);
                    previousPosition.current = newPosition;
                    setIsMoving(false);
                }
            };

            animate();
        } else {
            setPosition(newPosition);
            map.panTo(newPosition);
            previousPosition.current = newPosition;
        }
    }, [motionData, map]);

    const icon = new Icon({
        iconUrl: '/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    return (
        <Marker position={position} icon={icon}>
            <Popup>
                <div className="space-y-2">
                    <p>Latitude: {position.lat.toFixed(6)}°</p>
                    <p>Longitude: {position.lng.toFixed(6)}°</p>
                    {motionData?.timestamp && (
                        <p>Last Update: {new Date(motionData.timestamp).toLocaleString()}</p>
                    )}
                    <p>Movement: {isMoving ? 'Smooth' : 'Instant'}</p>
                </div>
            </Popup>
        </Marker>
    );
}

export default DynamicMap