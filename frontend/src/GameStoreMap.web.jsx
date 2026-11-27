import { Text, View } from 'react-native'

export default function GameStoreMapWeb() {
    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.text}>
                Map view is not supported on web. Please use a mobile device to view the map.
            </Text>
        </View>
    )
}

const styles = {
    text: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#fff'
    },
}