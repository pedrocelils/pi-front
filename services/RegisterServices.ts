import AsyncStorage from "@react-native-async-storage/async-storage"; // Não esquece de importar

export interface RegisterPayload {
  registro: "ENTRADA" | "SAIDA_INTERVALO" | "RETORNO_INTERVALO" | "SAIDA"; // LocalDateTime format (ISO 8601 string)
}

export class RegisterServices {
  private static readonly BASE_URL = "http://192.168.0.107:8070/registros"; // URL corrigida

  /**
   * Envia um novo registro de ponto para o back-end.
   * @param payload - Dados do registro de ponto
   * @returns Resposta do servidor
   */
  static async createRegister(payload: RegisterPayload): Promise<any> {
    try {
      const token = await AsyncStorage.getItem("userToken"); // pegar o token salvo
      console.log("TOKEN RECUPERADO:", token); // <<<<<< VERIFICAR
  
      console.log("Payload:", payload);
      const response = await fetch(this.BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  

      if (!response.ok) {
        const errorData = await response.json(); // pega o erro do backend
        throw new Error(errorData.message || `Erro ao registrar ponto: ${response.statusText}`);
      }

      const data = await response.json(); // converte resposta para JSON
      return data;
    } catch (error) {
      console.error("Erro no serviço de registro:", error);
      throw error; // Propaga o erro para o front-end tratar
    }
  }
}
