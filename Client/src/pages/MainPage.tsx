import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function Mainpage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem("token");
    if (token) {
      // 로그인된 상태라면 /clock 페이지로 리다이렉트
      navigate("/clock");
    }
  }, [navigate]);



  return (
    <Container>
      <div>당하그와 함께 하루를 계획하고 회고하는 습관을 길러보세요!</div>
      <img src="sun2.png" alt="sun2" />
      <Introduce>
        <img src="people1.png" alt="person1" />
        <div>✅ 매일 오전 10시까지 하루 일정을 계획해요!</div>
      </Introduce>
      <Introduce>
        <div>🌅 24시간 이내에 회고를 작성하면 stable-diffusion이 나만의 프로필 이미지를 만들어줘요!</div>
        <img src="people2.png" alt="person2" />
      </Introduce>
      <Introduce>
        <img src="people3.png" alt="person3" />
        <div>🐾 코딩미모 사용자와 디스코드로 모각공도 즐겨보세요~!</div>
      </Introduce>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    width: 20%;
  }
  div {
    font-size: 23px;
    text-align: center;
    margin: 30px 20px;
    font-weight: bold;
  }
`;

const Introduce = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  div {
    font-size: 20px;
  }
  img {
    width: 30%;
  }
`;

