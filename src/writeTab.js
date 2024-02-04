/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {Component, useState} from 'react';
 import {View, Text, StyleSheet, Image, TextInput, SafeAreaView
  , Pressable, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Alert, TouchableOpacity} from 'react-native';
 import {launchCamera, launchImageLibrary, showImagePicker} from 'react-native-image-picker';
 import axios from 'axios';
 import DateTimePickerModal from 'react-native-modal-datetime-picker';
 import {ko} from 'date-fns/locale';
 import {format} from "date-fns";
 import RegisterHeader from './include/registerHeader';
 import AsyncStorage from "@react-native-async-storage/async-storage";
 import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
 import Splash from '../src/utils/splash';

 function TabWriteScreen ({navigation}) {

  const [splash, setSplash] = useState(null);

   //제목
   const [title, setTitle] = useState("");
   const onChangeTitle = (title) => {
    setTitle(title);
   }

   //날짜
   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
   const [date, onChangeDate] = useState(new Date());
   
   const showDatePicker = () => {
     setDatePickerVisibility(true);
   }
   const hideDatePicker = () => {
     setDatePickerVisibility(false);
   }

   const handleConfirm = (date) => {
     onChangeDate(date);
     console.log("A date has been picked : ", date);
     hideDatePicker();
   }

   //가격
   const [price, setPrice] = useState("");
   const onChangePrice = (price) => {
    let commaPrice = price.replace(/[^\d]+/g, ''); 
    commaPrice = commaPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
    setPrice(commaPrice);
   }

   //링크
   const [link, setLink] = useState("");
   const onChangeLink = (link) => {
    setLink(link);
   }

   //메모
   const [memo, setMemo] = useState("");
   const onChangeMemo = (memo) => {
    setMemo(memo);
   }

   //이미지
   const [response, setResponse] = useState("");
   const [imageFile, setImageFile] = useState("");

   const [userId, setUserId] = useState("");

   AsyncStorage.getItem('userInfo', (err, result) => { 
      const resultUserInfo = JSON.parse(result);
      
      storageUserInfo = (null === resultUserInfo) ? "" : resultUserInfo.userId;

      if(null !== storageUserInfo && undefined !== storageUserInfo && "" !== storageUserInfo){
        setUserId(storageUserInfo);
      }else{
        // TODO error
        navigation.push('SignUp');
      }
  });


   // 이미지 가져오기
   const onSelectImage = () => {
    launchImageLibrary(
      {
        madiaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        // includeBase64: Platform.OS === 'android'
        includeBase64: true
      }, 
      (response) => {
        console.log(response)
        // console.log(response.assets[0].base64)
        if(response.didCancel){
          return;
        }else if(response.errorCode){
          console.log("Image Error : " + response.errorCode);
        }
        // Platform.OS === 'android' ? response.assets[0].uri : response.assets[0].uri.replace('file://', '');
        
        setResponse(response);
        setImageFile(response.assets[0].base64);
     })

   }

   // 상품저장
   const prodRegister = () => {

    if(null === title || "" == title.trim()){
      Alert.alert(
        '', '제목을 입력해주세요.', [{text: '확인'}]
      );
      return;
    }

    setSplash(true);

    axios.post('http://127.0.0.1:8080/keepproduct/api/product/register', {
      USER_ID: userId,
      TITLE: title,
      DATE: date,
      PRICE: price,
      LINK: link,
      MEMO: memo,
      IMG: imageFile
    })
    .then(result=>{
      setSplash(false);
      if(result.data > 0){
        navigation.push("Main");
      }else{
        Alert.alert('', '저장에 실패하였습니다. 다시 시도해주세요.', [{text: '확인'}]);
      }
    })
    .catch(function(error){
      setSplash(false);
      Alert.alert('', '일시적인 오류로 저장에 실패하였습니다.', [{text: '확인'}]);
    })
   }

  return(
    <KeyboardAwareScrollView
      style={styles.KeyboardAwareScrollView}
      behavior={Platform.select({ios: 'padding'})}
      onPress={Keyboard.dismiss}
    >
      <SafeAreaView style={{backgroundColor: '#FFFFFF'}}>
        <RegisterHeader prodRegister={prodRegister} />
        <ScrollView>
          <View>
              <Image
                source={
                  response
                  ? {uri: response.assets[0].uri}
                  : 0
                }
                style={styles.img}
              />

              {/* <Button
                title="이미지 추가하기"
                onPress={()=>this.onSelectImage()}
              /> */}

              <TouchableOpacity
                  style={{ 
                    backgroundColor: '#4287f5',
                    padding: 12,
                    borderRadius: 8,
                    marginTop: 20,
                    marginLeft: 60,
                    marginRight: 60,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={()=>onSelectImage()}
              >
                  <Text style={{ color: 'white', fontSize: 18}}>이미지 추가하기</Text>
              </TouchableOpacity>
              
              <View style={{margin: 15}}></View>
              <Text style={styles.titleText}>제목</Text>
              <TextInput
                style={styles.title}
                //placeholder="제목을 입력해주세요."
                placeholderTextColor="grey"
                maxLength={20}
                onChangeText={(text)=>onChangeTitle(text)}
                value={title}
                autoCapitalize={'none'}
                returnKeyType="next"
              />

              <Text style={styles.titleText}>구입날짜</Text>
              <View>
                <Pressable onPress={showDatePicker}>
                  <Text style={styles.date}>
                    {format(new Date(date), 'PPP', {locale: ko})}
                  </Text>
                </Pressable>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker} 
                />
              </View>
              
              <Text style={styles.titleText}>가격</Text>
              <TextInput
                style={styles.title}
                //placeholder="가격을 입력해주세요."
                placeholderTextColor="grey"
                maxLength={15}
                onChangeText={(text)=>onChangePrice(text)}
                value={price}
                autoCapitalize={'none'}
                keyboardType="number-pad" //numeric
                returnKeyType="next"
              />

              <Text style={styles.titleText}>링크</Text>
              <TextInput
                style={styles.title}
                //placeholder="링크가 있으면 입력해주세요."
                placeholderTextColor="grey"
                maxLength={70}
                onChangeText={(text)=>onChangeLink(text)}
                value={link}
                autoCapitalize={'none'}
                keyboardType="url"
                returnKeyType="next"
              />

              <Text style={styles.titleText}>메모</Text>
              <TextInput
                style={styles.memo}
                //placeholder="메모 해주세요."
                placeholderTextColor="grey"
                maxLength={100}
                onChangeText={(text)=>onChangeMemo(text)}
                value={memo}
                autoCapitalize={'none'}
                multiline={true}
                numberOfLines={5}
              />
              
              {/* <TouchableOpacity
                style={{width:'100%', backgroundColor:'#ffa500', height:50, }}
                onPress={()=>this.prodRegister()}
              >
              <View style={{alignItems:'center', justifyContent: 'center', padding:15}}>
                <Text style={{fontSize:20}}>완료</Text>
              </View>
              </TouchableOpacity> */}
              
          </View>
        </ScrollView>
        {splash && <Splash />}
      </SafeAreaView>
    </KeyboardAwareScrollView>
    )
 }
 
 
const styles = StyleSheet.create({
  img: {
      height: 120,
      width: 120,
      marginTop: 20,
      marginBottom: 20,
      alignSelf: 'center',
  },
  title: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    fontSize: 20,
    padding: 10,
    borderBottomColor: "#AAAAAA",
    borderBottomWidth: 1,
    //borderTopWidth: 1,
    color: 'black',
  },
  date: {
    width: '50%',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    fontSize: 20,
    padding: 10,
    borderBottomColor: "#AAAAAA",
    borderBottomWidth: 1,
    alignContent: 'center',
    color: 'black',
    
  },
  memo: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    fontSize: 20,
    padding: 10,
    borderBottomColor: "#AAAAAA",
    borderBottomWidth: 1,
    height: 150,
    textAlignVertical: 'top',
    color: 'black',
  },
  KeyboardAwareScrollView: {
    flex: 1,
  },
  titleText: {
    marginLeft: 10,
    color: "#787774"
  }
  
});

 export default TabWriteScreen;
 