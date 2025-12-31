import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { Route, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';


export default function CardWalletScreen() {

    const params:{ [key: string]: any} | undefined = useRoute().params;
    const statusList:Array<string>= ["Manufacturer", "Stock before initialization", "Initialized", "Stock after initialized", "Under personalization", "Personalized", " Delivered to Sales Outlet", "Operational", "Returned to Sales Outlet", "Retired Functional", "Non-functional", "Gray Listed", "Blacklisted", "Expired"]

    var idCode = (params!.nfcResp[2].slice(2,8)).reverse()
    var balanceCode:Array<number> = (params!.nfcResp[4].slice(1)).reverse()
    var validityCode:Array<number> = params!.nfcResp[5].slice(2,9)
    
    //Convert UID into Card id: hex to decimal + luhn code
    var id:number = 0
    for (let i of idCode) {
        id = id * 256
        id += i
    }

    var luhn:number = 0
    var myArr = String(id).split("").map((num)=>{return Number(num)})

    for (let i in myArr) {
        let num:number = myArr[i]
        if (Number(i)%2 == 0) {
            num = 2 * num
            if (num > 9) { num -= 9 }
        }
        luhn += num
    }
    
    luhn = 10 - (luhn%10)
    id = (10*id) + luhn

    //Balance: hex to deci, read from the back
    var _balance:number = 0
    for (let i of balanceCode) {
        _balance = _balance * 256
        _balance += i
    }

    var balance:string = (_balance/100).toFixed(2)

    //valid since, valid until
    var status:string = statusList[validityCode[0] - 1]
    var _validityCode:Array<string> = []

    for (var j in validityCode){
        _validityCode[j] = ((Math.floor(validityCode[j] / 16) * 10) + validityCode[j] % 16).toString()
        
        if (validityCode[j]< 10){
            _validityCode[j] = "0" + (validityCode[j]).toString
        }
    }

    var issuedDate:string = "20" + validityCode[1] + "/" + validityCode[2] + "/" + validityCode[3]
    var validUntil:string = "20" + validityCode[4] + "/" + validityCode[5] + "/" + validityCode[6]

    return (
        <>
            <View style={styles.container}>
                <LinearGradient colors={['#884EA0', '#C39BD3', '#8e44ad']} style={styles.gradientCard}>
                    <Text style={{color: "white"}}>ACS Card Sample</Text>
                    <Text style={{color: "white"}}>ID: {id}</Text>
                </LinearGradient>
                <View style={styles.info_container}>
                    <View>
                        <Text style={styles.leftcol}>Status:{"\n"}Balance:{"\n"}Issued date:{"\n"}Valid until:</Text>
                    </View>
                    <View>
                        <Text style={styles.rightcol}>{status}{"\n"}{balance} HKD{"\n"}{issuedDate}{"\n"}{validUntil}</Text>
                    </View>
                </View>
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
    info_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '70%',
    },
    leftcol: {
        fontSize: 16,
        lineHeight: 40
    },
    rightcol: {
        fontSize: 16,
        lineHeight: 40,
        textAlign: 'right'
    },
    gradientCard: {
        width: '80%',
        aspectRatio: 1.6,
        borderRadius: 16,
        padding: 20,
        margin: 16,
    }
});
