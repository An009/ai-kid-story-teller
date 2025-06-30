import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Volume2, 
  Wifi, 
  Key, 
  Settings,
  Info,
  Zap,
  Activity,
  Clock
} from 'lucide-react';
import { audioService } from '../services/audioService';

interface TroubleshootingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  highContrast?: boolean;
}

interface DiagnosticResult {
  category: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  solution?: string;
  details?: string;
}

const AudioTroubleshootingPanel: React.FC<TroubleshootingPanelProps> = ({
  isOpen,
  onClose,
  highContrast = false
}) => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<DiagnosticResult[]>([]);
  const [apiTestResult, setApiTestResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      runDiagnostics();
    }
  }, [isOpen]);

  const runDiagnostics = async () => {
    setIsRunningTests(true);
    const results: DiagnosticResult[] = [];
    
    try {
      // Get current diagnostics
      const currentDiagnostics = audioService.getDiagnostics();
      setDiagnostics(currentDiagnostics);

      // Test API Key
      if (!currentDiagnostics.apiKeyValid) {
        results.push({
          category: 'API Configuration',
          status: 'error',
          message: 'ElevenLabs API key is missing or invalid',
          solution: 'Add your ElevenLabs API key to the .env file as VITE_ELEVENLABS_API_KEY',
          details: 'Get your API key from https://elevenlabs.io/app/speech-synthesis'
        });
      } else {
        // Test API connectivity
        const apiTest = await audioService.testApiConnection();
        setApiTestResult(apiTest);
        
        if (apiTest.success) {
          results.push({
            category: 'API Configuration',
            status: 'success',
            message: `API connection successful (${apiTest.latency}ms)`,
            details: 'ElevenLabs API is responding normally'
          });
        } else {
          results.push({
            category: 'API Configuration',
            status: 'error',
            message: 'API connection failed',
            solution: apiTest.error || 'Check your internet connection and API key',
            details: 'Unable to connect to ElevenLabs servers'
          });
        }
      }

      // Test Network Connection
      if (!currentDiagnostics.networkConnected) {
        results.push({
          category: 'Network',
          status: 'error',
          message: 'No internet connection detected',
          solution: 'Check your internet connection and try again',
          details: 'ElevenLabs requires an active internet connection'
        });
      } else {
        results.push({
          category: 'Network',
          status: 'success',
          message: 'Internet connection is active',
          details: 'Network connectivity is working properly'
        });
      }

      // Test Audio Context Support
      if (!currentDiagnostics.audioContextSupported) {
        results.push({
          category: 'Browser Support',
          status: 'error',
          message: 'Audio context not supported',
          solution: 'Use a modern browser like Chrome, Firefox, or Safari',
          details: 'Your browser may not support Web Audio API'
        });
      } else {
        results.push({
          category: 'Browser Support',
          status: 'success',
          message: 'Audio context is supported',
          details: 'Your browser supports Web Audio API'
        });
      }

      // Check for recent errors
      if (currentDiagnostics.lastError) {
        results.push({
          category: 'Recent Issues',
          status: 'warning',
          message: currentDiagnostics.lastError,
          solution: 'See specific error solutions below',
          details: 'This was the most recent error encountered'
        });
      }

      // Check buffer health
      if (currentDiagnostics.bufferHealth < 50) {
        results.push({
          category: 'Audio Quality',
          status: 'warning',
          message: 'Poor audio buffering detected',
          solution: 'Check your internet speed or try shorter text segments',
          details: `Buffer health: ${Math.round(currentDiagnostics.bufferHealth)}%`
        });
      } else {
        results.push({
          category: 'Audio Quality',
          status: 'success',
          message: 'Audio buffering is healthy',
          details: `Buffer health: ${Math.round(currentDiagnostics.bufferHealth)}%`
        });
      }

    } catch (error) {
      results.push({
        category: 'System',
        status: 'error',
        message: 'Diagnostic test failed',
        solution: 'Refresh the page and try again',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    setTestResults(results);
    setIsRunningTests(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'API Configuration':
        return <Key className="w-4 h-4" />;
      case 'Network':
        return <Wifi className="w-4 h-4" />;
      case 'Browser Support':
        return <Settings className="w-4 h-4" />;
      case 'Audio Quality':
        return <Volume2 className="w-4 h-4" />;
      case 'Recent Issues':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const commonSolutions = [
    {
      problem: "Audio cuts out or stops unexpectedly",
      solutions: [
        "Check your internet connection stability",
        "Try shorter text segments (under 1000 characters)",
        "Reduce voice stability setting to 0.6-0.7",
        "Clear browser cache and reload the page"
      ]
    },
    {
      problem: "Voice sounds robotic or unnatural",
      solutions: [
        "Increase similarity boost to 0.8-0.9",
        "Reduce stability to 0.5-0.6 for more expression",
        "Enable speaker boost in voice settings",
        "Try a different voice model (Turbo v2.5 recommended)"
      ]
    },
    {
      problem: "API rate limit errors",
      solutions: [
        "Wait 60 seconds before trying again",
        "Upgrade your ElevenLabs subscription plan",
        "Reduce the frequency of API calls",
        "Use shorter text segments to reduce API usage"
      ]
    },
    {
      problem: "Poor audio quality or distortion",
      solutions: [
        "Check your internet speed (minimum 1 Mbps recommended)",
        "Use the Turbo v2.5 model for better quality",
        "Adjust voice settings: stability 0.75, similarity 0.75",
        "Ensure text doesn't contain special characters"
      ]
    },
    {
      problem: "Authentication or API key errors",
      solutions: [
        "Verify your API key is correctly set in .env file",
        "Check that your ElevenLabs account is active",
        "Ensure you have sufficient credits in your account",
        "Try regenerating your API key in ElevenLabs dashboard"
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
        highContrast ? 'bg-gray-900 border-2 border-white' : 'bg-white border border-gray-200'
      }`}>
        
        {/* Header */}
        <div className={`p-6 border-b ${
          highContrast ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                highContrast ? 'bg-blue-900' : 'bg-blue-100'
              }`}>
                <Zap className={`w-6 h-6 ${
                  highContrast ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${
                  highContrast ? 'text-white' : 'text-gray-900'
                }`}>
                  ElevenLabs Audio Diagnostics
                </h2>
                <p className={`text-sm ${
                  highContrast ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Troubleshoot and optimize your text-to-speech experience
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                highContrast 
                  ? 'hover:bg-gray-800 text-white' 
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={runDiagnostics}
              disabled={isRunningTests}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isRunningTests
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : highContrast
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isRunningTests ? 'animate-spin' : ''}`} />
              <span>{isRunningTests ? 'Running Tests...' : 'Run Diagnostics'}</span>
            </button>

            <button
              onClick={() => audioService.emergencyStop()}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                highContrast
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>Emergency Stop</span>
            </button>
          </div>

          {/* Diagnostic Results */}
          {testResults.length > 0 && (
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${
                highContrast ? 'text-white' : 'text-gray-900'
              }`}>
                System Status
              </h3>
              
              <div className="grid gap-3">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.status === 'success'
                        ? highContrast ? 'bg-green-900 border-green-500' : 'bg-green-50 border-green-200'
                        : result.status === 'warning'
                          ? highContrast ? 'bg-yellow-900 border-yellow-500' : 'bg-yellow-50 border-yellow-200'
                          : highContrast ? 'bg-red-900 border-red-500' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center space-x-2 mt-0.5">
                        {getCategoryIcon(result.category)}
                        {getStatusIcon(result.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-medium ${
                            result.status === 'success'
                              ? highContrast ? 'text-green-400' : 'text-green-800'
                              : result.status === 'warning'
                                ? highContrast ? 'text-yellow-400' : 'text-yellow-800'
                                : highContrast ? 'text-red-400' : 'text-red-800'
                          }`}>
                            {result.category}
                          </h4>
                        </div>
                        <p className={`text-sm mb-2 ${
                          result.status === 'success'
                            ? highContrast ? 'text-green-300' : 'text-green-700'
                            : result.status === 'warning'
                              ? highContrast ? 'text-yellow-300' : 'text-yellow-700'
                              : highContrast ? 'text-red-300' : 'text-red-700'
                        }`}>
                          {result.message}
                        </p>
                        {result.solution && (
                          <p className={`text-xs font-medium ${
                            highContrast ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Solution: {result.solution}
                          </p>
                        )}
                        {result.details && (
                          <p className={`text-xs mt-1 ${
                            highContrast ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            {result.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Performance */}
          {apiTestResult && (
            <div className={`p-4 rounded-lg border ${
              highContrast ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <h4 className={`font-medium mb-2 flex items-center space-x-2 ${
                highContrast ? 'text-white' : 'text-gray-900'
              }`}>
                <Clock className="w-4 h-4" />
                <span>API Performance</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className={`block ${
                    highContrast ? 'text-gray-400' : 'text-gray-600'
                  }`}>Status</span>
                  <span className={`font-medium ${
                    apiTestResult.success 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {apiTestResult.success ? 'Connected' : 'Failed'}
                  </span>
                </div>
                <div>
                  <span className={`block ${
                    highContrast ? 'text-gray-400' : 'text-gray-600'
                  }`}>Latency</span>
                  <span className={`font-medium ${
                    highContrast ? 'text-white' : 'text-gray-900'
                  }`}>
                    {apiTestResult.latency}ms
                  </span>
                </div>
                <div>
                  <span className={`block ${
                    highContrast ? 'text-gray-400' : 'text-gray-600'
                  }`}>Quality</span>
                  <span className={`font-medium ${
                    apiTestResult.latency < 1000 ? 'text-green-600' : 
                    apiTestResult.latency < 3000 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {apiTestResult.latency < 1000 ? 'Excellent' : 
                     apiTestResult.latency < 3000 ? 'Good' : 'Poor'}
                  </span>
                </div>
                <div>
                  <span className={`block ${
                    highContrast ? 'text-gray-400' : 'text-gray-600'
                  }`}>Buffer</span>
                  <span className={`font-medium ${
                    highContrast ? 'text-white' : 'text-gray-900'
                  }`}>
                    {diagnostics?.bufferHealth || 0}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Common Solutions */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${
              highContrast ? 'text-white' : 'text-gray-900'
            }`}>
              Common Issues & Solutions
            </h3>
            
            <div className="space-y-4">
              {commonSolutions.map((item, index) => (
                <details
                  key={index}
                  className={`group rounded-lg border ${
                    highContrast ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <summary className={`p-4 cursor-pointer font-medium ${
                    highContrast ? 'text-white' : 'text-gray-900'
                  } hover:bg-opacity-80`}>
                    {item.problem}
                  </summary>
                  <div className="px-4 pb-4">
                    <ul className="space-y-2">
                      {item.solutions.map((solution, sIndex) => (
                        <li
                          key={sIndex}
                          className={`flex items-start space-x-2 text-sm ${
                            highContrast ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Optimal Settings Recommendations */}
          <div className={`p-4 rounded-lg border ${
            highContrast ? 'bg-blue-900 border-blue-500' : 'bg-blue-50 border-blue-200'
          }`}>
            <h4 className={`font-medium mb-3 ${
              highContrast ? 'text-blue-400' : 'text-blue-800'
            }`}>
              Recommended Settings for Best Quality
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className={`font-medium mb-2 ${
                  highContrast ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  Voice Settings
                </h5>
                <ul className={`space-y-1 ${
                  highContrast ? 'text-blue-200' : 'text-blue-600'
                }`}>
                  <li>• Stability: 0.75 (consistent voice)</li>
                  <li>• Similarity Boost: 0.75 (voice accuracy)</li>
                  <li>• Style: 0.0-0.2 (natural expression)</li>
                  <li>• Speaker Boost: Enabled</li>
                </ul>
              </div>
              <div>
                <h5 className={`font-medium mb-2 ${
                  highContrast ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  Content Guidelines
                </h5>
                <ul className={`space-y-1 ${
                  highContrast ? 'text-blue-200' : 'text-blue-600'
                }`}>
                  <li>• Keep text under 1000 characters</li>
                  <li>• Use proper punctuation</li>
                  <li>• Avoid special characters</li>
                  <li>• Use Turbo v2.5 model</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioTroubleshootingPanel;