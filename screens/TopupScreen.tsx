import React from 'react';
import { Alert, StyleSheet, Pressable } from 'react-native';
import { Text, View, TextInput } from '../components/Themed';
import NfcProxy from '../components/NfcProxy';


export default function TopupScreen({ navigation }:any) {

    const [amount, onChangeNumber] = React.useState<number>(0);

    async function executeCommands(commands:number[][], screen:string) {

        let result = [];

        try {
            result = await NfcProxy.customTransceiveIsoDep(commands);
        } catch (ex) {
            console.warn('executeCommands w unexpected ex', ex);
        }

        const [success, resps] = result;

        if (success) {
            Alert.alert(amount.toString(), '', [{text: 'OK', onPress: () => 0},]);
        }
        else{
            Alert.alert('Transaction failed', '', [{text: 'OK', onPress: () => 0},]);
            //navigation.navigate(screen, { paramKey: resps })
        }
    }

    return (
        <>
            <View style={styles.container}>
                <TextInput style={styles.topup_input} keyboardType='numeric' onChangeText={val => onChangeNumber(parseInt(val))} placeholder="Amount"/>
                <Pressable style={
                    ({pressed}) => [styles.topup_button, {opacity: pressed? 0.5 : 1}]} 
                    onPress={() => executeCommands([], 'Balance')
                }>
                    <Text style={styles.title}>Top Up</Text>
                </Pressable>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 10
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    topup_input: {
        width: '80%',
        height: 50,
        fontSize: 16
    },
    topup_button: {
        margin: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: "#5DADE2",
        width: '80%',
        height: 50
    },
});
