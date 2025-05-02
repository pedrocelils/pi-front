import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, Clock } from "react-native-feather";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";// Importando o LottieView
import { RegisterServices } from "@/services/RegisterServices";

export default function RegisterScreen() {
  const [registrationType, setRegistrationType] = useState<"ENTRADA" | "SAIDA_INTERVALO" | "RETORNO_INTERVALO" | "SAIDA">("ENTRADA");
  const [loading, setLoading] = useState(false); // Estado de carregamento
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

  const handleRegisterPunch = async () => {
    setLoading(true); // Inicia o carregamento

    const payload = {
      registro: registrationType,
      dataRegistro: new Date().toISOString(),
    };

    try {
      await RegisterServices.createRegister(payload);
      Alert.alert("Sucesso", "Registro realizado com sucesso!");
      router.push("/HomeScreen");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao conectar ao servidor");
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/HomeScreen")}>
          <ArrowLeft stroke="#fff" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Ponto</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Registro de Ponto</Text>

          {/* Time Card */}
          <View style={styles.timeCard}>
            <View style={styles.timeHeader}>
              <Clock stroke="#333" width={20} height={20} />
              <Text style={styles.timeHeaderText}>Hora Atual</Text>
            </View>
            <Text style={styles.currentTime}>{new Date().toLocaleTimeString()}</Text>
            <Text style={styles.currentDate}>
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          {/* Registration Type */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de Registro</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={registrationType}
                onValueChange={(itemValue) => setRegistrationType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Entrada" value="ENTRADA" />
                <Picker.Item label="Saída Intervalo" value="SAIDA_INTERVALO" />
                <Picker.Item label="Retorno Intervalo" value="RETORNO_INTERVALO" />
                <Picker.Item label="Saída" value="SAIDA" />
              </Picker>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, loading && { opacity: 0.6 }]} // Ajusta a opacidade quando está carregando
            onPress={handleRegisterPunch}
            disabled={loading} // Desabilita o botão enquanto o registro é enviado
          >
            {loading ? (
              // Exibe o ActivityIndicator enquanto carrega
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Registrar Ponto</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Sistema de Registro de Ponto</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding at bottom for footer
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  timeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeHeaderText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  currentTime: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  currentDate: {
    fontSize: 14,
    color: '#666',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  registerButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    height: 200, // Ajuste o tamanho conforme necessário
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
});
