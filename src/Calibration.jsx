import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import webgazer from "webgazer";

const calibrationPoints = [
  { x: 100, y: 100 },
  { x: window.innerWidth / 2, y: 100 },
  { x: window.innerWidth - 100, y: 100 },
  { x: 100, y: window.innerHeight / 2 },
  { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  { x: window.innerWidth - 100, y: window.innerHeight / 2 },
  { x: 100, y: window.innerHeight - 100 },
  { x: window.innerWidth / 2, y: window.innerHeight - 100 },
  { x: window.innerWidth - 100, y: window.innerHeight - 100 },
];

export default function Calibration({ setCalibrationOffsets }) {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [calibrationData, setCalibrationData] = useState([]);
  const [offsets, setOffsets] = useState({ x: 0, y: 0 }); // 실시간 보정값
  const navigate = useNavigate();
  const timerRef = useRef(null); // 타이머 참조값

  const startCalibration = () => {
    setCalibrationData([]);
    setIsCalibrating(true);
    setCurrentPointIndex(0);

    webgazer.setGazeListener(handleGazeData).begin();

    // WebGazer UI 숨기기
    webgazer.showVideo(false);
    webgazer.showFaceOverlay(false);
    webgazer.showFaceFeedbackBox(false);

    // 첫 번째 기준점 타이머 시작
    startPointTimer();
  };

  const stopCalibration = () => {
    if (timerRef.current) clearTimeout(timerRef.current); // 타이머 정리
    webgazer.end();
    setIsCalibrating(false);
    setCalibrationOffsets(offsets); // 최종 보정값 저장
    navigate("/memoryGame"); // MemoryTest.jsx로 이동
  };

  const startPointTimer = () => {
    // 기존 타이머 제거
    if (timerRef.current) clearTimeout(timerRef.current);

    // 타이머 시작: 3초 뒤 다음 기준점으로 이동
    timerRef.current = setTimeout(() => {
      if (currentPointIndex < calibrationPoints.length) {
        collectCurrentPointData();
        if (currentPointIndex < calibrationPoints.length - 1) {
          setCurrentPointIndex((prev) => prev + 1);
          startPointTimer(); // 다음 기준점 타이머 시작
        } else {
          stopCalibration(); // 모든 기준점을 완료하면 종료
        }
      }
    }, 3000); // 3초
  };

  const collectCurrentPointData = () => {
    const currentPoint = calibrationPoints[currentPointIndex];

    if (!currentPoint) return; // currentPoint가 undefined인 경우 처리

    // 보정값 업데이트
    if (calibrationData.length > 0) {
      const lastGaze = calibrationData[calibrationData.length - 1].gaze;
      const offsetX = currentPoint.x - lastGaze.x;
      const offsetY = currentPoint.y - lastGaze.y;

      setOffsets((prev) => ({
        x: prev.x + offsetX / calibrationPoints.length,
        y: prev.y + offsetY / calibrationPoints.length,
      }));
    }

    // 현재 기준점 데이터를 추가
    setCalibrationData((prev) => [
      ...prev,
      { gaze: { x: offsets.x, y: offsets.y }, point: currentPoint },
    ]);
  };

  const handleGazeData = (data) => {
    if (!data) return;

    const adjustedX = data.x + offsets.x;
    const adjustedY = data.y + offsets.y;

    setCalibrationData((prev) => [
      ...prev,
      { gaze: { x: adjustedX, y: adjustedY }, point: calibrationPoints[currentPointIndex] },
    ]);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-200 to-purple-300">
      <h1 className="text-4xl font-bold text-indigo-800 mb-8">
        Eye Tracking Calibration
      </h1>
      <div
        className="absolute w-6 h-6 bg-red-500 rounded-full shadow-lg"
        style={{
          left: `${calibrationPoints[currentPointIndex]?.x || 0}px`,
          top: `${calibrationPoints[currentPointIndex]?.y || 0}px`,
          display: isCalibrating ? "block" : "none",
        }}
      ></div>
      <div className="flex space-x-4">
        {!isCalibrating && (
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            onClick={startCalibration}
          >
            Start Calibration
          </button>
        )}
        {isCalibrating && (
          <button
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
            onClick={stopCalibration}
          >
            Stop Calibration
          </button>
        )}
      </div>
    </div>
  );
}
