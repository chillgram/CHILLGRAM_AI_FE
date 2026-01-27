import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateADStepLayout from "@/components/layout/CreateADStepLayout";
import CreateADStep1Page from "@/pages/createAD/CreateADStep1Page";
import CreateADStep2Page from "@/pages/createAD/CreateADStep2Page";
import CreateADStep3Page from "@/pages/createAD/CreateADStep3Page";
import CreateADStep4Page from "@/pages/createAD/CreateADStep4Page";
import CreateADStep5Page from "@/pages/createAD/CreateADStep5Page";

export default function CreateADPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [productId, setProductId] = useState("");
  const [adGoal, setAdGoal] = useState("");
  const [requestText, setRequestText] = useState("");
  const [isUploadEnabled, setIsUploadEnabled] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");

  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState("");
  const [selectedCopy, setSelectedCopy] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);

  const canProceedStep1 = Boolean(productId && adGoal);
  const canProceedStep2 = selectedKeywords.length > 0;
  const canProceedStep3 = Boolean(selectedGuide);
  const canProceedStep4 = Boolean(selectedCopy);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return canProceedStep1;
      case 2:
        return canProceedStep2;
      case 3:
        return canProceedStep3;
      case 4:
        return canProceedStep4;
      default:
        return true;
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    if (!canProceed()) return;

    if (currentStep === 5) {
      navigate("/dashboard/createAD/result", {
        state: {
          selectedTypes,
          productId,
          adGoal,
          requestText,
          selectedKeywords,
          selectedGuide,
          selectedCopy,
        },
      });
      return;
    }

    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  return (
    <CreateADStepLayout
      step={currentStep}
      onPrev={handlePrev}
      onNext={handleNext}
      disableNext={!canProceed()}
      nextLabel={currentStep === 5 ? "광고 생성 시작" : "다음"}
    >
      {currentStep === 1 && (
        <CreateADStep1Page
          productId={productId}
          adGoal={adGoal}
          requestText={requestText}
          isUploadEnabled={isUploadEnabled}
          uploadFileName={uploadFileName}
          onChangeProductId={setProductId}
          onChangeAdGoal={setAdGoal}
          onChangeRequestText={setRequestText}
          onToggleUpload={setIsUploadEnabled}
          onChangeUploadFile={setUploadFileName}
        />
      )}

      {currentStep === 2 && (
        <CreateADStep2Page
          selectedKeywords={selectedKeywords}
          onToggleKeyword={(title) =>
            setSelectedKeywords((prev) =>
              prev.includes(title)
                ? prev.filter((item) => item !== title)
                : [...prev, title],
            )
          }
        />
      )}

      {currentStep === 3 && (
        <CreateADStep3Page
          selectedGuide={selectedGuide}
          onSelectGuide={setSelectedGuide}
        />
      )}

      {currentStep === 4 && (
        <CreateADStep4Page
          selectedCopy={selectedCopy}
          onSelectCopy={setSelectedCopy}
        />
      )}

      {currentStep === 5 && (
        <CreateADStep5Page
          selectedTypes={selectedTypes}
          onToggleType={(title) =>
            setSelectedTypes((prev) =>
              prev.includes(title)
                ? prev.filter((item) => item !== title)
                : [...prev, title],
            )
          }
        />
      )}
    </CreateADStepLayout>
  );
}
