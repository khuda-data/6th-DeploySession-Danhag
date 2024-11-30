import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

interface Props {
  onNext: () => void;
  onImageCreated: (imageUrl: string | null) => void; // 이미지 생성 결과를 전달하는 콜백
}

const Reflexion: React.FC<Props> = ({ onNext, onImageCreated }) => {
  const [reflection, setReflection] = useState("");
  const [todos, setTodos] = useState<string[]>([]);
  const [isTodoAvailable, setIsTodoAvailable] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      const userId = localStorage.getItem("user_id");
      try {
        const response = await axios.get(`https://43.200.219.68:8000/api/v1/todo/${userId}`);
        if (response.data && Array.isArray(response.data.todos) && response.data.todos.length > 0) {
          const splitTodos = response.data.todos[0].split('\n');
          setTodos(splitTodos);
          setIsTodoAvailable(true);
        } else {
          setIsTodoAvailable(false);
        }
      } catch (error) {
        console.error("Todo 가져오기 실패", error);
        setIsTodoAvailable(false);
      }
    };

    fetchTodos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("user_id");

    onNext(); // 바로 CreatingProfileImage로 넘어가기

    try {
      const response = await axios.patch(`https://43.200.219.68:8000/api/v1/reflections`, {
        user_id: userId,
        content: reflection,
      });

      if (response.status === 200 && response.data && response.data.image) {
        onImageCreated(response.data.image.image_url); // 이미지 URL 전달
      } else {
        onImageCreated(null); // 실패 시 null 전달
      }
    } catch (error) {
      console.error("회고 작성 실패", error);
      onImageCreated(null); // 실패 시 null 전달
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <TodoSection>
          <Card>
            <TodoTitle>오늘의 하루다짐</TodoTitle>
            <TodoList>
              {todos.map((todo, index) => (
                <TodoItem key={index}>{index + 1}. {todo}</TodoItem>
              ))}
            </TodoList>
          </Card>
        </TodoSection>
        <ReflectionSection>
          {isTodoAvailable ? (
            <>
              <Title>오늘도 수고 많았어요! 🐾</Title>
              <Subtitle>회고를 작성하고 나만의 프로필 이미지를 만들어보세요.</Subtitle>
              <Form onSubmit={handleSubmit}>
                <Label>오늘의 회고 작성</Label>
                <TextArea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="오늘은 코딩미모 초기세팅을 했다. 너무 좋다"
                />
                <SubmitButton type="submit">제출하기</SubmitButton>
              </Form>
            </>
          ) : (
            <Title>오늘 작성한 하루다짐이 없어요! 내일 다시 도전해주세요.</Title>
          )}
        </ReflectionSection>
      </ContentWrapper>
    </Container>
  );
};



const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
`;

const TodoSection = styled.div`
  flex: 1;
  margin-right: 20px;
`;

const ReflectionSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  width: 70%;
  margin-top: 15%;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
`;

const TodoTitle = styled.h2`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
`;

const Subtitle = styled.h2`
  font-size: 16px;
  margin-bottom: 20px;
`;

const TodoList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const TodoItem = styled.li`
  font-size: 16px;
  margin-bottom: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
`;

const SubmitButton = styled.button`
  align-self: flex-end;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  background-color: #ffe14f;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
`;


export default Reflexion;
