"use client";

import { createContext, useState } from "react";

export const UserInputContext = createContext();

export const UserInputProvider = ({ children }) => {
  const [userCourseInput, setUserCourseInput] = useState({});

  return (
    <UserInputContext.Provider value={{ userCourseInput, setUserCourseInput }}>
      {children}
    </UserInputContext.Provider>
  );
};