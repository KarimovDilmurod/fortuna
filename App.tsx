import React, {useEffect, useState, useRef} from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  View,
  StyleSheet,
  Modal,
} from 'react-native';
import WebView from 'react-native-webview';
import messaging from '@react-native-firebase/messaging';
import {getUniqueId} from 'react-native-device-info';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';

const App: React.FC = () => {
  const [url, setUrl] = useState<string | null>(null);
  const ref = useRef<WebView>(null);
  const [showWebView, setShowWebView] = useState(false);
  const name = 'KarimovDilmurod';

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
      }
    };
    requestPermissions();

    const getTokenAndGaid = async () => {
      try {
        const token = await messaging().getToken();
        const gaid = await getUniqueId();
        const constructedUrl = `https://kohvima.online/QN9Kbb?gaid=${gaid}&token=${token}&name=${name}`;
        setUrl(constructedUrl);
      } catch (error) {
        console.error(error);
      }
    };

    getTokenAndGaid();
  }, []);

  const Pick = async () => {
    try {
      const results: DocumentPickerResponse[] = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      results.forEach(res => {
        console.log(res.uri, res.type, res.name, res.size);
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        //
      } else {
        throw err;
      }
    }
  };

  console.log(url);

  return (
    <View style={styles.container}>
      {showWebView && url ? (
        <Modal
          transparent={true}
          visible={showWebView}
          onRequestClose={() => setShowWebView(false)}
          animationType="slide">
          <View style={styles.web}>
            <View style={styles.modal} />
            <WebView
              ref={ref}
              source={{uri: url}}
              startInLoadingState={true}
              style={[styles.webview]}
              setSupportMultipleWindows={true}
              allowFileAccess={true}
              domStorageEnabled={true}
              javaScriptEnabled={true}
              geolocationEnabled={true}
              bounces={false}
              saveFormDataDisabled={true}
              allowFileAccessFromFileURLs={true}
              allowUniversalAccessFromFileURLs={true}
              originWhitelist={['*']}
            />
            <View style={styles.btn}>
              <Button title="Загрузить документ" onPress={Pick} />
            </View>
          </View>
        </Modal>
      ) : (
        <Button title="Open" onPress={() => setShowWebView(true)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
    backgroundColor: '#f1f2f2',
  },
  web: {
    flex: 1,
  },
  modal: {
    position: 'absolute',
    top: 50,
    zIndex: 1,
    left: 20,
    backgroundColor: 'transparent',
  },
  btn: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
});

export default App;
