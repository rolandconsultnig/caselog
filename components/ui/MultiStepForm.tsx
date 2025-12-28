'use client';

import { useState, ReactNode, Children, isValidElement } from 'react';

interface MultiStepFormProps {
  children: ReactNode;
  onSubmit: () => void;
  stepValidators?: (() => { isValid: boolean; errors: string[] })[];
}

export function MultiStepForm({ children, onSubmit, stepValidators = [] }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const steps = Children.toArray(children).filter(isValidElement);

  const goToNext = () => {
    // Validate current step before proceeding
    if (stepValidators[currentStep]) {
      const validation = stepValidators[currentStep]();
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        return;
      }
    }
    
    // Clear errors if validation passes
    setValidationErrors([]);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  const stepLabels = [
    'Case Overview', 
    'Victim Details', 
    'Perpetrator Details', 
    'Offence Details',
    'Medical Reports',
    'Evidence & Custody',
    'Forensic Examiner'
  ];

  return (
    <div>
      {/* Step Indicator */}
      <div className="mb-6">
        <div className="flex justify-center items-center mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index === currentStep
                      ? 'bg-green-600 text-white ring-4 ring-green-200'
                      : index < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                {stepLabels[index] && (
                  <span
                    className={`text-xs mt-2 font-medium ${
                      index === currentStep
                        ? 'text-green-600 font-semibold'
                        : index < currentStep
                        ? 'text-green-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {stepLabels[index]}
                  </span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-20 h-1 mx-2 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Step Content */}
      <div>{steps[currentStep]}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <div>
          {currentStep > 0 && (
            <button
              type="button"
              onClick={goToPrevious}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              ← Previous
            </button>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {currentStep + 1} of {steps.length}
        </div>
        <div>
          {!isLastStep ? (
            <button
              type="button"
              onClick={goToNext}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
            >
              <span>Submit Case</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export const FormStep = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};
