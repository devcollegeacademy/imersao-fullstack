import Link from 'next/link';
import styled from "styled-components";

export const HeaderStyled = styled.header`
    width: 100%;
    height: 100px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 0 50px;

    background-color: #44677C;
`;

export const SearchForm = styled.form`
    background-color: white;
    border-radius: 10px;
    
    padding: 0 60px;

    position: relative;

    input {
        all: unset;
        width: 400px;
        height: 60px;

        font-family: "Poppins", sans-serif;
        font-weight: 400;
        font-style: normal;   
        font-size: 20px;
    }
        
    .search_icon_point {
        position: absolute;
        left: 20px;
        top: 10px;
        z-index: 1;
    }

    .search_btn {
        all: unset;
        position: absolute;
        right: 30px;
        top: 10px;
        background-color: #5B8AA6;
        border-radius: 10px;
        width: 40px;
        height: 40px;
        text-align: center;
        cursor: pointer;
    }
`;

export const BtnLogin = styled(Link)`

    button {
        all: unset;
        color: #FFFFFF;
        padding: 10px 20px;
        border-radius: 10px;
        background-color: #5B8AA6;
        font-family: "Poppins", sans-serif;
        font-weight: 700;
        font-style: normal;   
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        p:first-child {
            font-size: 30px;
            margin-right: 10px;
            text-decoration: none;
        }
    }
`;

