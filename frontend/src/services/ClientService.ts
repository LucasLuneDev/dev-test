import { BaseService } from "./BaseService";
import { Client } from "@/types/api/Client";

class ClientService extends BaseService {
  constructor() {
    super("client");
  }

  async getAll(document?: string): Promise<any> {
    const query = document ? `?document=${document}` : "";
    return await this.get(query);
  }

  async uploadCsv(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    return await this._axios.post(`/${this._controller}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async create(client: Client): Promise<string> {
    return await this.post<Client, string>("", client);
  }

  async getById(id: string): Promise<Client> {
    return await this.get<Client>(id);
  }

  async update(id: string, client: Client): Promise<void> {
    return await this.put<Client, void>(id, client);
  }
}

export default new ClientService();