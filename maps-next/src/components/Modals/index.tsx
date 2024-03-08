import { useEffect, useContext, FormEvent, ChangeEvent } from "react";
import { ModalCustomerStyled } from "./styles";
import { CustomerContext } from "@/contexts/CustomerContext";
import { ModalContext } from "@/contexts/ModalContext";
import instance from "@/services/axios";

export default function Modal() {

    const { showModal, setShowModal, modalAction, setModalAction } = useContext(ModalContext);
    const { customer, setCustomer, setCustomers } = useContext(CustomerContext);
   

    const getAddress = async (zipCode: string) => {
        try {
            const response = await instance.get(`/customer/address/${zipCode}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setCustomer({
                ...customer,
                zipCode,
                address: response.data
            });
        } catch (error: any) {
            alert("Erro ao buscar endereço " + error.message);
            console.error("Erro ao buscar endereço:", error);
        }
    };

    const logout = async () => {
        try {
            const response = await instance.get(`/customer/filter/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCustomers(response.data);
            localStorage.removeItem('token');
            setCustomer({ ...customer, email: '' });
            setShowModal(false);
        } catch (error: any) {
            alert("Erro ao fazer logout " + error.message);
            console.error("Erro ao fazer logout:", error);
        }
    };

    const onChange = (event: ChangeEvent) => {
        let { name, value }: any = event.target;

        if (name === 'active') {
            value = value === 'true' ? true : false;
        }

        setCustomer({
            ...customer,
            [name]: value
        })

        if (name === 'zipCode' && value.length === 8) {
            getAddress(value);
        }
    }

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            if (modalAction === 'create') {
                await instance.post('/customer', customer, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setModalAction('update');
            } else {
                await instance.put('/customer', customer, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
        } catch (error: any) {
            alert("Erro ao enviar formulário " + error.message)
            console.error("Erro ao enviar formulário:", error);
        }
    };

    return (
        <>
            {
                showModal && (
                    <ModalCustomerStyled>
                        <div role="content" className="content">
                            <div className="content_header">
                                <h2>Perfil</h2>
                                <img onClick={logout} width={25} height={25} src="./images/icons/icon_close.png" alt="" />
                            </div>

                            <div className="content_body">
                                <form onSubmit={onSubmit}>
                                    <div className="form_group">
                                        <label htmlFor="">
                                            Nome:<br />
                                            <input role="title" type="text" onChange={onChange} name="title" value={customer.title} required />
                                        </label>
                                    </div>
                                    <div className="form_group">
                                        <label htmlFor="">
                                            Cep:<br />
                                            <input role="zipCode" type="text" onChange={onChange} name="zipCode" value={customer.zipCode} required />
                                        </label>
                                        <label htmlFor="">
                                            Número:<br />
                                            <input role="number" type="text" onChange={onChange} name="number" value={customer.number} required />
                                        </label>
                                    </div>
                                    <div className="form_group">
                                        Endereço completo: <br />
                                        <textarea role="address" readOnly value={customer.address}></textarea>
                                    </div>
                                    <div className="form_group">
                                        Visivel: <br />
                                        <select role="active" name="active" id="" value={customer.active} onChange={onChange} required>
                                            <option value="">Escolha uma opção</option>
                                            <option value="true">Sim</option>
                                            <option value="false">Não</option>

                                        </select>
                                    </div>
                                    <button role="save" type="submit">Salvar</button>
                                </form>
                            </div>

                        </div>
                    </ModalCustomerStyled>
                )
            }

        </>
    )
}