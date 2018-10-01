import React from 'react';
import { StyleSheet, Text, View, WebView, Linking, Button, TouchableOpacity } from 'react-native';

const BACKEND_URL = 'https://example.com';
const WEBVIEW_FRONTEND_URL = `${BACKEND_URL}/mobile-app-ui`;
const OAUTH_CLIENT_ID = '42aa4b21b7aed1fea4ae80a68f0e17a73c3f379fde0c72b1211fd38014a2f56c';
const CALLBACK_URL = 'bettermask://bettermask';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    backgroundColor: '#fafafa',
  },
  webView: {
    width: '100%',
    flex: 1,
  },
  half: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexGrow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  buttonWrapper: {
    paddingLeft: 48,
    paddingRight: 48,
  },
  button: {
    backgroundColor: 'purple',
    height: 56, 
  },
  bigText: {
    fontSize: 24,
    textAlign: 'center',
  },
  smallText: {
    fontSize: 18,
    textAlign: 'center',
  }
});


const getAuthorizeUrl = () => {
  const redirectUri = encodeURIComponent(CALLBACK_URL);
  return `${BACKEND_URL}/oauth/authorize?client_id=${OAUTH_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=`
}

class SignInScreen extends React.Component {
  state = {
    url: '',
    textInput: '',
  }
  
  componentDidMount() {
    Linking.getInitialURL().then(url => this.push(url));
    Linking.addEventListener('url', this.handleChange);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleChange);
  }

  handleChange = (e) => {
    this.push(e.url);
  };

  startAuthFlow = () => {
    Linking.openURL(getAuthorizeUrl());
  }

  push = async (url = '') => {
    if (!url) return;

    // useless:
    this.setState({ url: url });

    // First, parse the query string

    const hash = url.split('#')[1];
    if (!hash) return;

    const params = {};
    const regex = /([^&=]+)=([^&]*)/g
    let m;
    while (m = regex.exec(hash)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    if (params.access_token) {
      const {access_token} = params;
      this.setState({accessToken: access_token})
      this.props.onReceiveToken(access_token);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.flexGrow}>
          <Text style={styles.bigText}>Welcome to Bettermask!</Text>
          <View style={{marginBottom: 32}} />
          <Text style={styles.bigText}>Your coins are waiting! Please verify your identity to claim them.</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity onPress={this.startAuthFlow}>
            <View style={{backgroundColor: "#8363d4", paddingTop: 12, paddingBottom: 12}}>
              <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 18}}>
                SIGN IN WITH FACEBOOK
              </Text>
            </View>
          </TouchableOpacity>
          {/* <Button
              title="Sign in with Facebook"
              color="#8363d4"
              onPress={this.startAuthFlow}
              style={styles.button} /> */}
        </View>
        <View style={styles.flexGrow}>
            <Text style={styles.smallText}>
              We respect your privacy. We are only requesting your name, email and profile picture.
            </Text>
          {/* <View style={{padding: 64}}>
          </View> */}
            {/* <Text>URL used to open: {this.state.url}</Text>
            <Text>URL: {callbackUrl}</Text>
            <Text>Acquired access token: {this.props.accessToken}</Text>

            <TextInput 
              style={{width: '100%', height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(v) => this.setState({textInput: v})}
              value={this.state.textInput} />
            <Button
              title="Ok"
              color="purple"
              onPress={() => this.props.onReceiveToken(this.state.textInput)}
              style={styles.button} /> */}
        </View>
      </View>
    )
  }
}

class UiScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <WebView
          source={{uri: `${WEBVIEW_FRONTEND_URL}/auth#access_token=${this.props.accessToken}`}}
          style={styles.webView} />
      </View>
    )
  }
}

export default class App extends React.Component {
  state = {
    accessToken: '',
  };

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.accessToken ?
            <UiScreen accessToken={this.state.accessToken} />
            :
            <SignInScreen accessToken={this.state.accessToken} onReceiveToken={(token) => this.setState({ accessToken: token })} />
        }
      </View>
    );
  }
}
