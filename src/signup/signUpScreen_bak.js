/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {useState, useRef} from 'react';
 import {Text, StyleSheet, SafeAreaView, View, Platform, Keyboard, KeyboardAvoidingView} from 'react-native';

 import SignUpInput from './signUpInput'
 import SignUpButton from './signUpButton'

 function SignUpScreen ({navigation, route}) {
   const {isSignUp} = route.params ?? {};
   const [form, setForm] = useState({
     email: '',
     password: '',
     confirmPassword: '',
   });

   const createChangeTextHandler = (name) => (value) => {
     setForm({...form, [name]: value});
   };

   const passwordRef = useRef();
   const confirmPasswordRef = useRef();

   const onSubmit = () => {
     Keyboard.dismiss();
     console.log(form);
   };

  return(
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.select({ios: 'padding'})}
    >
      <SafeAreaView style={styles.fullScreen}>
        <Text style={styles.text}>Sing Up!</Text>
        <View style={styles.form}>
          <SignUpInput 
            hasMarginBottom 
            placeholder="email"
            value={form.email}
            onChangeText={createChangeTextHandler('email')}
            autoCapitalize="none"
            autoCorrect={false}
            autoCompleteType="email"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
          />
          <SignUpInput 
            placeholder="password" 
            hasMarginBottom={isSignUp} 
            value={form.password}
            onChangeText={createChangeTextHandler('password')}
            secureTextEntry
            ref={passwordRef}
            returnKeyType={isSignUp ? 'next' : 'done'}
            onSubmitEditing={() => {
              if(isSignUp){
                confirmPasswordRef.current.focus();
              }else{
                onSubmit();
              }
            }}
          />
          {isSignUp && (
            <SignUpInput 
              placeholder="password confirm" 
              value={form.confirmPassword}
              onChangeText={createChangeTextHandler('confirmPassword')}
              secureTextEntry
              ref={confirmPasswordRef}
              returnKeyType="done"
              onSubmitEditing={onSubmit}
            />
          )}
          <View style={styles.buttons}>
            {isSignUp ? (
              <>
                <SignUpButton 
                  title="sign up" 
                  hasMarginBottom 
                  onPress={onSubmit}
                />
                <SignUpButton 
                  title="login" 
                  theme="secondary" 
                  onPress={() => {
                    navigation.goBack();
                  }}
                />
                </>
            ) : (
              <>
                <SignUpButton 
                  title="login" 
                  hasMarginBottom
                  onPress={onSubmit}
                />
                <SignUpButton 
                  title="sign up" 
                  theme="secondary" 
                  onPress={() => {
                    navigation.push('SignUp', {isSignUp: true});
                  }}
                />
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
  
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
  buttons: {
    marginTop: 64,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
 });

 export default SignUpScreen;
 