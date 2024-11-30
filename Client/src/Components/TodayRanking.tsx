import React from "react";
import styled from "styled-components";

interface Ranking {
  username: string;
  commits: number;
  avatar: string;
}

const todayRankings: Ranking[] = [
  { username: "user1", commits: 16, avatar: "profile1.jpg" },
  { username: "user2", commits: 16, avatar: "profile1.jpg" },
  { username: "user3", commits: 16, avatar: "profile1.jpg" },
  { username: "user4", commits: 16, avatar: "profile1.jpg" },
  { username: "user4", commits: 16, avatar: "profile1.jpg" },
  { username: "user1", commits: 16, avatar: "profile1.jpg" },
  { username: "user2", commits: 16, avatar: "profile1.jpg" },
  { username: "user3", commits: 16, avatar: "profile1.jpg" },
  { username: "user4", commits: 16, avatar: "profile1.jpg" },
  { username: "user4", commits: 16, avatar: "profile1.jpg" },
];

export default function TodayRanking() {
  return (
    <Container>
      {todayRankings.map((user, index) => (
        <RankingItem key={index}>
          <Rank>{index + 1}등</Rank>
          <Avatar src={user.avatar} alt={user.username} />
          <Username>{user.username}</Username>
          <Commits>{user.commits} commits</Commits>
        </RankingItem>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RankingItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
const Rank = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-right: 10px;
`;
const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Username = styled.div`
  flex-grow: 1;
  font-weight: bold;
`;

const Commits = styled.div`
  font-size: 16px;
  font-weight: bold;
`;
