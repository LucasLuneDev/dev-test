import { useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { toastr } from "@/utils/toastr";
import useAppSelector from "@/hooks/useAppSelector";

export function useImportSignalR() {
    const { access_token } = useAppSelector(state => state.auth);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_API_URL}/hubs/import`, {
                accessTokenFactory: () => access_token ?? ""
            })
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => console.log("SignalR Conectado!"))
            .catch((err: any) => console.error("Erro no SignalR: ", err));

        connection.on("ReceiveImportUpdate", (data: { status: "success" | "warning" | "error", message: string }) => {
            let toastTitle = "Importação Concluída";
            if (data.status === "error") toastTitle = "Falha na Importação";
            if (data.status === "warning") toastTitle = "Importação com Alertas";

            toastr({
                title: toastTitle,
                text: data.message,
                icon: data.status,
                timer: 5000
            });
        });

        return () => {
            connection.stop();
        };
    }, [access_token]);
}