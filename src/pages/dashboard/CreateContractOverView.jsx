import { Helmet } from 'react-helmet-async';
import { CreateContract } from 'src/sections/overview/createContract/CreateContract';

// ----------------------------------------------------------------------

export default function CreateContractOverView() {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <CreateContract />
    </>
  );
}
