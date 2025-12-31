import React from 'react';
import { Alert, StyleSheet, Pressable } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import NfcProxy from '../components/NfcProxy';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { InboxIcon, CogIcon } from "react-native-heroicons/outline";

export default function MainScreen({ navigation }:any) {

    //Read UID ([60] [AF] [AF]), Open AFC App ([5A 01 00 00]), Read Purse Balance ([6C 03]), Read Validity dates ([BD 00 00 00 00 20 00 00])
    const balanceHexCode:number[][] = [[96],[175],[175],[90,1,0,0],[108,3],[189,0,0,0,0,32,0,0]]
    //After opening AFC App, Record Hex code: ([])
    const recordHexCode:number[][] = [[90,1,0,0],[187,4,0,0,0,1,0,0],[0],[187,4,0,0,0,2,0,0],[0],[187,4,0,0,0,3,0,0],[0],[187,4,0,0,0,4,0,0],[0],[187,4,0,0,0,5,0,0],[0],[187,4,0,0,0,6,0,0],[0],[187,4,0,0,0,7,0,0],[0],[187,4,0,0,0,8,0,0],[0],[187,4,0,0,0,9,0,0],[0],[187,4,0,0,0,10,0,0]]
    
    const [supported, setSupported] = React.useState(Boolean);
    const [enabled, setEnabled] = React.useState(Boolean);

    React.useEffect(() => {
        async function initNfc() {
          try {
            const success = await NfcProxy.init();
            setSupported(success);
            setEnabled(await NfcProxy.isEnabled());
          } catch (ex) {
            console.warn(ex);
            Alert.alert('ERROR', 'fail to init NFC', [{text: 'OK'}]);
          }
        }

        initNfc();
      }, [navigation]);

    async function executeCommands(commands:number[][], screen:string) {

        let result = [];

        try {
            result = await NfcProxy.customTransceiveIsoDep(commands);
        } catch (ex) {
            console.warn('executeCommands w unexpected ex', ex);
        }

        const [success, resps] = result;

        if (success) {
            navigation.navigate(screen, { nfcResp: resps })
        }
        else{
            Alert.alert('NFC reading cancelled', '', [{text: 'OK', onPress: () => 0},]);
        }
    }

    return (
        <>
            <SafeAreaView style={styles.screen}>

                <View style={styles.topbar}>
                    <InboxIcon style={styles.icon} color="grey" size={36}/>
                    <CogIcon style={styles.icon} color="grey" size={36}/>
                </View>

                <View style={styles.container}>

                    <LinearGradient colors={['#884EA0', '#C39BD3', '#8e44ad']} style={styles.gradientCard}>
                        <Text style={{color: "white"}}>ACS Card Sample</Text>
                        <Text style={{color: "white"}}>XXXX-XXXXXXX-XXX</Text>
                    </LinearGradient>

                    <Pressable style={
                        ({pressed}) => [styles.topup_button, {opacity: pressed? 0.5 : 1}]} 
                        onPress={() => navigation.navigate('Topup')
                    }>
                        <Text style={styles.title}>Top Up</Text>
                    </Pressable>

                    <View style={styles.button_container}>
                        <Pressable style={
                            ({pressed}) => [styles.button, {opacity: pressed? 0.5 : 1}]} 
                            onPress={() => navigation.navigate('Main')
                        }>
                            <Text style={styles.title}>Redeem</Text>
                        </Pressable>
                        <Pressable style={
                            ({pressed}) => [styles.button, {opacity: pressed? 0.5 : 1}]} 
                            onPress={() => executeCommands(balanceHexCode, 'Balance')
                        }>
                            <Text style={styles.title}>Check Card Wallet</Text>
                        </Pressable>
                        <Pressable style={
                            ({pressed}) => [styles.button, {opacity: pressed? 0.5 : 1}]} 
                            onPress={() => executeCommands(recordHexCode, 'Record')
                        }>
                            <Text style={styles.title}>Check Payment Records</Text>
                        </Pressable>

                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'space-between'
    },
    topbar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    icon: {
        marginRight: 16,
        marginTop: 32
    },
    container: {
        alignItems: 'center'
    },
    gradientCard: {
        width: '80%',
        aspectRatio: 1.6,
        borderRadius: 16,
        padding: 20,
        margin: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    topup_button: {
        margin: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: "#5DADE2",
        width: 150,
        height: 50
    },
    button: {
        margin: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: "#AAB7B8",
        width: 270,
        height: 36
    },
    button_container: {
        marginVertical: 36
    },
});
