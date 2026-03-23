import React, { Suspense, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { NAVIGATION_PATH } from "@/constants";
import { User } from "@/types/api/User";
import DataTable from "@/components/DataTable";
import { ActionItemType, CrudActions } from "@/components/CrudActions";
import { Link, useNavigate } from "react-router-dom";
import { mountRoute } from "@/utils/mountRoute";
import Loader from "@/components/Loader";
import UserService from "@/services/UserService";
import { UserFilter } from "@/types/api/filters/UserFilter";

const UserListing = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState<Date>();

    useEffect(() => {
        setDate(new Date());
    }, []);

    return (
        <React.Fragment>
            <div className="d-flex justify-content-end align-items-center" style={{ margin: "10px 0", gap: "10px" }}>
                <Link to={NAVIGATION_PATH.USERS.CREATE.ABSOLUTE}>
                    <Button style={{ maxWidth: "fit-content" }}>Adicionar</Button>
                </Link>
            </div>

            <Card>
                <Card.Header>
                    <Card.Title>Usuários</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Suspense fallback={<><Loader /><br /><br /></>}>
                        <DataTable<User, UserFilter>
                            thin
                            columns={[
                                { Header: "Nome de Usuário", accessor: "username" },
                                { Header: "Perfil", accessor: "profile" },
                                {
                                    Header: "Ações",
                                    accessor: "id",
                                    Cell: ({ row }: any) => (
                                        <CrudActions
                                            cell={row.original}
                                            actions={[
                                                {
                                                    type: ActionItemType.EDIT,
                                                    handler: async (cell: User) => {
                                                        navigate(mountRoute(NAVIGATION_PATH.USERS.EDIT.ABSOLUTE, { id: cell.id as string }));
                                                    }
                                                }
                                            ]}
                                        />
                                    )
                                }
                            ]}
                            query={async () => {
                                return await UserService.getAll();
                            }}
                            fetchButton
                            cleanButton
                            queryName={["user", "listing", date]}
                        />
                    </Suspense>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
};

export default UserListing;