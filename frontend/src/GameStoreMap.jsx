import mapView, {marker} from 'react-native-maps'

export default function GameStoreMap({ location, nearbyStores }) {
    return (
        <mapView
            style={{ flex: 1 }}
            initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        >
            <marker
                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                }}
                title="You are here"
                pinColor="blue"
            />
            {nearbyStores.map((store, index) => (
                <marker
                    key={index}
                    coordinate={{
                        latitude: store.latitude,
                        longitude: store.longitude,
                    }}
                    title={store.name}
                    description={store.address}
                />
            ))}
        </mapView>
    )
}  