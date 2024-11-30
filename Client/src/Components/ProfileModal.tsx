import React from "react";
import styled from "styled-components";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileImageUsedModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <Modal>
        <Message>프로필 이미지로 사용했어요!</Message>
        <Button onClick={onClose}>닫기</Button>
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Message = styled.h1`
  font-size: 18px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 20px;
  background-color: #ffe14f;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
  cursor: pointer;
`;

export default ProfileImageUsedModal;
