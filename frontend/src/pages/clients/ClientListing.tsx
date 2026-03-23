import React, { Suspense, useEffect, useState, useRef } from "react";
import { toastr } from "@/utils/toastr";
import { Button, Card, Row } from "react-bootstrap";
import { NAVIGATION_PATH } from "@/constants";
import { Client } from "@/types/api/Client";
import DataTable, { DataTableType } from "@/components/DataTable";
import { ActionItemType, CrudActions } from "@/components/CrudActions";
import { Link, useNavigate } from "react-router-dom";
import { mountRoute } from "@/utils/mountRoute";
import Loader from "@/components/Loader";
import { errorHandling } from "@/utils/errorHandling";
import ClientService from "@/services/ClientService";
import { TextFormFieldType } from "@/components/form/TextFormField/TextFormFieldType";
import { ClientFilter } from "@/types/api/filters/ClientFilter";
import { format } from "@/helpers/format";

const ClientListing = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState<Date>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            toastr({ title: "Apenas arquivos .csv são permitidos", icon: "error" });
            return;
        }

        try {
            await ClientService.uploadCsv(file);

            toastr({ title: "Arquivo importado com sucesso", icon: "success" });

        } catch (error: any) {
            errorHandling(error, "Erro ao importar arquivo");
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    useEffect(() => {
        setDate(new Date());
    }, []);

    return <>
        <div className="d-flex justify-content-end align-items-center" style={{ margin: "10px 0", gap: "10px" }}>
            <input
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileUpload}
            />
            <Button variant="primary" style={{ maxWidth: "fit-content" }} onClick={() => fileInputRef.current?.click()}>
                Importar CSV
            </Button>
            <Link to={NAVIGATION_PATH.CLIENTS.CREATE.ABSOLUTE}>
                <Button style={{ maxWidth: "fit-content" }}>Adicionar</Button>
            </Link>
        </div>
        <Card >
            <Card.Title></Card.Title>
            <Card.Header>
                <Card.Title>
                    Clientes
                </Card.Title>
            </Card.Header>
            <Suspense fallback={<><Loader /><br /><br /></>}>
                <DataTable<Client, ClientFilter>
                    thin
                    columns={[

                        { Header: "Nome", accessor: "firstName" },
                        { Header: "Sobrenome", accessor: "lastName" },
                        { Header: "Email", accessor: "email" },
                        { Header: "Telefone", accessor: "phoneNumber", Cell: ({value}: any) => format.toPhone(value) },
                        { Header: "Documento", accessor: "documentNumber", Cell: ({value}: any) => format.toDocument(value) },
                        {
                            Header: "Ações",
                            accessor: "id",
                            Cell: ({ row }: any) => (
                                <CrudActions
                                    cell={row.original}
                                    actions={[
                                        {
                                            type: ActionItemType.EDIT,
                                            handler: async (cell: Client) => {
                                                navigate(mountRoute(NAVIGATION_PATH.CLIENTS.EDIT.ABSOLUTE, { id: cell.id as string }));
                                            }
                                        }
                                    ]}
                                />
                            )
                        }
                    ]}
                    query={async (filters) => {
                        const documentFilter = filters.find(f => f.name === "document")?.value as string;
                        return await ClientService.getAll(documentFilter);
                    }}
                    fetchButton
                    cleanButton
                    filters={[
                        {
                            name: "document",
                            label: "Filtrar por Documento",
                            componentType: TextFormFieldType.INPUT,
                            placeholder: "Digite o CPF ou CNPJ",
                            col: 10,
                        }
                    ]}
                    queryName={["client", "listing", date]}
                />
            </Suspense>
        </Card >
    </>
}

export default ClientListing;