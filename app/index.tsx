import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function HomePage () {

    return(
        <View>
            <Text>Teste</Text>
            <Link href="/LoginScreen">Clique aqui para ir para o login</Link>
        </View>
    )
   
}