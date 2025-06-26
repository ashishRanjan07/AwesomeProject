// import {
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Platform,
//   PermissionsAndroid,
//   FlatList,
//   TextInput,
//   Keyboard,
// } from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import Mapbox from '@rnmapbox/maps';
// import Geolocation from '@react-native-community/geolocation';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const MAPBOX_ACCESS_TOKEN =
//   'pk.eyJ1IjoibW9uYWxhc2hpc2giLCJhIjoiY204ZnQ1NHY4MGkxMjJtcHp1MW4wanhycSJ9.9OLazC-m6E9Av6d3hqoA9A';
// Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

// const MapView = () => {
//   const cameraRef = useRef(null);
//   const [location, setLocation] = useState({
//     latitude: 28.60046782066017,
//     longitude: 77.3759228280255,
//   });
//   const [originalLocation, setOriginalLocation] = useState({
//     latitude: 28.60046782066017,
//     longitude: 77.3759228280255,
//   });
//   const [zoomLevel, setZoomLevel] = useState(14);
//   const [mapStyle, setMapStyle] = useState(
//     'mapbox://styles/mapbox/streets-v12',
//   );
//   const [activeStyle, setActiveStyle] = useState('standard');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [showResults, setShowResults] = useState(false);
//   const [markerLocation, setMarkerLocation] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [route, setRoute] = useState(null);
//   const [showDirectionsModal, setShowDirectionsModal] = useState(false);
//   const [loadingDirections, setLoadingDirections] = useState(false);
//   const [distance, setDistance] = useState(null);
//   const [duration, setDuration] = useState(null);

//   const mapStyles = {
//     standard: 'mapbox://styles/mapbox/streets-v12',
//     satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
//     traffic: 'mapbox://styles/mapbox/navigation-day-v1',
//   };

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       );
//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('Location permission denied');
//       }
//     }
//   };

//   useEffect(() => {
//     requestLocationPermission();
//   }, []);

//   const handleRecenter = () => {
//     if (cameraRef.current) {
//       cameraRef.current.setCamera({
//         centerCoordinate: [
//           originalLocation.longitude,
//           originalLocation.latitude,
//         ],
//         zoomLevel: 14,
//         animationDuration: 1000,
//       });
//     }
//     setLocation(originalLocation);
//     setMarkerLocation(null);
//     setSearchQuery('');
//     setRoute(null);
//   };

//   const gestureSettings = {
//     doubleTapToZoomInEnabled: true,
//     doubleTouchToZoomOutEnabled: true,
//     pinchPanEnabled: true,
//     pinchZoomEnabled: true,
//     pinchZoomDecelerationEnabled: true,
//     pitchEnabled: true,
//     quickZoomEnabled: true,
//     rotateEnabled: true,
//     rotateDecelerationEnabled: true,
//     panEnabled: true,
//     panDecelerationFactor: 0.9,
//     simultaneousRotateAndPinchZoomEnabled: true,
//     zoomAnimationAmount: 1.0,
//   };

//   const handleZoomIn = () => {
//     const newZoom = Math.min(zoomLevel + 1, 20); // Max zoom level 20
//     setZoomLevel(newZoom);
//     if (cameraRef.current) {
//       cameraRef.current.setCamera({
//         zoomLevel: newZoom,
//         animationDuration: 300,
//       });
//     }
//   };

//   const handleZoomOut = () => {
//     const newZoom = Math.max(zoomLevel - 1, 3);
//     setZoomLevel(newZoom);
//     if (cameraRef.current) {
//       cameraRef.current.setCamera({
//         zoomLevel: newZoom,
//         animationDuration: 300,
//       });
//     }
//   };

//   const changeMapStyle = style => {
//     setMapStyle(mapStyles[style]);
//     setActiveStyle(style);
//   };

//   const handleSearch = async text => {
//     setSearchQuery(text);

//     if (text.length > 2) {
//       try {
//         const response = await fetch(
//           `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//             text,
//           )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5`,
//         );
//         const data = await response.json();
//         setSearchResults(data.features);
//         setShowResults(true);
//       } catch (error) {
//         console.error('Search error:', error);
//       }
//     } else {
//       setSearchResults([]);
//       setShowResults(false);
//     }
//   };

