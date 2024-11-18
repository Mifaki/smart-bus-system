import { NextResponse } from 'next/server'

interface IMotionData {
  position: { lat: number; lng: number }
  timestamp: number
}

interface MotionDataRequest {
  position: { lat: number; lng: number }
}

let latestMotionData: IMotionData = {
  position: { lat: -7.9797, lng: 112.6304 },
  timestamp: Date.now()
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as MotionDataRequest
   
    if (!data.position) {
      return NextResponse.json(
        { error: 'Missing required position field' },
        { status: 400 }
      )
    }
    latestMotionData = {
      position: data.position,
      timestamp: Date.now()
    }
    return NextResponse.json({ status: 'success', data: latestMotionData })
  } catch (error) {
    return NextResponse.json({ error: `Invalid data: ${String(error)}` }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json(latestMotionData)
}