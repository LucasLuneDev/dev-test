import axios from "axios";

class ViaCepService {
    async getAddressByCep(cep: string) {
        const cleanCep = cep.replace(/\D/g, '');

        if (cleanCep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
                return response.data;
            } catch (error) {
                console.error("Erro ao consultar ViaCEP", error);
                return null;
            }
        }
        return null;
    }
}

export default new ViaCepService();
