import { IMotionData } from '@/shared/models/motioninterfaces'
import { NextResponse } from 'next/server'

let latestMotionData: IMotionData = {
    accelerometer: { x: 0, y: 0, z: 0 },
    gyroscope: { x: 0, y: 0, z: 0 },
    position: { lat: -7.9797, lng: 112.6304 },
    timestamp: Date.now()
  }
  
  export async function POST(request: Request) {
    try {
      const data = await request.json()
      
      if (!data.position || !data.accelerometer || !data.gyroscope) {
        return NextResponse.json(
          { error: 'Missing required fields: position, accelerometer, and gyroscope are required' }, 
          { status: 400 }
        )
      }
      
      latestMotionData = {
        accelerometer: data.accelerometer,
        gyroscope: data.gyroscope,
        position: data.position,
        timestamp: Date.now()
      }
      
      return NextResponse.json({ status: 'success', data: latestMotionData })
    } catch (error) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
  }
  
  export async function GET() {
    return NextResponse.json(latestMotionData)
  }