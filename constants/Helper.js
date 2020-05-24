import { AsyncStorage} from 'react-native';


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
