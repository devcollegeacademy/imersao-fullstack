import styled from "styled-components";

export const ContentMap = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;

    .map {
        width: 100%;        
        height: calc(100%-100%);
    }

    .routes {
        width: 100;
        overflow-y: auto;
    } 
`;

