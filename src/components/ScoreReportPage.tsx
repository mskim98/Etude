"use client";
// This component has been replaced by separate SATResultsPage and APResultsPage components
// Please use the appropriate results page based on exam type

import React from "react";

export function ScoreReportPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-4">
          This component has been deprecated
        </h2>
        <p className="text-gray-600">
          Please use SATResultsPage or APResultsPage instead
        </p>
      </div>
    </div>
  );
}