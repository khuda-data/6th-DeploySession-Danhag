import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function AfterClock() {
  const navigate = useNavigate();

    return (
      <AfterContainer>
        <p>오늘의 미션이 마감됐어요!</p>
        <button onClick={() => navigate("/wrapup")}>회고 쓰러 가기</button>
      </AfterContainer>
    );
  

}

const AfterContainer = styled.div`
  flex-direction: column;
  gap: 20px;
  img {
    width: 30%;
    max-width: 200px;
  }
  p {
    font-size: 30px;
    font-weight: bold;s
    text-align: center;
  }
  button {
    margin-top: 20px;
  }
`;