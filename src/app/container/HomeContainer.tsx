'use client'
import { useState, useEffect } from 'react'
import { MapDisplay } from "./map-display/MapDisplay"

const HomeContainer = () => {
    const [error, setError] = useState<string | null>(null)
    const [isTracking, setIsTracking] = useState(false)

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null

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
                intervalId = setInterval(() => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            if (isTracking) {
                                postLocation(position)
                            }
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
                }, 2000)
            } else {
                setError('Geolocation is not supported by this browser')
            }
        }

        startTracking()

        return () => {
            if (intervalId !== null) {
                clearInterval(intervalId)
            }
        }
    }, [isTracking])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Smart Bus System</h1>
            <MapDisplay />
            <div className="flex items-center space-x-2 mt-40 md:mt-[400px]">
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isTracking}
                        onChange={(e) => setIsTracking(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3">
                        {isTracking ? 'Tracking Mode' : 'Monitoring Mode'}
                    </span>
                </label>
            </div>
        </div>
    )
}

export default HomeContainer