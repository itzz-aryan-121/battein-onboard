import React from 'react';

interface ContinueOrFreshModalProps {
  open: boolean;
  onContinue: () => void;
  onStartFresh: () => void;
}

const ContinueOrFreshModal: React.FC<ContinueOrFreshModalProps> = ({ open, onContinue, onStartFresh }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center relative animate-fadeIn border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Resume your progress?</h2>
        <p className="text-gray-600 mb-8">We found an unfinished session. Would you like to continue where you left off, or start fresh?</p>
        <div className="flex flex-col gap-4">
          <button
            className="bg-[#F5BC1C] hover:bg-[#e0a800] text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow hover:shadow-md"
            onClick={onContinue}
          >
            Continue
          </button>
          <button
            className="bg-gray-200 hover:bg-red-400 hover:text-white text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors shadow hover:shadow-md"
            onClick={onStartFresh}
          >
            Start Fresh
          </button>
        </div>
      </div>
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ContinueOrFreshModal; 