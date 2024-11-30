import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement('#root');  // App의 루트 엘리먼트를 지정합니다.

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://43.200.219.68:8000/api/v1/login", {
        email: email,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const userNickname = response.data.nickname;
      console.log("Login Success:", response);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("nickname", userNickname);

      setNickname(userNickname);
      setModalOpen(true);

    } catch (error) {
      console.error("Login failed:", error);
      // 오류 처리 (예: 알림 표시)
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    navigate("/");  // 모달 닫히면서 홈으로 이동
  };

  // 회원가입 페이지로 이동하는 함수
  const goToRegister = () => {
    navigate("/register"); // 'Register' 페이지로 이동
  };

  return (
    <Container>
      <Content>
        <Logo src="sun2.png" alt="Logo" />
        <Title>로그인하고 당하그와 함께 성장해봐요!</Title>
        <Form onSubmit={handleSubmit}>
          <Label>Email:</Label>
          <Input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <Label>Password:</Label>
          <Input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <SubmitButton type="submit">Login</SubmitButton>
        </Form>
        <RegisterButton onClick={goToRegister}>회원가입</RegisterButton>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Welcome Modal"
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              padding: '20px',
              textAlign: 'center'
            },
          }}
        >
          <h2>{nickname}님 환영합니다!</h2>
          <button onClick={closeModal}>확인</button>
        </Modal>
      </Content>
    </Container>
  );
}

// styled-components를 사용한 스타일링
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: white;
  border-radius: 30px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Logo = styled.img`
  width: 100px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const SubmitButton = styled.button`
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  background-color: #333;
  color: white;
  border: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: #555;
    transform: scale(1.05);
  }
`;

const RegisterButton = styled.button`
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  background-color: #FFD81C;
  color: white;
  border: none;
  transition: all 0.3s ease;
  width: 100%;
  margin-top:10px;

  &:hover {
  
    transform: scale(1.05);
  }
`;
