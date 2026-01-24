/* eslint-disable react/react-in-jsx-scope */
"use client";
import { Suspense, useState } from "react";
import EpisodeEducationForm from "@/components/Form/UploadEducation/EpisodeUploadForm";
import EducationHeaderTab from "@/components/UploadForm/EducationHeaderTab";
import PreviewEducation from "@/components/Form/UploadEducation/PreviewEducation";
import EditEducationForm from "@/components/Form/UploadEducation/EditEducationForm";

export default function UploadEbookEpisodePage({ params }) {
  const [step, setStep] = useState(3);
  const { id } = params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-4">
        <EducationHeaderTab type={"education"} step={step} setStep={setStep} />
        {(step == 1 || step == 2) && <EditEducationForm educationId={id} step={step} setStep={setStep} />}
        {step == 3 && <EpisodeEducationForm educationId={id} step={step} setStep={setStep} />}
        {step == 4 && <PreviewEducation educationId={id} />}
      </div>
    </Suspense>
  );
}
