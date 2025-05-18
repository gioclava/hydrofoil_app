'use client';

import React, { useEffect, useState } from 'react';

const STATIC_IP = 'http://192.168.4.1'; // Replace with your actual static IP

type Config = {
  generalConfig: {
    targetHeight: number;
    flyingNeutralAngle: number;
    pitchCorrection: number;
    rollCorrection: number;
  };
  rudderConfig: {
    midPoint: number;
    max: number;
    min: number;
  };
  elevatorConfig: {
    midPoint: number;
    max: number;
    min: number;
  };
  pitchPidConfig: {
    P: number;
    I: number;
    D: number;
    maxOutput: number;
    minOutput: number;
    maxIterm: number;
  };
  rollPidConfig: {
    P: number;
    I: number;
    D: number;
    maxOutput: number;
    minOutput: number;
    maxIterm: number;
  };
  heightPidConfig: {
    P: number;
    I: number;
    D: number;
    maxOutput: number;
    minOutput: number;
    maxIterm: number;
  };
};

export default function Page() {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    fetch(`${STATIC_IP}/config`)
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to fetch config:', err));
  }, []);

  const handleChange = (section: keyof Config, key: string, value: string) => {
    setConfig(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: parseFloat(value),
        },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    try {
      const response = await fetch(`${STATIC_IP}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      alert('Configuration saved successfully!');
    } catch (error) {
      alert('Failed to save configuration.');
      console.error(error);
    }
  };

  if (!config) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      {Object.entries(config).map(([sectionName, section]) => (
        <fieldset key={sectionName} className="border p-4 rounded">
          <legend className="font-bold capitalize">{sectionName}</legend>
          {Object.entries(section).map(([key, value]) => (
            <div key={key} className="mb-2">
              <label className="block mb-1">
                {key}:
                <input
                  type="number"
                  step="any"
                  className="border p-1 ml-2 w-32"
                  value={value}
                  onChange={e =>
                    handleChange(sectionName as keyof Config, key, e.target.value)
                  }
                />
              </label>
            </div>
          ))}
        </fieldset>
      ))}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Config
      </button>
    </form>
  );
}
