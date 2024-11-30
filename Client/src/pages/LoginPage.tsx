
import React from "react";
import styled from "styled-components";
import Login from "../Components/Login";

export default function LoginPage() {


  return (
    <Container>
      <Login/>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;

`;
