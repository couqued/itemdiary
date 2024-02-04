/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 
 import React, {useState, useEffect} from 'react';
 import axios from 'axios';
 import {Text, StyleSheet, SafeAreaView, View, Platform, 
  Keyboard, KeyboardAvoidingView, Alert} from 'react-native';

 import SignUpForm from './signUpForm';
 import SignUpButton from './signUpButton';
 import AsyncStorage from "@react-native-async-storage/async-storage";
 import InitSplash from 'react-native-splash-screen';
 import Splash from '../../src/utils/splash';
 import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

 function SignUpScreen ({navigation, route}) {
   const [splash, setSplash] = useState(null);

   const {isSignUp} = route.params || {};
   const [form, setForm] = useState({
     email: '',
     password: '',
     confirmPassword: '',
   });

   InitSplash.hide();   

  state = {
    isSignUp : false
  }

   useEffect(() => {
    loginChk();
    async function loginChk(){
      await AsyncStorage.getItem('userInfo', (err, result) => { 
        const resultUserInfo = JSON.parse(result);
        storageUserInfo = (null === resultUserInfo) ? "" : resultUserInfo.userId;
        
        if(null !== storageUserInfo && undefined !== storageUserInfo && "" !== storageUserInfo){
          this.state.isSignUp = true;
          navigation.navigate('Main');
        }else{
          this.state.isSignUp = false;
          // TODO error
        }
      });
      
     }
  }, []);

   const [loading, setLoading] = useState();

   const createChangeTextHandler = (name) => (value) => {
     setForm({...form, [name]: value});
   };

   const checkEmail = (str) => {
        var emailCheck = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
        if(!emailCheck.test(str)) {
          return false;
        }else {
          return true;
        }
    }

   const onSubmit = async () => {
     Keyboard.dismiss();

     const {email, password, confirmPassword} = form;
     const info = {email, password, confirmPassword};
     
     if(null === email || "" == email.trim()){
        Alert.alert('', '이메일을 입력해주세요.', [{text: '확인'}]);
        return;
     }else{
        if(!checkEmail(email))	{
          Alert.alert('', '이메일 형식이 잘못되었습니다.', [{text: '확인'}]);
          return;
        }
     }

     if(null === password || "" == password.trim()){
      Alert.alert('', '비밀번호를 입력해주세요.', [{text: '확인'}]);
      return;
     }
     if(isSignUp && (password !== confirmPassword)){
      Alert.alert('', '비밀번호가 일치하지 않습니다. 동일한 비밀번호를 입력해주세요.', [{text: '확인'}]);
      return;
     }

     setLoading(true);

    try {
      // const {user} = isSignUp ? await signUp(info) : await logIn(info);
      isSignUp ? await signUp(info) : await logIn(info);
      
    } catch (e) {
      Alert.alert('', '일시적인 오류입니다. 잠시 후 다시 이용해주세요.', [{text: '확인'}]);
      console.log("error : " + e);
    } finally {
      setLoading(false);
    }
   };

  const logIn = ({email, password}) => {
    setSplash(true);

    axios.post('http://127.0.0.1:8080/keepproduct/api/user/login', {
      USER_ID: email, USER_PASSWORD: password
    })
    .then(result=>{
      setSplash(false);
      if(result.data.SUCCESS){
        AsyncStorage.setItem('userInfo', JSON.stringify({'userId': email}), () => {
          console.log("AsyncStorage set userId success");
        });
        
        navigation.push('Main');
      }else{
        console.log("login error : " + JSON.stringify(result.data));
        Alert.alert('', result.data.MESSAGE, [{text: '확인'}]);
      }
    })
    .catch(function(error){
      setSplash(false);
      console.log('login catch error : '+JSON.stringify(error));
      Alert.alert('', '아이디 또는 패스워드를 확인해주세요.', [{text: '확인'}]); //TODO 메시지 처리 확인 (서버 메시지 받아서 처리)
    })
  }

  const signUp = ({email, password}) => {
    setSplash(true);

    axios.post('http://127.0.0.1:8080/keepproduct/api/user/duplicateIdCheck', {
      USER_ID: email
    })
    .then(result=>{
      if(!result.data){
        userSave({email, password});
      }else{
        setSplash(false);
        Alert.alert('', '이미 사용중인 아이디 입니다.', [{text: '확인'}]);
      }
    })
    .catch(function(error){
      setSplash(false);
      console.log('signUp catch error : '+JSON.stringify(error));
      Alert.alert('', "일시적인 오류로 회원가입에 실패하였습니다. 잠시 후 다시 이용해주세요.", [{text: '확인'}]);
    })
}

const userSave = ({email, password}) => {
  axios.post('http://127.0.0.1:8080/keepproduct/api/user/userIdRegister', {
    USER_ID: email,
    USER_PASSWORD: password
  })
  .then(result=>{
    setSplash(false);
    if(result.data > 0){
      Alert.alert(
        '회원가입이 완료되었습니다.', '로그인 후 이용해주세요.', [
            {text: '로그인', onPress: () => navigation.push('SignUp', {isSignUp: false})},
        ]
      );
    }else{
      Alert.alert('', '일시적인 오류로 회원가입에 실패하였습니다. 다시 시도해주세요.', [{text: '확인'}]);
    }
  })
  .catch(function(error){
    setSplash(false);
    console.log('userIdRegister catch error : '+JSON.stringify(error));
    Alert.alert('', '일시적인 오류로 회원가입에 실패하였습니다.', [{text: '확인'}]);
  })
}

  return(
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.select({ios: 'padding'})}
      onPress={Keyboard.dismiss}
    >
      <SafeAreaView style={styles.fullScreen}>
        <Text style={styles.text}>아이템 다이어리</Text>
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
        {splash && <Splash />}
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

 export default SignUpScreen;
 