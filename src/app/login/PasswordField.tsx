"use client";

import { Link } from "components/ui/Link";
import { useState } from "react";

export function PasswordField() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder={showPassword ? "" : "••••••••••"}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
          spellCheck={false}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              onChange={(event) => {
                setShowPassword(event.target.checked);
              }}
              id="showPassword"
              aria-describedby="showPassword"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="showPassword" className="text-gray-500 dark:text-gray-300">
              Show password
            </label>
          </div>
        </div>
        <Link href="#" className="text-sm">
          Forgot password?
        </Link>
      </div>
    </>
  );
}
