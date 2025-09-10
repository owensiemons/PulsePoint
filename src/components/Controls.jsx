import React from "react";

export default function Controls({ filters, setFilters }) {
  return (
    <div style={{ position: "absolute", top: 20, left: 20, color: "white" }}>
      <label>
        Min Period (s):
        <input
          type="range"
          min="0.001"
          max="1"
          step="0.001"
          value={filters.minPeriod}
          onChange={(e) =>
            setFilters((f) => ({ ...f, minPeriod: Number(e.target.value) }))
          }
        />
      </label>
      <br />
      <label>
        Max Period (s):
        <input
          type="range"
          min="0.001"
          max="1"
          step="0.001"
          value={filters.maxPeriod}
          onChange={(e) =>
            setFilters((f) => ({ ...f, maxPeriod: Number(e.target.value) }))
          }
        />
      </label>
      <br />
      <label>
        Max Distance (kpc):
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={filters.maxDistance}
          onChange={(e) =>
            setFilters((f) => ({ ...f, maxDistance: Number(e.target.value) }))
          }
        />
      </label>
    </div>
  );
}