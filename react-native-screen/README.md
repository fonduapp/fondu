# Screen

This is a React Native component built to help aid in the mobile views designed using the [React Native Router Flux](http://google.com)

### Props
Prop Name            | Type      | Description
--------------------:|:---------:|------------
`backgroundColor`    |`String`   | Sets the background color of the screen
`backgroundImage`    |`<Image>`  | Sets the background of the screen to a React Native `<Image>` component
`fullScreen`         |`boolean`  | Tells the `<Screen>` that there is no navigation or tabs, so it should cover the whole screen with a default padding of `20` all around
`lightStatusBar`     |`boolean`  | Explicitly tell the screen to use a light (white) text status bar, otherwise defaults to dark (black) text
`paddingHorizontal`  |`number`   | Allows you to override the horizontal padding on the sides of the `<Screen>`
`tabs`               |`string`   | Tells the `<Screen>` to account for the tabs either `'top'`, `'bottom'`, or `'both'` based on the styles provided

### Why `{...this.props}`
Currently, You should explicitly pass `{...this.props}` into every on of your TSScreens because this allows the NavContainer to pass its props down to its children. Since `<Screen>` is technically a child of `<TSScreen>` that means it can only get the props from the NavContainer if the TSScreen passes them to it.

**By doing this, the `<Screen>` can listen for if the `navBar` prop is `false` or if there are specific styles to account for. If you don't do this, currently it could potentially cause UI bugs.**

### Examples

```javascript
  import Screen from 'react-native-screen';

  <Screen
    {...this.props}
    tabbar={'both'}   // Tabs are on top and bottom, so we must account for that on our render 
    paddingHorizontal={20}> // Set a padding of 20pts on each side
    <Text>My really cool Mobile Screen!</Text>
  </Screen> 
```