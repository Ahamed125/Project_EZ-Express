import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import Colors from '../../constant/Colors'

export default function AboutItem({ itm }) {
    const [readMore, setReadMore] = useState(true)

    return (
        <View style={{ padding: 20 }}>
            <Text style={{
                fontFamily: 'outfit',
                fontSize: 20
            }}>About {itm?.name}</Text>

            <Text numberOfLines={readMore ? 2 : 20} style={{
                fontFamily: 'outfit',
                fontSize: 16,
                color: Colors.GRAY
            }}>
                {itm?.description}
            </Text>

            {readMore && 
                <Pressable onPress={() => setReadMore(false)}>
                    <Text style={{
                        fontFamily: 'outfit-medium',
                        fontSize: 14,
                        color: Colors.SECONDERY
                    }}>
                        Read More
                    </Text>
                </Pressable>
            }

            {!readMore && 
                <Pressable onPress={() => setReadMore(true)}>
                    <Text style={{
                        fontFamily: 'outfit-medium',
                        fontSize: 14,
                        color: Colors.SECONDERY
                    }}>
                        Read Less
                    </Text>
                </Pressable>
            }
        </View>
    )
}
