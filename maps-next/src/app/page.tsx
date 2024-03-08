'use client'
import Header from "@/components/Header";
import { Container } from "./styles";
import { CustomerProvider } from "@/contexts/CustomerContext";
import { ModalProvider } from "@/contexts/ModalContext";
import Maps from "@/components/Maps";
import Modal from "@/components/Modals";
type Coords = {
  lat: number;
  lng: number;
}

export default function Home() {
  return (
    <Container>
      <CustomerProvider>
        <ModalProvider>
          <Header />
          <Maps />
          <Modal />
        </ModalProvider>
      </CustomerProvider>
    </Container>
  );
}
