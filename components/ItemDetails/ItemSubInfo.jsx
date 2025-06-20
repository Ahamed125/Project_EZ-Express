import { View, Text,Image} from 'react-native'
import React from 'react'


import ItemSubInfoCard from './ItemSubInfoCard'

export default function ItemSubInfo({itm}) {
  return (
    <View style={{paddingHorizontal:20}}>
      <View style={{display:'flex',
        flexDirection:'row'
      }}>

        <ItemSubInfoCard icon={require('./../../assets/images/calendar.png')}
        title={'Price'}
        value={"RS:"+itm?.price+"/="}
        />
        <ItemSubInfoCard icon={require('./../../assets/images/cate.jpeg')}
        title={'Category'}
        value={itm?.category}
        />
        

    
      </View>
      {/* <View style={{display:'flex',
        flexDirection:'row'
      }}>

        <JewellSubInfoCard icon={require('./../../assets/images/purity.jpeg')}
        title={'Purity'}
        value={jewell?.purity}
        />
        <JewellSubInfoCard icon={require('./../../assets/images/weight.jpeg')}
        title={'MetalWeight'}
        value={jewell?.metalWeight+"g"}
        />
        

    
      </View> */}
    </View>
  )
}