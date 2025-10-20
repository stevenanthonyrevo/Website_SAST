import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Cog } from "lucide-react";
import { useSettings } from "../hooks/UseSettings";

const SettingsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, toggleSetting, isLoading } = useSettings();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => event.key === "Escape" && setIsOpen(false);
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  if (isLoading) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ isolation: "isolate" }}
    >
      <div className="pointer-events-auto fixed bottom-6 right-6">
        {/* Settings Button */}
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-12 h-12 rounded-full bg-gray-900/90 border border-gray-700/50
            hover:bg-gray-800/90 hover:border-gray-600/50 
            flex items-center justify-center
            transition-all duration-300 ease-in-out
            backdrop-blur-sm shadow-lg hover:shadow-xl
            ${isOpen ? "rotate-180 scale-105" : "hover:scale-105"}
            focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent
          `}
          aria-label="Settings"
        >
          <Cog className="w-5 h-5 text-gray-200" />
        </button>

        {/* Settings Menu */}
        {isOpen && (
          <div
            ref={menuRef}
            className="
              absolute bottom-14 right-0 w-80 
              bg-gray-900/95 backdrop-blur-md border border-gray-700/50
              rounded-xl shadow-2xl overflow-hidden 
              transform transition-all duration-300 ease-out
            "
            style={{
              transform: isOpen
                ? "translateY(0) scale(1)"
                : "translateY(10px) scale(0.95)",
              opacity: isOpen ? 1 : 0,
            }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-700/50 bg-gray-800/30">
              <h3 className="text-lg font-semibold text-gray-100 mb-1">
                Settings
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Configure your preferences
              </p>
            </div>

            {/* Settings List */}
            <div className="py-2">
              {settings.map((setting, index) => (
                <div
                  key={setting.id}
                  className={`
                    px-6 py-4 flex items-center justify-between gap-4
                    hover:bg-gray-800/40 transition-colors duration-200
                    ${
                      index !== settings.length - 1
                        ? "border-b border-gray-800/30"
                        : ""
                    }
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-gray-100 font-medium text-sm leading-relaxed block">
                      {setting.label}
                    </span>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => toggleSetting(setting.id)}
                      className={`
                        relative inline-flex flex-shrink-0 h-6 w-12 rounded-full
                        transition-colors duration-300 ease-in-out focus:outline-none
                        focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-gray-900
                        ${
                          setting.enabled
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-600 hover:bg-gray-500"
                        }
                      `}
                      aria-label={`Toggle ${setting.label}`}
                    >
                      <span
                        className={`
                          inline-block h-5 w-5 rounded-full bg-white shadow-lg
                          transform transition-transform duration-300 ease-in-out
                          mt-0.5
                          ${
                            setting.enabled
                              ? "translate-x-6"
                              : "translate-x-0.5"
                          }
                        `}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default SettingsMenu;
