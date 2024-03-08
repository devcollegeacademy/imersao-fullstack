import React, { useContext, useState, FormEvent, ChangeEvent, useEffect } from "react";
import { HeaderStyled, SearchForm, BtnLogin } from "./styles";
import { ModalContext } from "@/contexts/ModalContext";
import { CustomerContext } from "@/contexts/CustomerContext";
import instance from "@/services/axios";
import { useRouter } from "next/navigation";

export default function Header() {
    const { setShowModal, setModalAction } = useContext(ModalContext);
    const { customers, customer, setCustomer, setCustomers } = useContext(CustomerContext);
    const [input, setInput] = useState<string>('');

    const router = useRouter();

    const onSubmit = async(e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await instance.get(`/customer/filter/${input}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCustomers(response.data);
        } catch (error: any) {
            alert("Erro ao filtrar clientes: " + error.message);
            console.error("Erro ao filtrar clientes:", error);
        }
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    useEffect(() => {
        (async () => {
            const hashString = window.location.hash
            const accessTokenRegex = /access_token=([^&]*)/;
            const match = hashString.match(accessTokenRegex);

            if (match) {
                const accessToken = match[1];
                if (accessToken !== '') {
                    console.log(accessToken);
                    try {
                        const response = await instance.get('/customer', {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        });
    
                        setCustomer(response.data);
    
                        localStorage.setItem('token', accessToken);
                        router.push('/');
                        setModalAction(response.data?.title ? 'update' : 'create');
                        setShowModal(true);
                    } catch (error: any) {
                        alert("Erro ao obter dados do usuário: " + error.message);
                        console.error("Erro ao obter dados do usuário:", error);
                    }
                } else {
                    alert('Falha ao tentar entrar com sua conta da Google!');
                }
            }
        })();
    }, []);

    return (
        <HeaderStyled>
            <SearchForm onSubmit={onSubmit}>
                <img className="search_icon_point" src="/images/icons/icon_point.png" alt="" />
                <input type="text" value={input} onChange={onChange} placeholder="O que deseja procurar?" />
                <button type="submit" className="search_btn">
                    <img className="search_icon_find" src="./images/icons/icon_find.png" alt="" />
                </button>
            </SearchForm>

            <BtnLogin href='http://localhost:3000/customer/auth'>
                <button className="login_with_google">
                    {customer.email === ''
                        ? (
                            <>
                                <p>G</p>
                                <p>Entrar com o Google</p>
                            </>
                        )
                        : customer.email
                    }
                </button>
            </BtnLogin>
        </HeaderStyled>
    );
}
