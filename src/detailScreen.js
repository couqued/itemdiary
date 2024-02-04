/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {useState, useEffect} from 'react';
 import {View, Text, StyleSheet, TextInput, SafeAreaView, Pressable, ScrollView} from 'react-native';
 import DateTimePickerModal from 'react-native-modal-datetime-picker';
 import {ko} from 'date-fns/locale';
 import {format} from "date-fns";
 import DetailHeader from './include/detailHeader';
 import ImageModal from 'react-native-image-modal';


 function DetailScreen ({navigation, route}) {

  const domain = 'http://127.0.0.1:8080';

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

   const [productData, setProductData] = useState("");
   const [seq, setSeq] = useState("");
   const [imageFilePath, setImageFilePath] = useState("");

   useEffect(() => {

    setProductData(route.params.data);
    onChangeTitle(route.params.data.TITLE);
    handleConfirm(route.params.data.DATE);
    onChangePrice(route.params.data.PRICE);
    onChangeLink(route.params.data.LINK);
    onChangeMemo(route.params.data.MEMO);
    setSeq(route.params.data.SEQ);
    setImageFilePath(route.params.data.IMAGE_FILE_PATH);

    return () => {
        
    };
  });

  return(
    <SafeAreaView style={{backgroundColor: '#FFFFFF', flex: 1}}>
      <DetailHeader productData={productData}/>
      <ScrollView>
        <View>
            {/* <Image
              source={
                imageFilePath
                ? {uri: domain+imageFilePath}
                : 0  //TODO default 이미지 추가 require('../assets/tmp.png)
              }
              style={styles.img}
            /> */}

            <ImageModal
              source={
                imageFilePath
                ? {uri: domain+imageFilePath}
                : 0  //TODO default 이미지 추가 require('../assets/tmp.png)
              }
              swipeToDismiss={true}
              resizeMode="contain"  //"contain", "cover", "stretch"
              imageBackgroundColor="#f2f2f2" //"#AAAAAA"
              // overlayBackgroundColor=""
              style={styles.img}
              
            />

            <Text style={{marginTop: 30, marginLeft: 10, color: "#787774"}}>제목</Text>
            <TextInput
              style={styles.title}
              maxLength={20}
              value={title}
              autoCapitalize={'none'}
              editable={false}
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
              placeholderTextColor="grey"
              maxLength={15}
              value={price === "" ? "" : price+"원"}
              autoCapitalize={'none'}
              keyboardType="number-pad" //numeric
              editable={false}
            />

            <Text style={styles.titleText}>링크</Text>
            <TextInput
              style={styles.title}
              placeholderTextColor="grey"
              maxLength={70}
              value={link}
              autoCapitalize={'none'}
              editable={false}
            />

            <Text style={styles.titleText}>메모</Text>
            <TextInput
              style={styles.memo}
              placeholderTextColor="grey"
              maxLength={100}
              value={memo}
              autoCapitalize={'none'}
              multiline={true}
              editable={false}
              numberOfLines={5}
            />
        </View>
        
      </ScrollView>
    </SafeAreaView>
    )
 }
 
 
const styles = StyleSheet.create({
  img: {
      //img 태그일때 S
        // height: 250,
        // width: '100%',
        // // marginTop: 20,
        // marginBottom: 30,
        // alignSelf: 'center',
      //img 태그일때 E

      // resizeMode: "contain", //이미지 비율 유지

      //iOS S
        // height: 250,
        // width: 380,
        // alignSelf: 'center',
      //iOS E
      
      //android S
      height: 250,
      width: 410,
      alignSelf: 'center',
      //android E
      transform:[{scale: 2}],

  },
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
  titleText: {
    marginLeft: 10,
    color: "#787774"
  }
  
});

 export default DetailScreen;
 