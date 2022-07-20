import Lusift from 'lusift/dev/react';

const Progress = () => {
    const progress = Lusift.getActiveGuide().instance.getProgress();
    const currentStepIndex = Lusift.getActiveGuide().instance.getTrackingState().currentStepIndex;
    const totalSteps = Math.floor((100/progress)*(currentStepIndex+1));
    return (
        <div className="text-sm text-gray-700 mt-1">
            {currentStepIndex+1}/{totalSteps} steps
        </div>
    );
}

export default Progress;
