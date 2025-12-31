import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '../components/Themed';
import { useRoute } from '@react-navigation/native';


export default function RecordScreen() {

    const params:any = useRoute().params;
    const paymentTypes:{[key: number]: string} = {53: "Fare Payment User Debit", 177: "Debit Transaction", 184: "Record Debit Transaction", 200 : "Debit Card Interrupt", 208: "Period Pass Validation", 212: "Debit User Card", 219: "Period Pass Sales" }
    const topupTypes:{[key: number]: string} = {50: "SAM Wallet Topup", 183: "Recover Rebate Transaction", 198: "Card Sale", 209: "Topup Cashier Card", 210: "Topup User Card", 211: "Debit Cashier Card", 216: "Topup Interrupt", }

    var codes:Array<any> = (params.nfcResp.slice(1))
    const recordsList:Array<{ [key: string]: string }> = []

    for (var code of codes){
        if (code.length > 3){

            var record:{[key: string]: string} = {date: "", amount: "", type: "", balance: ""}

            let date = code.slice(24, 31)

            for (var j in date){
                date[j] = (Math.floor(date[j] / 16) * 10) + date[j] % 16
                if (date[j]< 10){
                    date[j] = "0" + date[j]
                }
            }

            record.date = date[0] + "" + date[1] + "-" + date[2] + "-" + date[3] + " " + date[4] + ":" + date[5] + ":" + date[6]

            let _amount = code.slice(35, 39)
            var amount = 0

            for (var j in _amount) {
                amount = amount * 256
                amount += parseInt(_amount[j])
            }

            amount = -amount
            record.amount = (amount / 100).toFixed(2)

            let type = code[1]

            if (type in paymentTypes) {
                record.type = paymentTypes[type]
            }
            else if (type in topupTypes) {
                record.type = topupTypes[type]
                amount = -amount
                record.amount= (-record.amount).toFixed(2)
            }
            
            let balance_ = code.slice(31, 35)
            var balance = 0

            for (var j in balance_) {
                balance = balance * 256
                balance += parseInt(balance_[j])
            }

            record.balance = ((balance + amount) / 100).toFixed(2)

            if (type == 208) {
                record.balance = ""
            }

            recordsList.push(record)
        }
    }

    return (
        <>
            {recordsList.length == 0? <Text style={styles.text}>No past records found.</Text> :
                <View style={styles.container}>
                    <ScrollView style={{width: "100%"}} showsVerticalScrollIndicator={true}>
                        {recordsList.map((item, key) => (
                            <View style={styles.history_container} key={key}>
                                <View>
                                    <Text style={[styles.text,{textAlign: "left"}]}>{item.date}{"\n"}{item.type}</Text>
                                </View>
                                <View>
                                    {item.amount[0] == "-" ? 
                                    <Text style={[styles.text,{textAlign: "right", color: 'red'}]}>{item.amount} HKD</Text>
                                    :<Text style={[styles.text,{textAlign: "right", color: 'green'}]}>+{item.amount} HKD</Text>}
                                    <Text style={[styles.text,{textAlign: "right"}]}>{item.balance}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            }
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
    scroll_container: {
        textAlign: 'left',
        flex: 1,
        flexDirection: "column",
        justifyContent: 'space-around',
        marginVertical: 20,
        width: "100%"
    },
    history_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginVertical: 10,
        borderColor: 'gray',
        borderBottomWidth: 1,
    },
});
