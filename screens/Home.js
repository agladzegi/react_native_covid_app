import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Picker} from '@react-native-community/picker';
import {countryArray} from '../countryArray';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {set} from 'react-native-reanimated';

const Home = ({navigation}) => {
  const [selected, setSelected] = useState('Georgia');
  const [byCountry, setByCountry] = useState(null);
  const [wholePlanet, setWholePlanet] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getWholePlanet();
  }, []);

  useEffect(() => {
    getByCountry();
  }, [selected]);

  const inputValueChange = (inputValue) => {
    setSelected(inputValue);
  };

  const getWholePlanet = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        'https://coronavirus-19-api.herokuapp.com/all',
      );

      setWholePlanet(res.data);
      setLoading(false);
    } catch (error) {
      console.log('Ops, something went wrong');
      setLoading(false);
    }
  };

  const getByCountry = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `https://coronavirus-19-api.herokuapp.com/countries/${selected}`,
      );

      setByCountry(res.data);
      setLoading(false);
    } catch (error) {
      console.log('Ops, something went wrong');
      setLoading(false);
    }
  };

  const handleClick = async () => {
    const url = `https://www.worldometers.info/coronavirus/`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log('Something went wrong');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={['#172C9B', '#2768BE']}
        style={styles.topContainer}>
        <Image
          style={{
            resizeMode: 'contain',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
          source={require('../assets/virus.png')}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
          }}>
          <Image
            style={{
              width: wp('100%'),
              height: hp('50%'),
              resizeMode: 'contain',
              marginTop: hp('20%'),
            }}
            source={require('../assets/doctor-header.png')}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center', zIndex: 100}}>
          <Text style={styles.headerText}>ატარე ნიღაბი და იყავი დაცული</Text>
        </View>
      </LinearGradient>
      <View style={styles.bottomContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.locationIcon}>
            <Icon name="place" size={25} color="#2768BE" />
          </View>
          <View style={styles.picker}>
            <Picker
              selectedValue={selected}
              onValueChange={(inputValue) => inputValueChange(inputValue)}>
              {countryArray
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((country) => {
                  return (
                    <Picker.Item
                      label={country.name}
                      value={country.name}
                      key={country.name}
                    />
                  );
                })}
            </Picker>
          </View>
        </View>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#2768BE" />
          </View>
        ) : (
          <>
            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>ბოლო ინფორმაცია</Text>
            </View>
            {byCountry ? (
              <View style={styles.casesContainer}>
                <View style={styles.caseInnerContainer}>
                  <View style={[styles.circle, {backgroundColor: '#FCD4C5'}]}>
                    <View
                      style={[
                        styles.circleInner,
                        {borderColor: '#FF884A'},
                      ]}></View>
                  </View>
                  <Text style={[styles.caseInnerNumber, {color: '#FF884A'}]}>
                    {byCountry.cases}
                  </Text>
                  <Text style={styles.caseInnerText}>დაინფიცირებული</Text>
                </View>
                <View style={styles.caseInnerContainer}>
                  <View style={[styles.circle, {backgroundColor: '#D5F9D2'}]}>
                    <View
                      style={[
                        styles.circleInner,
                        {borderColor: '#38C22E'},
                      ]}></View>
                  </View>
                  <Text style={[styles.caseInnerNumber, {color: '#38C22E'}]}>
                    {byCountry.recovered}
                  </Text>
                  <Text style={styles.caseInnerText}>გამოჯამრთელებული</Text>
                </View>
                <View style={styles.caseInnerContainer}>
                  <View style={[styles.circle, {backgroundColor: '#FFBFBF'}]}>
                    <View
                      style={[
                        styles.circleInner,
                        {borderColor: '#FF5757'},
                      ]}></View>
                  </View>
                  <Text style={[styles.caseInnerNumber, {color: '#FF5757'}]}>
                    {byCountry.deaths}
                  </Text>
                  <Text style={styles.caseInnerText}>გარდაცვლილი</Text>
                </View>
              </View>
            ) : (
              <View style={styles.casesContainer}>
                <Text>უპს, დაფიქსირდა შეცდომა...</Text>
              </View>
            )}
            <View style={styles.textContainer}>
              <Text style={styles.textTitle}>მსოფლიოს მაშტაბით</Text>
              <TouchableWithoutFeedback onPress={handleClick}>
                <Text style={styles.textDetails}>
                  დეტალების ნახვა{' '}
                  <Icon
                    name="near-me"
                    size={15}
                    style={{alignSelf: 'center'}}
                  />
                </Text>
              </TouchableWithoutFeedback>
            </View>
            {wholePlanet ? (
              <View style={styles.casesContainer}>
                <View style={styles.caseInnerContainer}>
                  <View style={[styles.circle, {backgroundColor: '#FCD4C5'}]}>
                    <View
                      style={[
                        styles.circleInner,
                        {borderColor: '#FF884A'},
                      ]}></View>
                  </View>
                  <Text style={[styles.caseInnerNumber, {color: '#FF884A'}]}>
                    {wholePlanet.cases}
                  </Text>
                  <Text style={styles.caseInnerText}>დაინფიცირებული</Text>
                </View>
                <View style={styles.caseInnerContainer}>
                  <View style={[styles.circle, {backgroundColor: '#D5F9D2'}]}>
                    <View
                      style={[
                        styles.circleInner,
                        {borderColor: '#38C22E'},
                      ]}></View>
                  </View>
                  <Text style={[styles.caseInnerNumber, {color: '#38C22E'}]}>
                    {wholePlanet.recovered}
                  </Text>
                  <Text style={styles.caseInnerText}>გამოჯამრთელებული</Text>
                </View>
                <View style={styles.caseInnerContainer}>
                  <View style={[styles.circle, {backgroundColor: '#FFBFBF'}]}>
                    <View
                      style={[
                        styles.circleInner,
                        {borderColor: '#FF5757'},
                      ]}></View>
                  </View>
                  <Text style={[styles.caseInnerNumber, {color: '#FF5757'}]}>
                    {wholePlanet.deaths}
                  </Text>
                  <Text style={styles.caseInnerText}>გარდაცვლილი</Text>
                </View>
              </View>
            ) : (
              <View style={styles.casesContainer}>
                <Text>უპს, დაფიქსირდა შეცდომა...</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  topContainer: {
    flex: 2,
    backgroundColor: 'green',
    flexDirection: 'row',
    overflow: 'hidden',
    borderBottomEndRadius: wp('20%'),
    borderBottomStartRadius: wp('20%'),
  },
  bottomContainer: {
    flex: 4,
  },
  headerText: {
    color: '#fff',
    fontSize: wp('5%'),
  },
  inputContainer: {
    width: wp('90%'),
    // flex: 1,
    flexDirection: 'row',
    height: hp('8%'),
    borderRadius: wp('5%'),
    borderWidth: 1,
    borderColor: '#dedede',
    marginTop: wp('6%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  picker: {
    flex: 7,
    justifyContent: 'center',
  },
  locationIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  casesContainer: {
    width: wp('90%'),
    height: hp('15%'),
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    flexDirection: 'row',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#f7f7f7',
    borderRadius: wp('5%'),
    marginTop: hp('2%'),
  },
  textContainer: {
    width: wp('90%'),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('4%'),
    alignItems: 'center',
  },
  textTitle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: wp('4.3%'),
  },
  textDetails: {
    color: '#2768BE',
    fontSize: wp('3%'),
  },
  circle: {
    width: wp('6%'),
    height: hp('3%'),
    borderRadius: wp('50%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    width: wp('3%'),
    height: hp('1.5%'),
    borderRadius: wp('50%'),
    borderWidth: 2,
  },
  caseInnerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  caseInnerNumber: {
    marginTop: wp('3.5%'),
    fontSize: wp('5%'),
  },
  caseInnerText: {
    color: '#a8a8a8',
    fontSize: wp('2.5%'),
    marginTop: wp('1%'),
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
