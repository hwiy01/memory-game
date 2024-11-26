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
  const [calibrationData, setCalibrationData] = useState([]); // 모든 시선 데이터
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

    startPointTimer();
  };

  const stopCalibration = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    webgazer.end();
    setIsCalibrating(false);

    // 최종 보정값 계산
    const finalOffsets = calculateFinalOffsets(calibrationData);
    setCalibrationOffsets(finalOffsets); // 부모 컴포넌트에 전달
    console.log("Final Offsets:", finalOffsets);

    // Calibration 종료 후 자동으로 다음 페이지로 이동
    navigate("/userForm");
  };

  const startPointTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // 5초 후 다음 기준점으로 이동
    timerRef.current = setTimeout(() => {
      if (currentPointIndex < calibrationPoints.length - 1) {
        setCurrentPointIndex((prev) => prev + 1);
        startPointTimer(); // 다음 기준점 타이머 시작
      } else {
        stopCalibration(); // 모든 기준점이 완료되면 종료
      }
    }, 5000); // 5초
  };

  const handleGazeData = (data) => {
    if (!data) return;

    const currentPoint = calibrationPoints[currentPointIndex];
    if (!currentPoint) return;

    // 현재 시선 데이터를 저장
    setCalibrationData((prev) => [
      ...prev,
      { gaze: { x: data.x, y: data.y }, point: currentPoint },
    ]);
  };

  const calculateFinalOffsets = (data) => {
    let totalOffsetX = 0;
    let totalOffsetY = 0;
    let count = 0;

    data.forEach(({ gaze, point }) => {
      if (gaze && point) {
        totalOffsetX += point.x - gaze.x;
        totalOffsetY += point.y - gaze.y;
        count++;
      }
    });

    return {
      x: totalOffsetX / count,
      y: totalOffsetY / count,
    };
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
