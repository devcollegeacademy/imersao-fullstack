import { createContext, useState, ReactNode } from "react";

export const CustomerContext = createContext<any>({});

export interface Customer {
    id: number;
    title: string;
    zipCode: string;
    number: string;
    address: string;
    email: string;
    active: boolean;
}

type Props = {
    children: ReactNode;
};

export const CustomerProvider = ({ children }: Props) => {
    const [customerSelected, setCustomerSelected] = useState<Customer | undefined>(undefined);
    const [customers, setCustomers] = useState<Customer[] | undefined>([]);
    const [customer, setCustomer] = useState<Customer>({ id: 0, title: '', zipCode: '', number: '', address: '', email: '', active: true});
    const [customersFilter, setCustomersFilter] = useState<Customer[] | undefined>([]);
    const [inputSearch, setInputSearch] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
    const [customerOption, setCustomerOption] = useState<string>('')


    return (
        <CustomerContext.Provider value={{
            customerSelected, setCustomerSelected,
            customers, setCustomers,
            customer, setCustomer,
            customersFilter, setCustomersFilter,
            inputSearch, setInputSearch,
            selectedCategoryId, setSelectedCategoryId,
            customerOption, setCustomerOption
        }}>
            {children}
        </CustomerContext.Provider>
    );
}