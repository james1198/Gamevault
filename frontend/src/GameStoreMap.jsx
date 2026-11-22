import MapView, { Marker } from 'react-native-maps'

export default function GameStoreMap({ location, nearbyStores }) {
    return (
        <MapView
            style={{ width: '100%', height: 300 }}
            initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        >
            <Marker
                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                }}
                title="You are here"
                pinColor="blue"
            />
            {nearbyStores.map((store, index) => (
                <Marker
                    key={index}
                    coordinate={{
                        latitude: store.latitude,
                        longitude: store.longitude,
                    }}
                    title={store.name}
                    description={store.address}
                />
            ))}
        </MapView>
    )
}
