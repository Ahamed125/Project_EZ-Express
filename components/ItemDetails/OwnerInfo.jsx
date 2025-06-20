import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Text, View } from 'react-native';
import Colors from './../../constant/Colors';
export default function OwnerInfo({itm}) {
  return (
    <View style={styles.container}>
        <View style={{display:'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            gap:20
        }}>
      <Image source={{uri:itm?.userImage}}
      style={{width:50,height:50,borderRadius:99}}/>

      <View>
        <Text style={{
            fontFamily:'outfit-medium',
            fontSize:17
        }}>
            {itm?.username}
        </Text>
        <Text style={{fontFamily:'outfit',
            color:Colors.GRAY
        }}>Message</Text>
      </View>
      </View>
      <Ionicons name="send-outline" size={24} color={Colors.PRIMARY} />
      
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginHorizontal:20,
    paddingHorizontal:20,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    gap:20,
    borderWidth:1,
    borderRadius:15,
    padding:10,
    borderColor:Colors.PRIMARY,
    backgroundColor:Colors.WHITE,
    justifyContent:'space-between'
  }
})






