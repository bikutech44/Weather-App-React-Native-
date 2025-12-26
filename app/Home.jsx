import { ActivityIndicator, Image, ImageBackground, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';



const Home = () => {
    const [openSearchBar, setOpenSearchBar] = useState(false);
    const [city, setCity] = useState("Kathmandu");
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState (true);

    const [suggestions, setSuggestions] = useState([]);

    const apiKey = "f5d157adeb0d481186395908252512";

    const fetchWeather = async (cityName) => {
        try{
            setLoading(true);
            const response = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=7&aqi=no`
            );
            const data = await response.json();
            // console.log(data);
            if (data.error) {
                alert("City not found. Please check the spelling!");
                setLoading(false);
                setCity("Kathmandu");
                fetchWeather("Kathmandu");
                return; // Stop the function here
            }
            setWeatherData(data);
            setSuggestions([]); 
            // setLoading(false);
            setTimeout(() => {
                setLoading(false);
            }, 40);
        }
        catch(e){
            console.log("Error fetching weather:", e);
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchWeather(city);
    }, []);

    const handleOpenSearch = () => {
        setOpenSearchBar(true);
    }

    const textSubmitted = (event) =>{
        const text = event.nativeEvent.text;
        setOpenSearchBar(false);
        setCity(text);
        fetchWeather(text);
        Keyboard.dismiss();
    }

    const fetchSuggestions = async (text) => {
        if (text.length > 2) { 
            try {
                const response = await fetch(
                    `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${text}`
                );
                const data = await response.json();
                setSuggestions(data);
            } catch (e) {
                console.log("Error fetching suggestions:", e);
            }
        } else {
            setSuggestions([]); 
        }
    }

    return (
        <View style={{flex: 1}}>
            <ImageBackground 
            source={require('../assets/background.png')}
            style={styles.mainView}
            imageStyle={styles.backgroundImageStyle}
            >
                 {
                    loading ? (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#114f6dff" />
                            <Text style={{ marginTop: 10, color: '#114f6dff', fontSize: "26", fontWeight: '500', textAlign: 'center' }}>
                                Updating Weather...
                            </Text>
                        </View>
                    ) : (

                   <>

                    <View
                    style={styles.searchView}>
                        {
                            openSearchBar &&(
                                <TextInput placeholder='Search city.......' style={styles.searchInput} 
                                returnKeyType='search' 
                                autoFocus={true}
                                onChangeText={(text) => fetchSuggestions(text)}
                                onBlur={() => {
                                    setTimeout(() => setOpenSearchBar(false), 200);
                                    setSuggestions([]);
                                    // setOpenSearchBar(false)
                                }} 
                                onSubmitEditing={textSubmitted}
                                />

                            )
                        }
                        <TouchableOpacity onPress={()=> handleOpenSearch()} style={styles.searchTouchable}>
                            <Feather name="search" size={28} color="#848282ff" style={{padding: 6}}/>
                        </TouchableOpacity>
                    </View>

                    {suggestions.length > 0 && openSearchBar && (
                        <View style={styles.suggestionList}>
                            {suggestions.map((item, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    style={styles.suggestionItem}
                                    onPress={() => {
                                        setCity(item.name);
                                        fetchWeather(item.name);
                                        setOpenSearchBar(false);
                                        setSuggestions([]);
                                    }}
                                >
                                    <Text style={styles.suggestionText}>{item.name}, {item.country}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* top view */}
                    {
                        weatherData &&(
                            <View style={styles.topView}>
                                <Image
                                    // source={require('../assets/sun.png')}
                                    // source={{ uri: 'https:' + weatherData.current.condition.icon }}
                                    source={
                                        weatherData?.current 
                                        ? { uri: 'https:' + weatherData.current.condition.icon } 
                                        : require('../assets/sun.png')
                                    }
                                    
                                    style={{
                                        marginTop: -10,
                                        alignSelf: 'center',
                                        height: 200,
                                        width: 200,
                                    }}
                                />
                                <Text style={styles.cityName} >{weatherData?.location?.name}, {weatherData?.location?.country}</Text>
                                <Text style={styles.tempText}> {weatherData?.current ? Math.round(weatherData.current.temp_c) : "--"}<Text style={{fontWeight: '300'}}>˚</Text></Text>
                                <Text style={styles.weatherDetails}>{weatherData.current.condition.text}</Text>
                            </View>     
                        )
                    }


                    {/* weather details view */}
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 50,
                        paddingHorizontal: 14,
                        justifyContent: 'space-between',
                        paddingVertical: 10,
                        backgroundColor: "#ffffff38",
                        borderRadius: 14,

                    }}>
                        {
                            weatherData &&(
                                <>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <FontAwesome5 name="wind" size={20} color="#7b8467ff" />
                                    <Text style={styles.detailsText}>{weatherData?.current.wind_kph} km/h</Text>

                                </View>

                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <FontAwesome6 name="droplet" size={20} color="#7b8467ff" />
                                    <Text style={styles.detailsText}>{weatherData?.current.humidity}%</Text>

                                </View>

                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <MaterialCommunityIcons name="clock-time-seven" size={20} color="#7b8467ff" />
                                    <Text style={styles.detailsText}>{weatherData?.location.localtime.split(' ')[1]}</Text>

                                </View>
                                </>
                            )
                        }

                    </View>



                    {/* daily views */}

                    <View style={{marginTop: 40, paddingHorizontal: 4}}>

                        <View style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
                            <MaterialIcons name="calendar-month" size={24} color='#608a5aff' />
                            <Text style={{fontSize: 22, color: '#747d60ff', fontWeight: '600'}}>Daily forecast</Text>
                        </View>
                        <ScrollView horizontal
                        style={{
                            marginTop: 8,
                            padding: 6,
                            marginLeft: -14,
                            paddingLeft: 14,
                            marginRight: -14,
                            paddingRight: 14
                        }}  
                        showsHorizontalScrollIndicator={false}        
                        >
                            {
                                weatherData?.forecast?.forecastday.map((item, index) => {
                                    const date = new Date(item.date);
                                    const dayName = date.toLocaleDateString('en-US', {weekday: 'long'});
                                    return(
                                        <View key={index} style={styles.dailyForecast}>
                                            <Image
                                                // Using the dynamic icon from the API
                                                source={{ uri: 'https:' + item.day.condition.icon }}
                                                style={styles.dailyForecastImg}
                                            />
                                            <Text style={{ fontSize: 16, color: '#444' }}>{dayName}</Text>
                                            <Text style={{ fontSize: 24, fontWeight: '500' }}>
                                                {Math.round(item.day.avgtemp_c)}˚
                                            </Text>
                                        </View>
                                    )
                                })
                            }

                        </ScrollView>


                    </View>

                    </>

                    )
                 }  


            </ImageBackground>
        
        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: "#89ccefaf",
        flex: 1,
        marginTop: 42,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        paddingHorizontal: 14,
    },
    searchView: {
        marginTop: 18,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: 60,
    },
    searchInput: {
        borderRadius: 30,
        backgroundColor: "#ffffff4e",
        fontSize: 22,
        paddingVertical: 14,
        marginRight: -38,
        flex: 1,
        paddingHorizontal: 18,
    },
    searchTouchable: {
        borderRadius: 32,
        backgroundColor: '#f8f8f850',
        // position: 'absolute',
        right: 6,
        
    },
    backgroundImageStyle: {
        opacity: 0.95,
        borderTopRightRadius:22,
        borderTopLeftRadius: 22,
    },
    topView: {
        marginTop: 10,
        alignItems: 'center',
    },
    cityName: {
        marginTop: 6,
        fontSize: 28,
        fontWeight: '600',
        letterSpacing: '0.2',
        textAlign: 'center',
        fontFamily: 'arial'

    },
    tempText: {
        marginTop: 6,
        fontSize: 120,
        fontWeight: '600',
        color: '#114f6dff',
        textAlign: 'center'
    },
    weatherDetails: {
        fontSize: 20,
        fontWeight: '500'
    },
    detailsText: {
        marginLeft: 6, 
        fontSize: 20, 
        fontWeight: '600', 
        color: '#7b8467ff'
    },
    dailyForecast: {
        padding: 8,
        backgroundColor: "#ffffff49",
        paddingHorizontal: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginRight: 12,

    },
    dailyForecastImg: {
        height: 90,
        width: 90,
        marginBottom: 6,
    },


    suggestionList: {
        position: 'absolute',
        top: 74, 
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 15,
        zIndex: 1000,
        elevation: 5,
        overflow: 'hidden',
    },
    suggestionItem: {
        padding: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    suggestionText: {
        fontSize: 18,
        color: '#333',
    },


    loadingOverlay: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
})