//   const handleLocationSelect = item => {
//     const [longitude, latitude] = item.center;
//     setLocation({latitude, longitude});
//     setMarkerLocation({latitude, longitude});
//     setSearchQuery(item.place_name);
//     setShowResults(false);
//     Keyboard.dismiss();

//     if (cameraRef.current) {
//       cameraRef.current.setCamera({
//         centerCoordinate: [longitude, latitude],
//         zoomLevel: 14,
//         animationDuration: 1000,
//       });
//     }
//   };

//   return (
//     <View style={{flex: 1}}>
//       <SafeAreaView style={{backgroundColor: 'black'}} />
//       <StatusBar backgroundColor={'white'} barStyle={'light-content'} />
//       <View style={styles.page}>
//         <View style={styles.container}>
//           <Mapbox.MapView
//             styleURL={mapStyle}
//             style={styles.map}
//             compassEnabled={true}
//             attributionEnabled={false}
//             gestureSettings={gestureSettings}>
//             <Mapbox.Camera
//               ref={cameraRef}
//               defaultSettings={{
//                 centerCoordinate: [location.longitude, location.latitude],
//                 zoomLevel: 14,
//               }}
//             />

//             <Mapbox.UserLocation
//               visible={true}
//               animated={true}
//               showsUserHeadingIndicator={true}
//               androidRenderMode="compass"
//             />

//             {/* Marker for searched location */}
//             {markerLocation && (
//               <Mapbox.PointAnnotation
//                 id="searchMarker"
//                 coordinate={[
//                   markerLocation.longitude,
//                   markerLocation.latitude,
//                 ]}>
//                 <View style={styles.markerContainer}>
//                   <View style={styles.marker}>
//                     <Icon name="place" size={24} color="#FF0000" />
//                   </View>
//                 </View>
//               </Mapbox.PointAnnotation>
//             )}
//           </Mapbox.MapView>

//           <View style={styles.searchContainer}>
//             <View style={styles.searchInputContainer}>
//               <Icon
//                 name="search"
//                 size={24}
//                 color="#666"
//                 style={styles.searchIcon}
//               />
//               <TextInput
//                 style={styles.searchInput}
//                 placeholder="Search for places..."
//                 placeholderTextColor="#999"
//                 value={searchQuery}
//                 onChangeText={handleSearch}
//                 onSubmitEditing={() => Keyboard.dismiss()}
//               />
//               {searchQuery.length > 0 && (
//                 <TouchableOpacity
//                   onPress={() => {
//                     setSearchQuery('');
//                     setSearchResults([]);
//                     setShowResults(false);
//                   }}
//                   style={styles.clearButton}>
//                   <Icon name="close" size={20} color="#666" />
//                 </TouchableOpacity>
//               )}
//             </View>
//             {/* Search Results */}
//             {showResults && searchResults.length > 0 && (
//               <View style={styles.resultsContainer}>
//                 <FlatList
//                   data={searchResults}
//                   keyExtractor={item => item.id}
//                   renderItem={({item}) => (
//                     <TouchableOpacity
//                       style={styles.resultItem}
//                       onPress={() => handleLocationSelect(item)}>
//                       <Icon
//                         name="location-on"
//                         size={20}
//                         color="#666"
//                         style={styles.resultIcon}
//                       />
//                       <View>
//                         <Text style={styles.resultTitle}>{item.text}</Text>
//                         <Text style={styles.resultSubtitle}>
//                           {item.place_name}
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   )}
//                   keyboardShouldPersistTaps="handled"
//                 />
//               </View>
//             )}
//           </View>
//           <View style={styles.buttonHolder}>
//             <View style={styles.viewModeContainer}>
//               <TouchableOpacity
//                 style={[
//                   styles.viewModeButton,
//                   activeStyle === 'standard' && styles.activeButton,
//                 ]}
//                 onPress={() => changeMapStyle('standard')}>
//                 <Icon
//                   name="map"
//                   size={24}
//                   color={activeStyle === 'standard' ? '#000' : '#fff'}
//                 />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.viewModeButton,
//                   activeStyle === 'satellite' && styles.activeButton,
//                 ]}
//                 onPress={() => changeMapStyle('satellite')}>
//                 <Icon
//                   name="satellite"
//                   size={24}
//                   color={activeStyle === 'satellite' ? '#000' : '#fff'}
//                 />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.viewModeButton,
//                   activeStyle === 'traffic' && styles.activeButton,
//                 ]}
//                 onPress={() => changeMapStyle('traffic')}>
//                 <Icon
//                   name="traffic"
//                   size={24}
//                   color={activeStyle === 'traffic' ? '#000' : '#fff'}
//                 />
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity
//               onPress={handleRecenter}
//               style={styles.buttonIocn}>
//               <Icon name="my-location" size={40} color="#ffffff" />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={handleZoomIn} style={styles.buttonIocn}>
//               <Icon name="add" size={40} color="#ffffff" />
//             </TouchableOpacity>
//             {/* Zoom Out Button */}
//             <TouchableOpacity onPress={handleZoomOut} style={styles.buttonIocn}>
//               <Icon name="remove" size={40} color="#ffffff" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default MapView;

