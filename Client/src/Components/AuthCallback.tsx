import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      axios
        .post("api/v1/oauth/github/callback", { code }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          // 서버로부터 받은 응답이 JSON 형식인지 확인
          if (response.headers['content-type']?.includes('application/json')) {
            console.log("Access Token:", response.data.access_token);
            navigate("/"); // 로그인 후 홈으로 리디렉션
          } else {
            throw new Error("서버 응답이 JSON 형식이 아닙니다.");
          }
        })
        .catch((error) => {
          console.error("GitHub OAuth 실패:", error);
          // 오류 발생 시 홈으로 리디렉션
        });
    } else {
      console.error("GitHub OAuth 코드 또는 state가 없음");
    }
  }, [navigate]);

  return <div>로그인 중...</div>;
}
