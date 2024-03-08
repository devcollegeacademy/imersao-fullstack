import { createContext, useState, ReactNode } from "react";

export const ModalContext = createContext<any>({});

interface Props {
    children: ReactNode;
};

export const ModalProvider = ({ children }: Props) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalAction, setModalAction] = useState<'create' | 'update'>('create');

    return (
        <ModalContext.Provider value={{ 
            showModal, setShowModal,
            modalAction, setModalAction
         }}>
            {children}
        </ModalContext.Provider>
    );
}
