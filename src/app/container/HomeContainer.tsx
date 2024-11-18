'use client'
import { useState, useEffect } from 'react'
import { MapDisplay } from "./map-display/MapDisplay"

const HomeContainer = () => {
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let watchId: number | null = null

        const postLocation = async (position: GeolocationPosition) => {
            try {
                await fetch('/api/motion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        position: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                })
            } catch (err) {
                console.error('Failed to post location:', err)
            }
        }

        const startTracking = () => {
            if ('geolocation' in navigator) {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        postLocation(position)
                    },
                    (error) => {
                        setError(`Geolocation error: ${error.message}`)
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                )
            } else {
                setError('Geolocation is not supported by this browser')
            }
        }

        startTracking()

        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId)
            }
        }
    }, [])

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Smart Bus System</h1>
            <MapDisplay />
        </div>
    )
}

export default HomeContainer