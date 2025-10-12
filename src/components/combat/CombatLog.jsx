import { useEffect, useRef } from 'react';

const CombatLog = ({ logs }) => {
  const logEndRef = useRef(null);
  
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);
  
  return (
    <div className="bg-gray-800 p-3 rounded max-h-32 overflow-y-auto">
      {logs.map((log, idx) => (
        <div key={idx} className="text-sm text-gray-300">
          {log}
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
};

export default CombatLog;