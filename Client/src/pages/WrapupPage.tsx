import { useState } from "react";
import CreatingProfileImage from "../Components/CreatingProfileImg";
import ProfileImageCreated from "../Components/ProfileImgCreated";
import ProfileImageUsedModal from "../Components/ProfileModal";
import Reflexion from "../Components/Reflexion";

export default function WrapupPage() {
  const [step, setStep] = useState(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // 이미지 URL 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {step === 1 && (
        <Reflexion 
          onNext={() => setStep(2)} 
          onImageCreated={(url) => {
            setImageUrl(url);
            setStep(3); // 이미지 생성 완료 후 다음 단계로 이동
          }} 
        />
      )}
      {step === 2 && <CreatingProfileImage onNext={() => setStep(3)} />}
      {step === 3 && imageUrl && (
        <ProfileImageCreated onUseImage={() => setIsModalOpen(true)} imageUrl={imageUrl} />
      )}
      <ProfileImageUsedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
