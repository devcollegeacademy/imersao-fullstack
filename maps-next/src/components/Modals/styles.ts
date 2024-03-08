import styled from "styled-components";

export const ModalCustomerStyled = styled.div`
    width: 100vw;
    height: 100vh;

    background-color: rgba(000, 000, 000, .8);

    position: fixed;
    top: 0;
    left: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .content {  
        background-color: #FFFFFF;
        padding: 20px;

        .content_header {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

        h2 {
            font-family: "Poppins", sans-serif;
            font-weight: 300;
            font-style: normal;   
            font-size: 32px;
        }     

        .content_body {
            width: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .form_group {
                display: flex;
                flex-direction: column;
                margin-bottom: 20px;

                font-family: "Poppins", sans-serif;
                font-weight: 500;
                font-style: normal;   
                font-size: 14px;  
            }

            .form_group input, 
            .form_group select {
                width: 400px;
                height: 40px;
                border-radius: 5px;
                padding-left: 10px;
            }

            .form_group textarea {
                all: unset;
                border: 2px solid black;
                width: 400px;
                height: 70px;
                border-radius: 5px;
            }

            .form_group:nth-child(2) {                
                flex-direction: row;
            }

            .form_group:nth-child(2) label {                
                width: 190px;
            }

            .form_group:nth-child(2) input { 
                width: 190px;
            }

            .form_group:nth-child(2) label:nth-child(2) {
                margin-left: 20px;
            }

            form {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            button {
                all: unset;
                width: 140px;
                height: 45px;
                background-color: #5B8AA6;
                color: #FFFFFF;
                text-align: center;
                border-radius: 10px;
            }
        }   
    }
`;
