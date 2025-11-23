"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode } from "@/state";
import Header from "@/app/(components)/Header";

type UserSetting = {
  label: string;
  value: string | boolean;
  type: "text" | "toggle";
  action?: () => void;
};

const Settings = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Don't use useState - just create the array directly
  // It will re-create on every render with the latest Redux state
  const userSettings: UserSetting[] = [
    { label: "Username", value: "john_doe", type: "text" },
    { label: "Email", value: "john.doe@example.com", type: "text" },
    { 
      label: "Notification", 
      value: true, 
      type: "toggle",
      // No action = disabled/read-only
    },
    { 
      label: "Dark Mode", 
      value: isDarkMode, // Always current from Redux
      type: "toggle",
      action: () => dispatch(setIsDarkMode(!isDarkMode))
    },
    { label: "Language", value: "English", type: "text" },
  ];

  const handleToggleChange = (index: number) => {
    const setting = userSettings[index];
    
    if (setting.action) {
      setting.action();
    }
  };

  return (
    <div className="w-full">
      <Header name="User Settings" />
      <div className="overflow-x-auto mt-5 shadow-md">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
          <thead className="bg-gray-800 dark:bg-gray-900 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Setting
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {userSettings.map((setting, index) => (
              <tr className="hover:bg-blue-50 dark:hover:bg-gray-700" key={setting.label}>
                <td className="py-2 px-4 dark:text-gray-200">{setting.label}</td>
                <td className="py-2 px-4">
                  {setting.type === "toggle" ? (
                    <label className={`inline-flex relative items-center ${setting.action ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={setting.value as boolean}
                        onChange={() => handleToggleChange(index)}
                        disabled={!setting.action}
                      />
                      <div
                        className={`w-11 h-6 rounded-full peer peer-focus:ring-4 
                        transition peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                        after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                        ${setting.action 
                          ? 'bg-gray-200 dark:bg-gray-600 peer-focus:ring-blue-400 peer-checked:bg-blue-600' 
                          : 'bg-gray-300 dark:bg-gray-700 peer-checked:bg-gray-400 dark:peer-checked:bg-gray-600'
                        }`}
                      ></div>
                    </label>
                  ) : (
                    <input
                      type="text"
                      className="px-4 py-2 border rounded-lg text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                      value={setting.value as string}
                      readOnly
                      disabled
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Settings;