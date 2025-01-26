'use client';

import { useState, ChangeEvent } from 'react';

interface RoomInput {
  name: string;
  size: string;
  length: string;
  width: string;
  height: string;
  thickness: string;
  cementRatio: string;
  sandRatio: string;
}

interface RoomResult extends RoomInput {
  wallVolume: string;
  cementQuantity: string;
  sandQuantity: string;
}

export default function Home() {
  const [numberOfRooms, setNumberOfRooms] = useState('');
  const [roomInputs, setRoomInputs] = useState<RoomInput[]>([
    {
      name: '',
      size: '',
      length: '',
      width: '',
      height: '',
      thickness: '',
      cementRatio: '',
      sandRatio: '',
    },
  ]);

  const [results, setResults] = useState<RoomResult[]>([]);

  const handleNumberOfRoomsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumberOfRooms(value);

    // Convert to integer or 0 if empty
    const count = parseInt(value || '0', 10);

    // Create an array of RoomInput objects
    const inputsArray = Array.from({ length: count }, () => ({
      name: '',
      size: '',
      length: '',
      width: '',
      height: '',
      thickness: '',
      cementRatio: '',
      sandRatio: '',
    }));

    setRoomInputs(inputsArray);
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
    const computedResults: RoomResult[] = roomInputs.map((room) => {
      const {
        length,
        width,
        height,
        thickness,
        cementRatio,
        sandRatio,
      } = room;

      const L = parseFloat(length);
      const W = parseFloat(width);
      const H = parseFloat(height);
      const T = parseFloat(thickness);
      const C = parseFloat(cementRatio);
      const S = parseFloat(sandRatio);

      // Avoid NaN if fields are empty
      if (
        isNaN(L) ||
        isNaN(W) ||
        isNaN(H) ||
        isNaN(T) ||
        isNaN(C) ||
        isNaN(S) ||
        (C + S === 0)
      ) {
        return {
          ...room,
          wallVolume: '0',
          cementQuantity: '0',
          sandQuantity: '0',
        };
      }

      // Volume calculation (perimeter * height * thickness)
      const V = 2 * (L + W) * H * T;

      // Add waste margin
      const wasteMargin = 1.3; // 30% waste

      // Convert volume of cement to "bags" or your chosen unit
      const cementWeightConversion = 1.25;

      const cementQuantity =
        ((V * wasteMargin) / (C + S)) * (C / cementWeightConversion);

      const sandQuantity =
        ((V * wasteMargin) / (C + S)) * S;

      return {
        ...room,
        wallVolume: V.toFixed(2),
        cementQuantity: cementQuantity.toFixed(2),
        sandQuantity: sandQuantity.toFixed(2),
      };
    });

    setResults(computedResults);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Cement & Sand Calculator</h1>

        {/* Number of Rooms Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Number of Rooms
          </label>
          <input
            type="number"
            value={numberOfRooms}
            onChange={handleNumberOfRoomsChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter number of rooms"
          />
        </div>

        {/* Dynamic Rooms */}
        {roomInputs.map((room, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded p-4 mb-4"
          >
            <h2 className="font-semibold mb-2">Room {index + 1}</h2>

            {/* Room Name */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Room Name
              </label>
              <input
                type="text"
                value={room.name}
                onChange={(e) =>
                  handleRoomInputChange(index, 'name', e.target.value)
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Room Size */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Room Size
              </label>
              <input
                type="text"
                value={room.size}
                onChange={(e) =>
                  handleRoomInputChange(index, 'size', e.target.value)
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Length */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Length (L)
              </label>
              <input
                type="number"
                step="any"
                value={room.length}
                onChange={(e) =>
                  handleRoomInputChange(index, 'length', e.target.value)
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Width */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Width (W)
              </label>
              <input
                type="number"
                step="any"
                value={room.width}
                onChange={(e) =>
                  handleRoomInputChange(index, 'width', e.target.value)
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Height */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Height (H)
              </label>
              <input
                type="number"
                step="any"
                value={room.height}
                onChange={(e) =>
                  handleRoomInputChange(index, 'height', e.target.value)
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Wall Thickness */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Wall Thickness (T)
              </label>
              <input
                type="number"
                step="any"
                value={room.thickness}
                onChange={(e) =>
                  handleRoomInputChange(index, 'thickness', e.target.value)
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Cement Ratio */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Cement Ratio (C)
              </label>
              <input
                type="number"
                step="any"
                value={room.cementRatio}
                onChange={(e) =>
                  handleRoomInputChange(index, 'cementRatio', e.target.value)
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Sand Ratio */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Sand Ratio (S)
              </label>
              <input
                type="number"
                step="any"
                value={room.sandRatio}
                onChange={(e) =>
                  handleRoomInputChange(index, 'sandRatio', e.target.value)
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        ))}

        {/* Calculate Button */}
        <button
          onClick={calculateMortar}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Calculate
        </button>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Results</h2>
            {results.map((result, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded p-4 mb-4"
              >
                <p>Room Name: {result.name}</p>
                <p>Room Size: {result.size}</p>
                <p>Wall Volume: {result.wallVolume} m³</p>
                <p>Cement Quantity: {result.cementQuantity} bags</p>
                <p>Sand Quantity: {result.sandQuantity} m³</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
