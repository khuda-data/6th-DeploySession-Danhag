import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("https://43.200.219.68:8000/api/v1/register", {
        email: email,
        password: password,
        nickname: nickname,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // 회원가입 성공 시 모달을 표시
      setIsModalOpen(true);

    } catch (error) {
      console.error("Registration failed:", error);
      // 오류 처리 (예: 알림 표시)
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/"); // 홈으로 리디렉션
  };

  return (
    <Container>
      <Content>
        <Title>회원가입</Title>
        <Form onSubmit={handleSubmit}>
          <Input 
            type="text" 
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            required 
          />
          <Input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            required 
          />
          <Input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required 
          />
          <SubmitButton type="submit">회원가입</SubmitButton>
        </Form>
      </Content>

      {/* 모달 */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>회원가입이 성공하였습니다!</ModalTitle>
            <ModalButton onClick={closeModal}>확인</ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: white;
  border-radius: 30px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 30%;
  height: 50%;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 300px;
`;

const Input = styled.input`
  padding: 15px;
  margin-bottom: 15px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 90%;
`;

const SubmitButton = styled.button`
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  background-color: #333;
  color: white;
  border: none;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background-color: #555;
    transform: scale(1.05);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  margin-bottom: 20px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #555;
  }
`;