// const styles = StyleSheet.create({
//   page: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     height: '100%',
//     width: '100%',
//   },
//   map: {
//     flex: 1,
//   },
//   viewModeContainer: {
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     borderRadius: 8,
//     padding: 8,
//     gap: 5,
//   },
//   controlContainer: {
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     borderRadius: 8,
//     padding: 8,
//     alignItems: 'center',
//     gap: 10,
//   },

//   buttonIocn: {
//     borderWidth: 2,
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: 'transparent',
//   },
//   buttonHolder: {
//     borderWidth: 2,
//     position: 'absolute',
//     width: 75,
//     elevation: 10,
//     backgroundColor: 'black',
//     borderRadius: 10,
//     bottom: 20,
//     right: 20,
//     alignItems: 'center',
//     gap: 10,
//   },
//   viewModeButton: {
//     padding: 8,
//     borderRadius: 8,
//   },
//   activeButton: {
//     backgroundColor: '#fff',
//   },
//   searchContainer: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//     right: 20,
//     zIndex: 999,
//   },
//   searchInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//     paddingVertical: 4,
//   },
//   clearButton: {
//     padding: 4,
//   },
//   resultsContainer: {
//     marginTop: 8,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     maxHeight: 200,
//     elevation: 3,
//   },
//   resultItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   resultIcon: {
//     marginRight: 12,
//   },
//   resultTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   resultSubtitle: {
//     fontSize: 14,
//     color: '#666',
//   },
//   markerContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   marker: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 5,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
// });


import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  FlatList,
  TextInput,
  Keyboard,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Mapbox from '@rnmapbox/maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibW9uYWxhc2hpc2giLCJhIjoiY204ZnQ1NHY4MGkxMjJtcHp1MW4wanhycSJ9.9OLazC-m6E9Av6d3hqoA9A';
Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

