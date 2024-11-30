import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface SidebarProps {
  isSidebarOpen: boolean;
}

export default function Header() {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    // 로그인 상태와 닉네임을 로컬 스토리지나 API로부터 가져옴
    const token = localStorage.getItem("token");
    const storedNickname = localStorage.getItem("nickname");

    if (token) {
      setIsLoggedIn(true);
      if (storedNickname) {
        setNickname(storedNickname);
      }
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // 로그아웃 시 토큰과 닉네임을 삭제하고 로그인 페이지로 리다이렉트
    localStorage.removeItem("token");
    localStorage.removeItem("nickname");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <HeaderContainer>
      <LogoContainer onClick={() => navigate("/")}>
        <LogoImage src="sun1.png" alt="logo" />
        <div>
          <Title>당하그</Title>
          <SubTitle>
            <BlackText>당</BlackText>신의 <BlackText>하</BlackText>루를 <BlackText>그</BlackText>려드립니다.
          </SubTitle>
        </div>
      </LogoContainer>

      <HamburgerMenu isSidebarOpen={isSidebarOpen} onClick={toggleSidebar}>
        <span />
        <span />
        <span />
      </HamburgerMenu>

      <Nav isSidebarOpen={isSidebarOpen}>
       
        <NavItem onClick={() => navigate("/todo")}>하루다짐</NavItem>
        <NavItem onClick={() => navigate("/wrapup")}>회고</NavItem>
        {isLoggedIn ? (
          <>
            <NavItem>{nickname}님</NavItem>
            <NavItem onClick={handleLogout}>로그아웃</NavItem>
          </>
        ) : (
          <NavItem onClick={() => navigate("/login")}>로그인</NavItem>
        )}
      </Nav>
    </HeaderContainer>
  );
}
interface HamburgerMenuProps {
  isSidebarOpen: boolean;
}

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: row;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const LogoImage = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 20px;
`;

const HamburgerMenu = styled.div<HamburgerMenuProps>`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 25px;
  height: 20px;
  cursor: pointer;
  z-index: 11;

  span {
    width: 100%;
    height: 3px;
    background-color: black;
    border-radius: 2px;
    transition: transform 0.3s ease, opacity 0.3s ease;

    &:nth-child(1) {
      transform: ${(props) => (props.isSidebarOpen ? "rotate(45deg) translate(5px, 5px)" : "none")};
    }

    &:nth-child(2) {
      opacity: ${(props) => (props.isSidebarOpen ? "0" : "1")};
    }

    &:nth-child(3) {
      transform: ${(props) => (props.isSidebarOpen ? "rotate(-45deg) translate(5px, -5px)" : "none")};
    }
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Nav = styled.nav<SidebarProps>`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    position: fixed;
    top: 0;
    right: ${(props) => (props.isSidebarOpen ? "0" : "-250px")};
    width: 250px;
    height: 100%;
    background-color: #e4e4e4;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease-in-out;
    z-index: 10;
    padding-top: 30px;
  }
`;

const NavItem = styled.div`
  cursor: pointer;

  &:hover {
    color: #eaaa30;
  }
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const SubTitle = styled.div`
  font-size: 16px;
  color: gray;
`;

const BlackText = styled.span`
  color: #ffe14f;
`;
