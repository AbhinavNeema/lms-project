export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-[400px] bg-white/80 backdrop-blur-sm rounded-3xl p-8">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
      <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full absolute top-0 animate-spin"></div>
    </div>
    <div className="mt-8 text-center">
      <p className="text-gray-800 font-medium">Analyzing your profile...</p>
      <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
    </div>
  </div>
);