const MapView = () => {
  const cameraRef = useRef(null);
  const [location, setLocation] = useState({
    latitude: 28.60046782066017,
    longitude: 77.3759228280255,
  });
  const [originalLocation, setOriginalLocation] = useState({
    latitude: 28.60046782066017,
    longitude: 77.3759228280255,
  });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v12');
  const [activeStyle, setActiveStyle] = useState('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [markerLocation, setMarkerLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [loadingDirections, setLoadingDirections] = useState(false);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  const mapStyles = {
    standard: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
    traffic: 'mapbox://styles/mapbox/navigation-day-v1',
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission denied');
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const init = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setUserLocation({latitude, longitude});
            setOriginalLocation({latitude, longitude});
            setLocation({latitude, longitude});
            
            if (cameraRef.current) {
              cameraRef.current.setCamera({
                centerCoordinate: [longitude, latitude],
                zoomLevel: 14,
                animationDuration: 1000,
              });
            }
          },
          error => console.log(error),
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    };
    init();
  }, []);

  const handleRecenter = () => {
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [originalLocation.longitude, originalLocation.latitude],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
    setLocation(originalLocation);
    setMarkerLocation(null);
    setSearchQuery('');
    setRoute(null);
  };

  const gestureSettings = {
    doubleTapToZoomInEnabled: true,
    doubleTouchToZoomOutEnabled: true,
    pinchPanEnabled: true,
    pinchZoomEnabled: true,
    pinchZoomDecelerationEnabled: true,
    pitchEnabled: true,
    quickZoomEnabled: true,
    rotateEnabled: true,
    rotateDecelerationEnabled: true,
    panEnabled: true,
    panDecelerationFactor: 0.9,
    simultaneousRotateAndPinchZoomEnabled: true,
    zoomAnimationAmount: 1.0,
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 1, 20);
    setZoomLevel(newZoom);
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        zoomLevel: newZoom,
        animationDuration: 300,
      });
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 1, 3);
    setZoomLevel(newZoom);
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        zoomLevel: newZoom,
        animationDuration: 300,
      });
    }
  };

  const changeMapStyle = style => {
    setMapStyle(mapStyles[style]);
    setActiveStyle(style);
  };

  const handleSearch = async text => {
    setSearchQuery(text);

    if (text.length > 2) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              text,
          )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5`,
        );
        const data = await response.json();
        setSearchResults(data.features);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleLocationSelect = item => {
    const [longitude, latitude] = item.center;
    setLocation({latitude, longitude});
    setMarkerLocation({latitude, longitude});
    setSearchQuery(item.place_name);
    setShowResults(false);
    Keyboard.dismiss();

    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [longitude, latitude],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
    
    // Show directions modal
    setShowDirectionsModal(true);
  };

  const getDirections = async () => {
    if (!userLocation || !markerLocation) return;
    
    setLoadingDirections(true);
    
    try {
      const origin = `${userLocation.longitude},${userLocation.latitude}`;
      const destination = `${markerLocation.longitude},${markerLocation.latitude}`;
      
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin};${destination}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
      );
      
      const routeGeometry = response.data.routes[0].geometry;
      setRoute(routeGeometry);
      
      // Calculate distance and duration
      const distanceKm = response.data.routes[0].distance / 1000;
      const durationMinutes = Math.round(response.data.routes[0].duration / 60);
      
      setDistance(distanceKm.toFixed(1));
      setDuration(durationMinutes);
      
      // Adjust camera to fit the route
      if (cameraRef.current) {
        cameraRef.current.fitBounds(
          [userLocation.longitude, userLocation.latitude],
          [markerLocation.longitude, markerLocation.latitude],
          {
            padding: {top: 100, bottom: 100, left: 50, right: 50},
            animationDuration: 1000,
          }
        );
      }
    } catch (error) {
      console.error('Directions error:', error);
      Alert.alert('Error', 'Could not calculate directions. Please try again.');
    } finally {
      setLoadingDirections(false);
      setShowDirectionsModal(false);
    }
  };

  const clearDirections = () => {
    setRoute(null);
    setDistance(null);
    setDuration(null);
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: 'black'}} />
      <StatusBar backgroundColor={'white'} barStyle={'light-content'} />
      <View style={styles.page}>
        <View style={styles.container}>
          <Mapbox.MapView
            styleURL={mapStyle}
            style={styles.map}
            compassEnabled={true}
            attributionEnabled={false}
            gestureSettings={gestureSettings}>
            <Mapbox.Camera
              ref={cameraRef}
              defaultSettings={{
                centerCoordinate: [location.longitude, location.latitude],
                zoomLevel: 14,
              }}
            />

            <Mapbox.UserLocation
              visible={true}
              animated={true}
              showsUserHeadingIndicator={true}
              androidRenderMode="compass"
            />

            {/* Marker for searched location */}
            {markerLocation && (
              <Mapbox.PointAnnotation
                id="searchMarker"
                coordinate={[markerLocation.longitude, markerLocation.latitude]}>
                <View style={styles.markerContainer}>
                  <View style={styles.marker}>
                    <Icon name="place" size={24} color="#FF0000" />
                  </View>
                </View>
              </Mapbox.PointAnnotation>
            )}

            {/* Route line */}
            {route && (
              <Mapbox.ShapeSource id="routeSource" shape={route}>
                <Mapbox.LineLayer
                  id="routeFill"
                  style={{
                    lineColor: 'green',
                    lineWidth: 4,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                />
              </Mapbox.ShapeSource>
            )}
          </Mapbox.MapView>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Icon
                name="search"
                size={24}
                color="#666"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for places..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={handleSearch}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowResults(false);
                    clearDirections();
                  }}
                  style={styles.clearButton}>
                  <Icon name="close" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
            {/* Search Results */}
            {showResults && searchResults.length > 0 && (
              <View style={styles.resultsContainer}>
                <FlatList
                  data={searchResults}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.resultItem}
                      onPress={() => handleLocationSelect(item)}>
                      <Icon
                        name="location-on"
                        size={20}
                        color="#666"
                        style={styles.resultIcon}
                      />
                      <View>
                        <Text style={styles.resultTitle}>{item.text}</Text>
                        <Text style={styles.resultSubtitle}>
                          {item.place_name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}
          </View>

          {/* Directions Info Panel */}
          {(distance && duration && searchQuery.length!=0) && (
            <View style={styles.directionsInfo}>
              <View style={styles.directionsInfoRow}>
                <Icon name="directions" size={20} color="#333" />
                <Text style={styles.directionsText}>Distance: {distance} km</Text>
              </View>
              <View style={styles.directionsInfoRow}>
                <Icon name="access-time" size={20} color="#333" />
                <Text style={styles.directionsText}>Duration: ~{duration} min</Text>
              </View>
              <TouchableOpacity 
                onPress={clearDirections}
                style={styles.closeDirectionsButton}>
                <Icon name="close" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.buttonHolder}>
            <View style={styles.viewModeContainer}>
              <TouchableOpacity
                style={[
                  styles.viewModeButton,
                  activeStyle === 'standard' && styles.activeButton,
                ]}
                onPress={() => changeMapStyle('standard')}>
                <Icon
                  name="map"
                  size={24}
                  color={activeStyle === 'standard' ? '#000' : '#fff'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.viewModeButton,
                  activeStyle === 'satellite' && styles.activeButton,
                ]}
                onPress={() => changeMapStyle('satellite')}>
                <Icon
                  name="satellite"
                  size={24}
                  color={activeStyle === 'satellite' ? '#000' : '#fff'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.viewModeButton,
                  activeStyle === 'traffic' && styles.activeButton,
                ]}
                onPress={() => changeMapStyle('traffic')}>
                <Icon
                  name="traffic"
                  size={24}
                  color={activeStyle === 'traffic' ? '#000' : '#fff'}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleRecenter}
              style={styles.buttonIocn}>
              <Icon name="my-location" size={40} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleZoomIn} style={styles.buttonIocn}>
              <Icon name="add" size={40} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleZoomOut} style={styles.buttonIocn}>
              <Icon name="remove" size={40} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Directions Modal */}
      <Modal
        visible={showDirectionsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDirectionsModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Get Directions</Text>
            <Text style={styles.modalText}>Do you want directions to this location?</Text>
            
            {loadingDirections ? (
              <ActivityIndicator size="large" color="#3bb2d0" />
            ) : (
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowDirectionsModal(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.directionsButton]}
                  onPress={getDirections}>
                  <Text style={styles.buttonText}>Get Directions</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
  viewModeContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    padding: 8,
    gap: 5,
  },
  buttonIocn: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  buttonHolder: {
    borderWidth: 2,
    position: 'absolute',
    width: 75,
    elevation: 10,
    backgroundColor: 'black',
    borderRadius: 10,
    bottom: 20,
    right: 20,
    alignItems: 'center',
    gap: 10,
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#fff',
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 999,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
  resultsContainer: {
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 200,
    elevation: 3,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultIcon: {
    marginRight: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  directionsButton: {
    backgroundColor: '#3bb2d0',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  directionsInfo: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    elevation: 3,
    zIndex: 999,
  },
  directionsInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  directionsText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  closeDirectionsButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
  },
});

export default MapView;