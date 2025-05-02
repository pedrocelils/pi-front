import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar } from "react-native"
import { Clock, Eye, User } from "react-native-feather"

export default function HomeScreen() {


    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
      const updateDateTime = () => {
        const now = new Date();
        
        const optionsDate = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
        const formattedDate = now.toLocaleDateString('pt-BR', optionsDate);
        
        const formattedTime = now.toLocaleTimeString('pt-BR', { hour12: false });
  
        setCurrentDate(formattedDate);
        setCurrentTime(formattedTime);
      };
  
      updateDateTime(); // inicializa
      const interval = setInterval(updateDateTime, 1000); // atualiza a cada segundo
  
      return () => clearInterval(interval); // limpa ao desmontar
    }, []);
  
    
    const handleLogin = async () => {;
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/RegisterScreen');
    };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sistema de Ponto</Text>
        <TouchableOpacity style={styles.userIcon}>
          <User stroke="#fff" width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* Greeting and Time */}
      <View style={styles.timeContainer}>
        <Text style={styles.greeting}>Olá, Usuário</Text>
        <Text style={styles.date}>{currentDate}</Text>
        <Text style={styles.time}>{currentTime}</Text>
      </View>

      {/* Action Cards */}
      <View style={styles.cardsContainer}>
        {/* View History Card */}
        <TouchableOpacity onPress={() => router.push('/HistoryScreen')} style={styles.card}>
          <View style={styles.iconContainer}>
          <View style={styles.iconContainer}>
            <Eye stroke="#333" width={24} height={24} />
          </View> 
          </View>
          <Text style={styles.cardTitle}>Visualizar Registros Anteriores</Text>
          <Text style={styles.cardSubtitle}>Consulte seu histórico de pontos registrados</Text>
        </TouchableOpacity>

        {/* Register Punch Card */}
        <TouchableOpacity onPress={handleLogin}  style={styles.card}>
          <View style={styles.iconContainer}>
            <Clock stroke="#333" width={24} height={24} />
          </View>
          <Text style={styles.cardTitle}>Registrar Ponto</Text>
          <Text style={styles.cardSubtitle}>Registre sua entrada ou saída agora</Text>
        </TouchableOpacity>

        {/* Status Card */}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 U-POINT</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  timeContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  time: {
    fontSize: 32,
    fontWeight: "bold",
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
  },
  statusHighlight: {
    fontWeight: "bold",
    color: "#333",
  },
  footer: {
    marginTop: "auto",
    padding: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
  },
})
