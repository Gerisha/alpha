import * as React from 'react';
import {Button,View,Platform} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default class PickImage extends React.Component{
    
    state={
        image:null,
    };
   render(){
    let {image} = this.state

   
   return(
    <View style={{ flex : 1, alignItems:"center",justifyContent:"center"}} >
    <Button
    title='pick image'
    onPress={this._pickImage}
    />


    </View>
   )


};
componentDidMount(){
    this.getPermissionAsync();
}


getPermissionAsync= async()=>{
    if(Platform.OS !=='web'){
        const{status}=await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if(status=='granted'){
            alert('WE NEED CAMERA PERMISSION!!!!')

        }
    }
}

uploadImage=async (uri)=>{
    const data = new FormData();
    let filename = uri.split("/")[uri.split("/").length - 1]
    let type =`image/${uri.split('.')[uri.split('.').length - 1]}`

    const fileToUpload = {
        uri: uri,
        name: filename,
        type: type,
    }

    data.append("digit",fileToUpload);
    fetch("https://b017-103-134-253-81.in.ngrok.io/predict-alphabet ",{
        method: "POST",
        body: data,
        headers: {
            "content-type": "multipart/form-data",
          },
    })
    .then((response) => response.json())
    .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });


};

_pickImage=async() => {
    try{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1
        });
        if (!result.cancelled){
            this.setState({image:result.data})
            this.uploadImage(result.uri)

        }

    }
    catch(E){

        console.log(E);
        
    }

}


}