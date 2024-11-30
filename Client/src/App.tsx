import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Header from "./Components/Header";
import Mainpage from "./pages/MainPage";
import Ranking from "./pages/RankingPage";
import Wrapup from "./pages/WrapupPage";
import Clockpage from "./pages/Clockpage";
import Mypage from "./pages/Mypage";
import StudyPage from "./pages/Studypage";
import TodoPage from "./pages/TodoPage";
import AuthCallback from "./Components/AuthCallback";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/RegisterPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/todo" element={<TodoPage />} />
          <Route path="/wrapup" element={<Wrapup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/clock" element={<Clockpage />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register/>} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
