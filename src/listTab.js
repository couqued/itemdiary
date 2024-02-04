/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import { useIsFocused } from '@react-navigation/native';
 import React, {useState, useEffect} from 'react';
 import {View, Text, StyleSheet, Image, SafeAreaView, FlatList, TouchableOpacity
      , Alert, BackHandler, ToastAndroid, StatusBar} from 'react-native';
 import axios from 'axios';
 import AsyncStorage from "@react-native-async-storage/async-storage";
 import sample from '../src/assets/sample.jpeg';
 import Splash from '../src/utils/splash';
 
 
 function TabListScreen ({navigation}){
    const isFocused = useIsFocused(); // 페이지 전환됐을떄 (포커스가 변경되었을때) 감지하여 useEffect 함수 실행
    const domain = 'http://127.0.0.1:8080';
    const [productList, setProductList] = useState("");
    const [splash, setSplash] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    let isExitApp, timeout;

    StatusBar.setBarStyle('dark-content');  // 상단 상태바 글자색 어둡게 설정
    
    useEffect(() => {
      
      if(isFocused){
        AsyncStorage.getItem('userInfo', (err, result) => { 
          const resultUserInfo = JSON.parse(result);
          storageUserInfo = (null === resultUserInfo) ? "" : resultUserInfo.userId;
          
          if(null !== storageUserInfo && undefined !== storageUserInfo && "" !== storageUserInfo){
            prodList(storageUserInfo);
          }else{
            // TODO error
            navigation.push('SignUp');
          }
        });
      }

      // 안드로이드 기기 뒤로가기 버튼
      const backAction = () => {
        console.log('backAction')
        
        // if(navigation.isFocused()){
        //   Alert.alert(
        //     '알림',
        //     '앱을 종료하시겠습니까?',
        //     [
        //       {text: '취소', onPress: () => {}, style: 'cancel'},
        //       {text: '확인', onPress: () => {BackHandler.exitApp();}, style: 'destructive'},
        //     ],
        //     {cancelable: true, onDismiss: () => {}},
        //   );
        //   return true;
        // }else{
        //   navigation.goBack();
        //   return true;
        // }

        // S
        if(navigation.isFocused()){
          if (isExitApp == undefined || !isExitApp) {
            ToastAndroid.show('뒤로 버튼을 한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
            isExitApp = true;
            timeout = setTimeout(
                () => {
                  isExitApp = false;
                },
                3000    // 3초
            );
          } else {
              clearTimeout(timeout);
              BackHandler.exitApp();  // 앱 종료
          }
          return true;
          
        }else{
            navigation.goBack();
            return true;
        }
        // E
      }
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
      return () => backHandler.remove();

    }, [isFocused]);

    //가격
   const [price, setPrice] = useState("");
   const onChangePrice = (price) => {
    let commaPrice = price.replace(/[^\d]+/g, ''); 
    commaPrice = commaPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
    setPrice(commaPrice);
   }
   
 const renderData = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        margin: 5,
      }}
    >
      <TouchableOpacity style={styles.itemTouch} 
        onPress={()=>goDetail(item)}
        >
          <Image
            source={
              item.IMAGE_FILE_PATH
              ? {uri: domain+item.IMAGE_FILE_PATH}
              : sample  //TODO default 이미지 추가 require('../assets/tmp.png)
            }
            style={styles.imgCover}
          />

          {/* <Image source={{uri: domain+item.IMAGE_FILE_PATH}} style={styles.imgCover}/> */}
          {/* <Image source={{uri: `data:image/png;base64,{item.IMG}`}} style={styles.imgCover}/> */}

          <View style={styles.itemView}>
            <Text style={styles.title}>{item.TITLE}</Text>
            <View style={styles.dateAndPrice}>
              <Text style={styles.date}>{item.DATE.substring(0,10)}</Text>
            </View>
            <View>
              <Text style={styles.price}>
                {item.PRICE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
              </Text>
            </View>
          </View>
      </TouchableOpacity>
    </View>
  );
  
  goDetail = (item) => {
    // alert(DeviceInfo.getUniqueId);
    navigation.push("Detail", {data: item});
  }
  
  // 상품 리스트 조회
  prodList = (userId) => {
    
    setSplash(true);
    
    axios.post('http://127.0.0.1:8080/keepproduct/api/product/list', {
      USER_ID: userId 
    })
    .then(function(response){
      setProductList(response.data.result);
      setSplash(false);
    })
  
    // .then(result=>{
    //   alert(JSON.stringify(result.data));
    //   this.setState(
    //     {title: result.data.title}
    //   )
    // })
    .catch(function(error){
      setSplash(false);
      Alert.alert('', '일시적인 오류로 조회에 실패하였습니다.', [{text: '확인'}]);
    })
    
   }
   
  const goWrite = () => {
    navigation.push('Write');
  }

  const onRefresh = () => {
    if(!refreshing){
      getRefreshData();
    }
  }

  const getRefreshData = () => {
    setRefreshing(true);
    prodList(storageUserInfo);
    setRefreshing(false);
  }

  return(
    <SafeAreaView style={{flex: 1}}>

      <FlatList
        data={productList}
        renderItem={renderData}
        keyExtractor={(data)=>data.SEQ}
        style={{margin: 0, backgroundColor: "#FFFFFF"}}
        numColumns={1}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />

      {splash && <Splash />}

      {/* 글쓰기 (+) 버튼 
       <TouchableOpacity 
        // onPress={()=>navigation.push('Write')}
        onPress={()=>goWrite()}
      >
        <View style={styles.circleButton}>
            <Text style={styles.circleButtonLabel}>+</Text>
        </View>
      </TouchableOpacity> */}

    </SafeAreaView>

  )
}

 const styles = StyleSheet.create({
    itemTouch: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderBottomColor: "#e2e3da",  //AAAAAA
        borderBottomWidth: 2,
        padding: 1,
        height: '100%',
        width: '100%',
    },
    imgCover: {
        flex: 2,
        width: '100%',
        height: '100%',
        // resizeMode: "contain", //이미지 비율 유지
        resizeMode: "cover",
    },
    itemView: {
        flex: 3,
        alignItems: "flex-end",
        flexDirection: "column",
        alignSelf: "center",
        padding: 10
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      alignSelf: "flex-start",
    },
    date: {
      fontSize: 16,
      // backgroundColor: "#F0F8FF",
      color: "#787774",
      borderRadius: 30,
      padding:3,
    },
    price: {fontSize: 18, marginTop: 10},
    dateAndPrice: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },

    circleButton: {
      backgroundColor: '#4287f5', //'orange',
      width: 65,
      height: 65,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      right: 40,
      bottom: 40,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 5,
      elevation: 8,
    },
    circleButtonLabel: {
      color: '#fff',
      fontSize: 32,
      lineHeight: 32,
      fontWeight: 'bold',
    },
    
 });
 
 export default TabListScreen;
 