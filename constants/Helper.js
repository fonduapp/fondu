import React, { Component } from 'react';
import {
  AsyncStorage,
  Text,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';


export async function _getAuthTokenUserId(){
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    const userId = await AsyncStorage.getItem('userId');
    console.log("authToken:" + authToken);

    return {authToken: authToken, userId: userId};
    }catch(error){
    	console.log("error: " + error);
    }
  }

/*When using renderText and createISC make sure to bind the functions
  within the constructor:

  this.renderText = renderText.bind(this);
  this.createISC = createISC.bind(this);
  */

  /* renderText returns a list of the text within the specified tag*/
  /*if you need to add tags you can format it as
  else if (tag == 'whatver identifier you want'){
    pattern = /<tag>(.*?)<\/tag>/gi;*/

export function renderText(content, tag) {
        let pattern;
    if (tag == 'descript'){
      pattern = /<Description>(.*?)<\/Description>/i;
    }else if (tag == 'example'){
      pattern = /<Example>(.*?)<\/Example>/i;
    }else if (tag == 'question'){
      pattern = /<Question>(.*?)<\/Question>/i;
    }else if (tag == 'answer'){
      pattern = /<Answer>(.*?)<\/Answer>/i;
    }else if (tag == 'theory'){
      pattern = /<Theory>(.*?)<\/Theory>/i;
    }else if (tag == 'research'){
        pattern = /<Research>(.*?)<\/Research>/gi;
    }else if (tag == 'suggestion'){
        pattern = /<Suggestion>(.*?)<\/Suggestion>/gi;
    }else if (tag == 'ref'){
        pattern = /<Reference>(.*?)<\/Reference>/gi;
    }else if (tag == 'isc'){
        pattern = /<isc>(.*?)<\/isc>/gi;
    }
    //console.log(tag)
    //console.log(content.match(pattern))
    return content.match(pattern);
  }

//parses through text with given tags, and turns the isc into a button
export function createISC(text, tag, endtag){
      //console.log("tag to read\t\t\t"+tag);
      let result = text.map((res,i) =>{
        res = res.replace(tag,'');
        res = res.replace(endtag,'');
        var citList = this.renderText(res, 'isc');
        var start = 0;
        if (citList){
        let citations = citList.map((cit,i) =>{
          var index = res.indexOf('<isc>',start);
          var sub = res.substring(start, index);
          start = res.indexOf('</isc>') + 6;
          cit = cit.replace('<isc>','');
          cit = cit.replace('</isc>','');
          return <Text style = {{flexDirection: 'row'}}>
            <Text>{sub}</Text>
            <Text style = {{fontWeight:"bold"}} onPress={() => this.setState({showRef:true})}>{cit}</Text>
            </Text>
        });
        var remaining = res.substring(start);
        return<Text style = {{flexDirection: 'row'}}>
          {citations}
          <Text>{remaining}</Text>
          </Text>
        }else{
          return<Text style = {{flexDirection: 'row'}}>
            <Text>{res}</Text>
            </Text>
        }
      });
      return result;
    }
