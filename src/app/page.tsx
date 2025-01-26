'use client';

import { useState, ChangeEvent } from 'react';

interface RoomInput {
  name: string;
  length: string;
  width: string;
  height: string;
  thickness: string;
}

interface RoomResult extends RoomInput {
  wallVolume: string;
  cementQuantity: string;
  sandQuantity: string;
}

interface RoomFormProps {
  rooms: RoomInput[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onChange: (index: number, field: keyof RoomInput, value: string) => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ rooms, currentIndex, setCurrentIndex, onChange }) => {
  const room = rooms[currentIndex];
  
  return (
    <div className="border border-gray-300 rounded p-4 mb-4">
      <h2 className="font-semibold mb-2">Room {currentIndex + 1}</h2>
      <div className="grid grid-cols-2 gap-4">
        {['name', 'length', 'width', 'height', 'thickness'].map((field) => (
          <div key={field} className="mb-2">
            <label className="block text-sm font-medium mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={['length', 'width', 'height', 'thickness'].includes(field) ? 'number' : 'text'}
              value={(room as any)[field]}
              onChange={(e) => onChange(currentIndex, field as keyof RoomInput, e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button 
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} 
          className="bg-gray-500 text-white px-4 py-2 rounded" 
          disabled={currentIndex === 0}
        >
          Back
        </button>
        <select 
          value={currentIndex} 
          onChange={(e) => setCurrentIndex(parseInt(e.target.value))} 
          className="border rounded px-3 py-2"
        >
          {rooms.map((_, index) => (
            <option key={index} value={index}>Room {index + 1}</option>
          ))}
        </select>
        <button 
          onClick={() => setCurrentIndex(Math.min(rooms.length - 1, currentIndex + 1))} 
          className="bg-blue-500 text-white px-4 py-2 rounded" 
          disabled={currentIndex === rooms.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};



export default function Home() {
  const [numberOfRooms, setNumberOfRooms] = useState('');
  const [cementRatio, setCementRatio] = useState('');
  const [sandRatio, setSandRatio] = useState('');
  const [roomInputs, setRoomInputs] = useState<RoomInput[]>([]);
  const [results, setResults] = useState<RoomResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNumberOfRoomsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumberOfRooms(value);
    const count = parseInt(value || '0', 10);
    setRoomInputs(
      Array.from({ length: count }, () => ({
        name: '',
        length: '',
        width: '',
        height: '',
        thickness: '',
      }))
    );
  };

  const handleRoomInputChange = (
    index: number,
    field: keyof RoomInput,
    value: string
  ) => {
    const updatedRooms = [...roomInputs];
    updatedRooms[index] = {
      ...updatedRooms[index],
      [field]: value,
    };
    setRoomInputs(updatedRooms);
  };

  const calculateMortar = () => {
    const C = parseFloat(cementRatio);
    const S = parseFloat(sandRatio);
    if (isNaN(C) || isNaN(S) || (C + S === 0)) return;

    const computedResults: RoomResult[] = roomInputs.map((room) => {
      const { length, width, height, thickness } = room;
      const L = parseFloat(length);
      const W = parseFloat(width);
      const H = parseFloat(height);
      const T = parseFloat(thickness);

      if (isNaN(L) || isNaN(W) || isNaN(H) || isNaN(T)) {
        return { ...room, wallVolume: '0', cementQuantity: '0', sandQuantity: '0' };
      }

      const V = 2 * (L + W) * H * T;
      const wasteMargin = 1.3;
      const cementWeightConversion = 1.25;
      const cementQuantity = ((V * wasteMargin) / (C + S)) * (C / cementWeightConversion);
      const sandQuantity = ((V * wasteMargin) / (C + S)) * S;

      return {
        ...room,
        wallVolume: V.toFixed(2),
        cementQuantity: cementQuantity.toFixed(2),
        sandQuantity: sandQuantity.toFixed(2),
      };
    });

    setResults(computedResults);
  };

  const totalWallVolume = results.reduce((sum, r) => sum + parseFloat(r.wallVolume), 0).toFixed(2);
  const totalCementQuantity = results.reduce((sum, r) => sum + parseFloat(r.cementQuantity), 0).toFixed(2);
  const totalSandQuantity = results.reduce((sum, r) => sum + parseFloat(r.sandQuantity), 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Cement & Sand Calculator</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Cement Ratio</label>
          <input
            type="number"
            value={cementRatio}
            onChange={(e) => setCementRatio(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter cement ratio"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Sand Ratio</label>
          <input
            type="number"
            value={sandRatio}
            onChange={(e) => setSandRatio(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter sand ratio"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Number of Rooms</label>
          <input
            type="number"
            value={numberOfRooms}
            onChange={handleNumberOfRoomsChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter number of rooms"
          />
        </div>

        {/* {roomInputs.map((room, index) => (
          <div key={index} className="border border-gray-300 rounded p-4 mb-4">
            <h2 className="font-semibold mb-2">Room {index + 1}</h2>
            <div className="grid grid-cols-2 gap-4">
              {['name',  'length', 'width', 'height', 'thickness'].map((field) => (
                <div key={field} className="mb-2">
                  <label className="block text-sm font-medium mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type={['length', 'width', 'height', 'thickness'].includes(field) ? 'number' : 'text'}
                    value={(room as any)[field]}
                    onChange={(e) => handleRoomInputChange(index, field as keyof RoomInput, e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              ))}
            </div>
          </div>
        ))} */}

{roomInputs.length > 0 && (
          <RoomForm 
            rooms={roomInputs} 
            currentIndex={currentIndex} 
            setCurrentIndex={setCurrentIndex} 
            onChange={handleRoomInputChange} 
          />
        )}


        <button onClick={calculateMortar} className="bg-blue-500 text-white px-4 py-2 rounded">
          Calculate
        </button>

        {results.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Results</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Room Name</th>
                    <th className="border px-4 py-2">Wall Volume (m³)</th>
                    <th className="border px-4 py-2">Cement Quantity (bags)</th>
                    <th className="border px-4 py-2">Sand Quantity (m³)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border">
                      <td className="border px-4 py-2">{result.name}</td>
                      <td className="border px-4 py-2">{result.wallVolume}</td>
                      <td className="border px-4 py-2">{result.cementQuantity}</td>
                      <td className="border px-4 py-2">{result.sandQuantity}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-300 font-semibold">
                    <td className="border px-4 py-2 text-right" colSpan={2}>
                      Total:
                    </td>
                    <td className="border px-4 py-2">{totalWallVolume}</td>
                    <td className="border px-4 py-2">{totalCementQuantity}</td>
                    <td className="border px-4 py-2">{totalSandQuantity}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
