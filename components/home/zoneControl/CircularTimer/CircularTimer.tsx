import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface CircularTimerProps {
  remaining: number;
  total: number;
  isPaused?: boolean;
}

const CircularTimer = ({
  remaining,
  total,
  isPaused = false,
}: CircularTimerProps) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const size = 220;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? remaining / total : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const ticks = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    if (isPaused) {
      // ✅ Yanıb-sönmə başlat
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      // ✅ Animasiyanı dayandır, opacity-ni sıfırla
      pulseAnim.stopAnimation();
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isPaused]);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
      }}
    >
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        {ticks.map((i) => {
          const angle = (i * 360) / 60;
          const rad = (angle - 90) * (Math.PI / 180);
          const isMajor = i % 5 === 0;
          const outerR = radius - 2;
          const innerR = outerR - (isMajor ? 10 : 5);
          return (
            <Circle
              key={i}
              cx={size / 2 + Math.cos(rad) * ((outerR + innerR) / 2)}
              cy={size / 2 + Math.sin(rad) * ((outerR + innerR) / 2)}
              r={isMajor ? 2 : 1}
              fill="#D1D5DB"
            />
          );
        })}

        {/* Background ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E4E7EC"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress ring */}
        {total > 0 && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#0069FE"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        )}
      </Svg>

      <Animated.Text
        style={{
          fontSize: 28,
          fontWeight: "600",
          color: "#0E121B",
          letterSpacing: 2,
          opacity: pulseAnim,
        }}
      >
        {timeStr}
      </Animated.Text>
    </View>
  );
};

export default CircularTimer;
