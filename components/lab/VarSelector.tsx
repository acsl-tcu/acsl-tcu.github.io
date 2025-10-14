import React from 'react'

const VarSelector: React.FC<{ vars: string[], labels: string[], current: string, setVar: (v: string) => void }> = ({ vars, labels, current, setVar }) => {
  return (
    <div className="py-0 px-4 flex justify-end" >
      {
        vars.map((t, i) => (
          <button
            key={t}
            onClick={() => setVar(t)}
            className={`px-2 py-0 rounded border ${current === t ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'
              }`}
          >
            {labels[i]}
          </button>
        ))}
    </div>
  );
}
export default VarSelector;