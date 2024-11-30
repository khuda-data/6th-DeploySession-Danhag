import React from "react";
import styled from "styled-components";
import TodayRanking from "../Components/TodayRanking";

export default function RankingPage() {

  return (
    <Container>
      <Header>
        <Title>코딩미모 랭킹</Title>
        
      </Header>
      <Content>
        <TodayRanking />
    
      </Content>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;


const Content = styled.div`
  margin-top: 20px;
`;
