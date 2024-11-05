import { MapDisplay } from "./map-display/MapDisplay"

type Props = {}

const HomeContainer = (props: Props) => {
    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">MPU6050 Motion Tracker</h1>
            <MapDisplay />
        </div>
    )
}

export default HomeContainer