/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 
 import React, {useState, useEffect} from 'react';
 import {View, Text, StyleSheet, TextInput, SafeAreaView, Alert
      , ScrollView, TouchableOpacity} from 'react-native';
 import UserQuitHeader from './include/userQuitHeader';
 import axios from 'axios';
 import AsyncStorage from "@react-native-async-storage/async-storage";
 import Splash from '../src/utils/splash';

 function UserQuitScreen ({navigation}) {

  const domain = 'http://127.0.0.1:8080';

  const [splash, setSplash] = useState(null);
  const [password, setPassword] = useState("");
  const onChangePassword = (password) => {
    setPassword(password);
  }

  const [userId, setUserId] = useState("");
  
   const onQuit = () => {
    Alert.alert(
      '',
      '정말 탈퇴 하시겠습니까?',
      [
        {text: '취소', onPress: () => {}, style: 'cancel'},
        {
          text: '탈퇴하기',
          onPress: () => {
            // AsyncStorage.removeItem('userInfo');
            // navigation.reset({routes: [{name: "SignUp"}]})
            ajaxQuit();
          },
          style: 'destructive',
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      },
    );
   } 

   //탈퇴하기
  const ajaxQuit = () => {

    if(null === password || "" == password.trim()){
      Alert.alert(
        '', '패스워드를 입력해주세요.', [{text: '확인'}]
      );
      return;
    }
    
    //TODO getItem 확인 
    AsyncStorage.getItem('userInfo', (err, result) => { 
      const resultUserInfo = JSON.parse(result);
      
      storageUserInfo = (null === resultUserInfo) ? "" : resultUserInfo.userId;

      if(null !== storageUserInfo && undefined !== storageUserInfo && "" !== storageUserInfo){
        setUserId(storageUserInfo);
      }else{
        // TODO error
        alert('ID를 확인할 수 없습니다.')
      }
    });

    setSplash(true);
    axios.post('http://127.0.0.1:8080/keepproduct/api/user/quit', {
      USER_ID: userId,
      USER_PASSWORD: password
    })
    .then(result=>{
      setSplash(false);

      if(result.data > 0){
        AsyncStorage.removeItem('userInfo');
        navigation.reset({routes: [{name: "SignUp"}]})

        // Alert.alert(
        //   '탈퇴처리가 완료되었습니다. 다시 이용을 원하시는 경우 회원가입 후 이용해주세요.', [
        //       {text: '확인', onPress: () => navigation.push('SignUp')},
        //   ]
        // );

      }else{
        Alert.alert('', '아이디 또는 비밀번호를 확인해주세요.', [{text: '확인'}]);
      }
    })
    .catch(function(error){
      setSplash(false);
      Alert.alert('', '일시적인 오류로 탈퇴처리에 실패하였습니다.', [{text: '확인'}]);
    })
   }

  return(
    <SafeAreaView style={{backgroundColor: '#FFFFFF', flex: 1}}>
      <UserQuitHeader />
      <ScrollView>
        <View>
            <Text style={{marginTop: 30, marginLeft: 10, marginLeft: 10}}>패스워드</Text>
            <TextInput
              style={styles.title}
              maxLength={30}
              value={password}
              autoCapitalize={'none'}
              placeholderTextColor="grey"
              onChangeText={(password)=>onChangePassword(password)}
              placeholder="패스워드를 입력해주세요."
              secureTextEntry
              returnKeyType="done"
            />

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
              onPress={()=>onQuit()}
            >
              <Text style={{ color: 'white', fontSize: 18}}>탈퇴하기</Text>
            </TouchableOpacity>

        </View>
      </ScrollView>
      {splash && <Splash />}
    </SafeAreaView>
    )
 }
 
 
const styles = StyleSheet.create({
  
  title: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    fontSize: 20,
    padding: 10,
    borderBottomColor: "#AAAAAA",
    //borderTopWidth: 1,
    borderBottomWidth: 1,
    color: 'black',
  },
  
});

export default UserQuitScreen;
 