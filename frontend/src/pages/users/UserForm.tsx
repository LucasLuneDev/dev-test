import React, { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Formik } from "formik";
import { useSuspenseQuery } from "@tanstack/react-query";
import { NAVIGATION_PATH } from "@/constants";
import { User } from "@/types/api/User";
import { UserProfile, userProfileOptions } from "@/types/api/enums/UserProfile";
import { TextFormFieldType } from "@/components/form/TextFormField/TextFormFieldType";
import { TextFormField } from "@/components/form/TextFormField/TextFormField";
import Loader from "@/components/Loader";
import { toastr } from "@/utils/toastr";
import { errorHandling } from "@/utils/errorHandling";
import UserService from "@/services/UserService";
import yup from "@/utils/yup";

const INITIAL_VALUES: User = {
    username: "",
    password: "",
    profile: UserProfile.Administrator,
    createdAt: "",
};

const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data } = useSuspenseQuery<User>({
        queryKey: ["user", id],
        meta: {
            fetchFn: async () => {
                if (id) {
                    return await UserService.getById(id);
                }
                return INITIAL_VALUES;
            },
        },
    });

    const schemaValidation = yup.object().shape({
        username: yup.string().required("Nome de usuário é obrigatório"),
        profile: yup.number().required("Perfil é obrigatório"),
        password: id
            ? yup.string().notRequired()
            : yup.string().min(6, "Mínimo de 6 caracteres").required("Senha é obrigatória")
    });

    async function onSubmit(values: User) {
        try {
            if (id) {
                await UserService.update(id, values);
                toastr({ title: "Usuário atualizado com sucesso!", icon: "success" });
            } else {
                await UserService.create(values);
                toastr({ title: "Usuário criado com sucesso!", icon: "success" });
            }
            navigate(NAVIGATION_PATH.USERS.LISTING.ABSOLUTE);
        } catch (error: any) {
            errorHandling(error, "Erro ao salvar usuário");
        }
    }

    const title = id ? "Editar Usuário" : "Novo Usuário";

    return (
        <React.Fragment>
            <Helmet title={title} />
            <Suspense fallback={<><Loader /><br /><br /></>}>
                <Card>
                    <Card.Header>
                        <Card.Title>{title}</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Formik
                            initialValues={data}
                            validationSchema={schemaValidation}
                            onSubmit={onSubmit}
                            enableReinitialize={true}
                        >
                            {({ handleSubmit, handleChange, handleBlur, errors, values, isSubmitting, isValid }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <TextFormField
                                                componentType={TextFormFieldType.INPUT}
                                                name="username"
                                                label="Nome de Usuário"
                                                required
                                                placeholder="Nome"
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                                value={values.username}
                                                formikError={errors.username}
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <TextFormField
                                                componentType={TextFormFieldType.SELECT}
                                                name="profile"
                                                label="Perfil"
                                                required
                                                options={userProfileOptions()}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                                value={values.profile}
                                                formikError={errors.profile as string}
                                            />
                                        </Col>
                                    </Row>

                                    {!id && (
                                        <Row className="mt-3">
                                            <Col md={6}>
                                                <TextFormField
                                                    componentType={TextFormFieldType.INPUT}
                                                    name="password"
                                                    label="Senha"
                                                    password={true}
                                                    required={!id}
                                                    placeholder="Senha (mín. 6 caracteres)"
                                                    handleBlur={handleBlur}
                                                    handleChange={handleChange}
                                                    value={values.password}
                                                    formikError={errors.password}
                                                />
                                            </Col>
                                        </Row>
                                    )}

                                    <br />
                                    <Button type="submit" variant="primary" disabled={!isValid || isSubmitting}>
                                        {isSubmitting ? "Salvando..." : "Salvar"}
                                    </Button>
                                    <Button variant="secondary" style={{ marginLeft: 5 }} onClick={() => navigate(NAVIGATION_PATH.USERS.LISTING.ABSOLUTE)}>
                                        Voltar
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Card.Body>
                </Card>
            </Suspense>
        </React.Fragment>
    );
};
export default UserForm;