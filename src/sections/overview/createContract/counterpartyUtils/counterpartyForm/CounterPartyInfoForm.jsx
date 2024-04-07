import { useState } from 'react';
import IndividualCounterPartyForm from './IndividualCounterPartyForm';
import OrgCounterPartyForm from './OrgCounterPartyForm';
import * as yup from 'yup';

const CounterPartyInfoForm = ({
  typeOfCounterParty,
  setCurrentStep,
  setCounterParties,
  counterParties,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <>
      {typeOfCounterParty === 'Organization' ? (
        <OrgCounterPartyForm
          setCurrentStep={setCurrentStep}
          setCounterParties={setCounterParties}
          counterParties={counterParties}
          onClose={onClose}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      ) : (
        <IndividualCounterPartyForm
          setCurrentStep={setCurrentStep}
          setCounterParties={setCounterParties}
          counterParties={counterParties}
          onClose={onClose}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      )}
    </>
  );
};

export default CounterPartyInfoForm;
