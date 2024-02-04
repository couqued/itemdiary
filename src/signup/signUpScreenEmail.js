/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 //아직사용안함 
 //TODO 이메일 인증 개발
 import React, {useState} from 'react';
 import axios from 'axios';
 import {Text, StyleSheet, SafeAreaView, View, Platform, 
  Keyboard, KeyboardAvoidingView, Alert} from 'react-native';

 import SignUpForm from './signUpForm';
 import SignUpButton from './signUpButton';
 import AsyncStorage from "@react-native-async-storage/async-storage";


 function SignUpScreenEmail ({navigation, route}) {   

   const onSubmit = async () => {
     Keyboard.dismiss();
     
     if(null === email || "" == email){
      Alert.alert("이메일을 입력해주세요.");
      return;
     }
     if(null === password || "" == password){
      Alert.alert("비밀번호를 입력해주세요.");
      return;
     }
     if(isSignUp && (password !== confirmPassword)){
       Alert.alert("비밀번호가 일치하지 않습니다. 동일한 비밀번호를 입력해주세요.");
       return;
     }

     setLoading(true);

    try {
      // const {user} = isSignUp ? await signUp(info) : await logIn(info);
      isSignUp ? await signUp(info) : await logIn(info);
      
    } catch (e) {
      Alert.alert('일시적인 오류입니다. 잠시 후 다시 이용해주세요.');
      console.log("error : " + e);
    } finally {
      setLoading(false);
    }
   };

  const logIn = ({email, password}) => {
    axios.post('http://127.0.0.1:8080/keepproduct/api/user/login', {
      USER_ID: email, USER_PASSWORD: password
    })
    .then(result=>{
      if(result.data.SUCCESS){
        AsyncStorage.setItem('userInfo', JSON.stringify({'userId': email}), () => {
          console.log("AsyncStorage set userId success");
        });
        
        navigation.push('Main');
      }else{
        Alert.alert(result.data.MESSAGE);
      }
    })
    .catch(function(error){
      console.log('login catch error : '+JSON.stringify(error));
      Alert.alert("일시적인 오류로 로그인에 실패하였습니다. 잠시 후 다시 이용해주세요.");
    })
  }

  const signUp = ({email, password}) => {
    axios.post('http://127.0.0.1:8080/keepproduct/api/user/duplicateIdCheck', {
      USER_ID: email
    })
    .then(result=>{
      if(!result.data){
        userSave({email, password});
      }else{
        Alert.alert("이미 사용중인 아이디 입니다.");
      }
    })
    .catch(function(error){
      console.log('signUp catch error : '+JSON.stringify(error));
      Alert.alert("일시적인 오류로 회원가입에 실패하였습니다. 잠시 후 다시 이용해주세요.");
    })
}

  return(
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.select({ios: 'padding'})}
    >
      <SafeAreaView style={styles.fullScreen}>
        <Text style={styles.text}>Items Diary</Text>
        <View style={styles.form}>
          <SignUpForm
            isSignUp={isSignUp}
            onSubmit={onSubmit} 
            form={form}
            createChangeTextHandler={createChangeTextHandler}
          />
          <SignUpButton 
            isSignUp={isSignUp}
            onSubmit={onSubmit}
            loading={loading}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
 }

 const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 64,
    width: '100%',
    paddingHorizontal: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
 });

 export default SignUpScreenEmail;
 