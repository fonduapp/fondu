import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ListItem} from 'react-native-elements';

import { ExpoLinksView } from '@expo/samples';


const articleList =[
  {
  //component details pulled from database
  }
]

export default function ResourcesScreen() {
  return (
    <ScrollView style={styles.container}>
      {
        atricleList.map()(l,i)=>(
          <ListItem
            key ={i}
            title = {l.name}
            bottomDivider
            />
        ))
      }
      <ExpoLinksView />
    </ScrollView>
  );
}

ResourcesScreen.navigationOptions = {
  title: 'Resources',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
