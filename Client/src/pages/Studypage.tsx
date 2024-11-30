import React, { useState } from "react";
import styled from "styled-components";

// Participant 타입 정의
interface Participant {
  name: string;
  profileImage: string;
  isCameraOn: boolean;
}

export default function StudyPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const handleJoin = () => {
    // 예시로 임시 참여자를 추가하는 로직
    setParticipants([
      ...participants,
      {
        name: "홍길동",
        profileImage: "https://via.placeholder.com/150",
        isCameraOn: isCameraOn,
      },
    ]);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  return (
    <Container>
      <Header>
        <Title>모각공</Title>
        <ButtonContainer>
          <JoinButton onClick={handleJoin}>모각공하기</JoinButton>
          <ToggleButton onClick={toggleCamera}>
            {isCameraOn ? "캠 끄기" : "캠 켜기"}
          </ToggleButton>
        </ButtonContainer>
      </Header>
      <Content>
        {participants.map((participant, index) => (
          <Participant key={index}>
            <ProfileImage src={participant.profileImage} alt={participant.name} />
            <ParticipantName>{participant.name}</ParticipantName>
            {participant.isCameraOn && (
              <CameraFeed>
                <p>Camera feed...</p>
              </CameraFeed>
            )}
          </Participant>
        ))}
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

const ButtonContainer = styled.div`
  margin-top: 20px;
`;

const JoinButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  margin-right: 10px;
  cursor: pointer;
`;

const ToggleButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const Content = styled.div`
  margin-top: 20px;
`;

const Participant = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const ParticipantName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const CameraFeed = styled.div`
  margin-left: 20px;
  padding: 10px;
  background-color: #e0e0e0;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
`;
