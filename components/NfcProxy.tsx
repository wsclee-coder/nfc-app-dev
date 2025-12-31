import {Platform } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import {getOutlet } from 'reconnect.js';


const withAndroidPrompt = (fn: any) => {
  async function wrapper() {
    try {

      if (Platform.OS === 'android') {
        getOutlet('androidPrompt').update({
          visible: true,
          message: 'Ready to scan NFC',
        });
      }

      const resp = await fn.apply(null, arguments);

      if (Platform.OS === 'android') {
        getOutlet('androidPrompt').update({
          visible: true,
          message: 'Completed',
        });
      }

      return resp;
    } catch (ex) {
      throw ex;
    } finally {
      if (Platform.OS === 'android') {
        setTimeout(() => {
          getOutlet('androidPrompt').update({
            visible: false,
          });
        }, 800);
      }
    }
  }
  return wrapper;
}

class NfcProxy {
    async init() {
        const supported = await NfcManager.isSupported();
        if (supported) {
            await NfcManager.start();
        }
        return supported;
    }
  
    async isEnabled() {
      return NfcManager.isEnabled();
    }
  
    async goToNfcSetting() {
      return NfcManager.goToNfcSetting();
    }
  
    customTransceiveIsoDep:(hexcodes: number[][]) => Promise<any> = withAndroidPrompt(
      async (hexcodes: number[][]) => {

        let result = false;
        const responses = [];
  
        try {

            await NfcManager.requestTechnology([NfcTech.IsoDep]);
  
            for (const hex of hexcodes) {
                let resp = null;
                console.log(
                    '>>> ' +
                    hex.map((b: number) => ('00' + b.toString(16)).slice(-2)).join(' '),
                );
                resp = await NfcManager.isoDepHandler.transceive(hex);
                console.log(
                    '<<< ' +
                    resp.map((b) => ('00' + b.toString(16)).slice(-2)).join(' '),
                );

                responses.push(resp);
            }
    
            if (Platform.OS === 'ios') {
                await NfcManager.setAlertMessageIOS('Success');
            }
  
          result = true;
  
        } catch (ex) {
          console.warn(ex);
        } finally {
          NfcManager.cancelTechnologyRequest();
        }
  
        return [result, responses];
      },
    );
  }
  
  export default new NfcProxy();