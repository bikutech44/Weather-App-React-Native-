import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const index = () => {
  return (
    <View style={{flex:1, backgroundColor: "#143a47ee"}}>
        <View style={styles.mainView}>
            <Image
                source={require('../assets/weatherback.png')}
                style={styles.topImg}
            />
            <View style={{marginTop: -10, marginBottom: 20}}>
                <Text style={styles.welcomeTxt}>Weather Forecast</Text>
                <Text style={styles.subText}>Hello this app is developed while learning the react native course. {`\n`} 
                    <Text style={{fontSize: 20, color: '#c1c0c0ff'}}>Thank you.</Text> </Text>
            </View>

            <View style={{marginTop: 0, height: 260, }}>
                <Image
                source={require('../assets/cloudd.png')}
                style={styles.cloudImg}         
                />
                <TouchableOpacity onPress={() => {
                    console.log("pressed")
                    router.push('/Home')
                }}
                style={{ marginTop: -100, zIndex:10, elevation: 10}}
                >
                    <Text style={styles.getStartedTxt}>Get Started</Text>
                </TouchableOpacity>
            </View>

            <View style={{position: 'absolute', bottom: 10}}>
                <Text style={styles.footerText}>Developed by: Bikram Kumal</Text>
            </View>

        </View>
      
    </View>
  )
}

export default index

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: "#224e6bff",
        flex:1,
        marginTop: 40,
        marginBlock: 20,
        marginHorizontal: 16,
        borderRadius: 16,
        alignItems: 'center'
    },
    topImg: {
        height: 200,
        width: 250,
        marginTop: 18,
    },
    welcomeTxt: {
        color: "#eedf32ff",
        marginTop: 0,
        fontSize: 28,
        letterSpacing: 0.4,
        fontWeight: '700',
        textAlign: 'center'
    },
    subText: {
        textAlign: 'center',
        marginTop: 22,
        fontSize: 18,
        marginHorizontal: 30,
        color: "#b9b9b9ff"
    },
    cloudImg: {
        marginTop: 10,
        opacity: 0.1,
        height: 250,
        width: 320,
        alignSelf: 'flex-end',
        right: -2,
        zIndex: 1,   
        // position: 'absolute'     
    },
    getStartedTxt: {
        textAlign: 'center',
        padding: '8',
        backgroundColor: '#e4dcdce7',
        marginHorizontal: '32%',
        borderRadius: 16,
        fontSize: 24,
        color: "#17506aff",
        letterSpacing: '0.2',
        fontWeight: '600',
        zIndex: 4,

    },
    footerText: {
        color: '#aaa',
        fontSize: 16,
        fontWeight: '500'
    },
    
})