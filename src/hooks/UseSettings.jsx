import { useSettingsContext } from "../context/SettingsContext";

/**
 * Custom hook to use settings throughout the application
 * Provides easy access to settings state and methods
 */
export const useSettings = () => {
  const context = useSettingsContext();

  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }

  return context;
};

export default useSettings;
