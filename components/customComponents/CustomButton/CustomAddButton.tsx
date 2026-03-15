import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type ButtonSize = "l" | "m" | "s" | "xs";

interface Props {
  text: string;
  onClick: () => void;
  size?: ButtonSize;
  type?: string;
  icon?: any;
  disabled?: boolean; // ✅ boolean olmalıdır
  addDisabled?: boolean;
  loading?: boolean;
}

const CustomAddButton = ({
  text,
  onClick,
  size = "m",
  type,
  icon,
  disabled = false, // ✅ default false
  addDisabled,
  loading,
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.customBtn,
        size === "l"
          ? styles.largeBtn
          : size === "m"
            ? styles.midBtn
            : size === "s"
              ? styles.smallBtn
              : styles.xsBtn,
        type === "secondary" && styles.loadingBtn,
        type === "delete" && styles.deleteBtn,
        disabled && styles.disabledBtn,
        addDisabled && styles.addDisabledBtn,
      ]}
      disabled={disabled}
      onPress={onClick}
      activeOpacity={disabled ? 1 : 0.7}
    >
      {icon && icon}
      <Text
        style={[
          styles.customBtnText,
          size === "l" || size === "m" ? styles.largeText : styles.smallText,
          type === "secondary" && styles.loadingText,
          disabled && styles.disabledText, // ✅ ƏLAVƏ
          icon && { marginLeft: 6 },
        ]}
      >
        {loading ? <ActivityIndicator color="#fff" /> : text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomAddButton;

const styles = StyleSheet.create({
  customBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "#0069FE",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    minWidth: 150,
  },

  largeBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    height: 52,
  },

  midBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },

  smallBtn: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 10,
  },

  xsBtn: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  customBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

  largeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  smallText: {
    fontSize: 14,
  },

  loadingBtn: {
    backgroundColor: "#E4E7EC",
  },

  loadingText: {
    color: "#0E121B",
  },

  deleteBtn: {
    backgroundColor: "#FE171B",
  },

  // ✅ Disabled styles
  disabledBtn: {
    backgroundColor: "#A0A8B0",
    opacity: 0.5,
  },

  disabledText: {
    color: "#E5E7EB",
  },

  addDisabledBtn: {
    backgroundColor: "#0069FE",
    opacity: 0.5,
  },
});
