import React, { Suspense, useEffect, useState } from "react";
import { Button, Card, Row } from "react-bootstrap";
import { NAVIGATION_PATH } from "@/constants";
import { Client } from "@/types/api/Client";
import DataTable, { DataTableType } from "@/components/DataTable";
import { ActionItemType, CrudActions } from "@/components/CrudActions";
import { Link, useNavigate } from "react-router-dom";
import { mountRoute } from "@/utils/mountRoute";
import Loader from "@/components/Loader";
import ClientService from "@/services/ClientService";
import { TextFormFieldType } from "@/components/form/TextFormField/TextFormFieldType";
import { ClientFilter } from "@/types/api/filters/ClientFilter";

const ClientListing = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState<Date>();

    useEffect(() => {
        setDate(new Date());
    }, []);

    return <>
        <Row style={{ justifyContent: "end", margin: "10px 0" }}>
            <Link to={NAVIGATION_PATH.CLIENTS.CREATE.ABSOLUTE}>
                <Button style={{ maxWidth: "fit-content", float: "right" }}>Adicionar</Button>
            </Link>
        </Row>
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
                        { Header: "Telefone", accessor: "phoneNumber" },
                        { Header: "Documento", accessor: "documentNumber" },
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