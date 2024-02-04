/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import {View, StyleSheet, Text, Alert} from 'react-native';
import DetailTopButton from './detailTopButton';
import axios from 'axios';
import Splash from '../../src/utils/splash';

function DetailHeader ({productData}) {
  const [splash, setSplash] = useState(null);

  const navigation = useNavigation();

  const onGoBack = () => {
    navigation.pop();
  }

  const onDelete = () => {

    Alert.alert(
      '알림',
      '삭제하시겠습니까?',
      [
        {text: '취소', onPress: () => {}, style: 'cancel'},
        {
          text: '삭제',
          onPress: () => {
            prodDelete();
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

  // 상품 삭제 
  prodDelete = () => {
    setSplash(true);

    axios.post('http://127.0.0.1:8080/keepproduct/api/product/delete', {
      SEQ: productData.SEQ,
    })
    .then(result=>{
      setSplash(false);
      
      if(result.data > 0){
        console.log("prodDelete success");
        navigation.push("Main");
      }else{
        Alert.alert('', '삭제에 실패하였습니다. 다시 시도해주세요.', [{text: '확인'}]);
      }
    })
    .catch(function(error){
      setSplash(false);
      Alert.alert('', '일시적인 오류로 삭제에 실패하였습니다.', [{text: '확인'}]);
    })
   }

  const onModify = () => {
    navigation.push("Modify", {data: productData});
  }
 
  return(
    <View style={styles.block}>
      <View style={styles.iconButtonWrapper}>
        <DetailTopButton
          onPress={onGoBack}
          iconName={"chevron-back-outline"}
          iconSize={35}
        />
      </View>
      <View>
        <Text style={styles.text}>상세정보</Text>
      </View>
      <View style={styles.buttons}>
        <DetailTopButton
          onPress={onDelete}
          iconName={"trash-outline"}
          iconSize={30}
          hasMarginRight
        />
        <DetailTopButton
          onPress={onModify}
          iconName={"pencil-outline"}
          iconSize={30}
        />
        {/* iconName={"build-outline"} */}
      </View>
      {splash && <Splash />}
    </View>
    
    )
 }
 
 
const styles = StyleSheet.create({
  block: {
      height: 55,
      paddingHorizontal: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomColor: "#AAAAAA",
      borderBottomWidth: 1,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 50,
  },
});

 export default DetailHeader;
 