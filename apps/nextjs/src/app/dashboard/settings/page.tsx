"use client";

import React, { useState } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("system");

  return (
    <div className="max-w-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold">Settings</h1>
        <form className="space-y-6">
          <div>
            <label className="mb-1 block font-medium">Theme</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
}
