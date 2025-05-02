import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { ArrowLeft, Calendar } from "react-native-feather";
import AsyncStorage from "@react-native-async-storage/async-storage"; // <- Importante!
import { router } from "expo-router";

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  type Registro = {
    data_registro: string;
    registro: string;
  };
  
  const [history, setHistory] = useState<Registro[]>([]);
  

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // <- Buscar o token salvo
        if (!token) {
          throw new Error("Usuário não autenticado.");
        }

        const response = await fetch("http://192.168.0.111:8070/registros/historico", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setHistory(data);
      } catch (err) {
        console.log("DEU RUIM")
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1a1a1a" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar registros: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/HomeScreen")}>
          <ArrowLeft stroke="#fff" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de Registros</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Registros dos últimos dias</Text>

        {history.length === 0 ? (
          <Text style={styles.noDataText}>Nenhum registro encontrado.</Text>
        ) : (
          history.map((day, index) => (
            <View style={styles.dayCard} key={index}>
              <View style={styles.dayHeader}>
                <Calendar stroke="#333" width={20} height={20} />
                <Text style={styles.dayDate}>
                  {new Date(day.data_registro).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(day.data_registro).toLocaleDateString("pt-BR", {
                    weekday: "long",
                  })}
                </Text>
              </View>

              <View style={styles.recordsList}>
                <View style={styles.recordItem}>
                  <View
                    style={[
                      styles.recordBadge,
                      day.registro === "ENTRADA"
                        ? styles.entryBadge
                        : day.registro === "SAIDA_INTERVALO"
                        ? styles.breakOutBadge
                        : day.registro === "RETORNO_INTERVALO"
                        ? styles.breakInBadge
                        : styles.exitBadge,
                    ]}
                  >
                    <Text style={styles.recordBadgeText}>
                      {day.registro === "ENTRADA"
                        ? "Entrada"
                        : day.registro === "SAIDA_INTERVALO"
                        ? "Saída Intervalo"
                        : day.registro === "RETORNO_INTERVALO"
                        ? "Retorno Intervalo"
                        : "Saída"}
                    </Text>
                  </View>
                  <Text style={styles.recordTime}>
                    {new Date(day.data_registro).toLocaleTimeString("pt-BR")}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Sistema de Registro de Ponto</Text>
      </View>
    </SafeAreaView>
  );
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
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  dayCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dayDate: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  recordsList: {
    gap: 10,
  },
  recordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  recordBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  entryBadge: {
    backgroundColor: "#e6f7ff",
  },
  breakOutBadge: {
    backgroundColor: "#fff0f5",
  },
  breakInBadge: {
    backgroundColor: "#f0f7ff",
  },
  exitBadge: {
    backgroundColor: "#f5f5ff",
  },
  recordBadgeText: {
    fontWeight: "500",
  },
  recordTime: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});
