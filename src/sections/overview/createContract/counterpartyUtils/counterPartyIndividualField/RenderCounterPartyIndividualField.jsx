import React, { useEffect, useState } from 'react';
import { Card, Grid } from '@mui/material';
import { RHFAutocomplete } from 'src/components/hook-form';
import axiosInstance from 'src/utils/axios';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import RenderCounterPartyInfo from './RenderCounterPartyIndividualInfo';
import colorArray from 'src/utils/colorArray';
import useClearFieldErrors from './useClearFieldErrors';
import axios from 'axios';

function RenderCounterPartyIndividualField({
  otherPartyMode,
  control,
  fieldDetails,
  counterParties,
}) {
  const [counterparties, setCounterparties] = useState([]);

  const contract = useSelector((state) => state.contract);
  const { template } = contract;
  // const { counterpartyIndividualMandatoryFields } = template;
  const { counterpartyIndividualMandatoryFields } = fieldDetails;
  const [fields, setFields] = useState([]);

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    const arr = [];
    for (let key in counterpartyIndividualMandatoryFields) {
      if (counterpartyIndividualMandatoryFields[key] && key !== '_id') {
        arr.push(key);
      }
    }
    setFields(arr.length === 0 ? ['fullNameMandatory', 'emailMandatory'] : arr);
  }, []);

  // useEffect(() => {
  //   if (watch(fieldDetails.id)) {
  //     setValue(`${fieldDetails.id}.address`, watch(`${fieldDetails.id}.address`));
  //     setValue(`${fieldDetails.id}.fullName`, watch(`${fieldDetails.id}.fullName`));
  //     setValue(`${fieldDetails.id}.firstName`, watch(`${fieldDetails.id}.firstName`));
  //     setValue(`${fieldDetails.id}.lastName`, watch(`${fieldDetails.id}.lastName`));
  //     setValue(`${fieldDetails.id}.jobTitle`, watch(`${fieldDetails.id}.jobTitle`));
  //     setValue(`${fieldDetails.id}.email`, watch(`${fieldDetails.id}.email`));
  //   }
  // }, [watch(fieldDetails.id)]);

  //clears the error in auto while change of the subfield
  useClearFieldErrors(fieldDetails);

  const fetchCounterparties = async () => {
    // const cpartiesData = await axiosInstance.get(
    //   '/thirdPartyUsers/all/counterparties?type=IndependentIndividual'
    // );

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://cmt-backend-playground.intellosync.com/api/v1/thirdPartyUsers/all/counterparties?type=IndependentIndividual',
      headers: {
        Authorization:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWU3ZjQ5NzI5Y2FhYjdlNGM4OGMyNGEiLCJmdWxsTmFtZSI6IlNlamFsIEdveWFsIiwiZW1haWwiOiJzZWphbC5nb3lhbEBpbnRlbGxvc3luYy5jb20iLCJvcmdJZCI6IjY1ZTdlNWY3MmU3Y2QzNGMzY2EyNTk2NCIsInJvbGUiOiJhZG1pbiIsImVkaXRvckFjY2VzcyI6IndyaXRlciIsImVudmlyb25tZW50IjoicGxheWdyb3VuZCIsImlhdCI6MTcxMjUxOTAyOSwiZXhwIjoxNzEyNjA1NDI5fQ.k9HGq5EBDA5ZfP4B7SV2aXS7nx0Zi0WxsAPZwPa2IwQ',
      },
    };

    try {
      const cpartiesData = await axios.request(config);
      console.log('get counterparties ', cpartiesData.data);
      // return response.data;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch counterparties');
    }

    setCounterparties(
      cpartiesData.data.map((res) => {
        return {
          address: res.address,
          fullName: res.fullName,
          firstName: res.firstName,
          lastName: res.lastName,
          jobTitle: res.jobTitle,
          email: res.email,
          userId: res._id,
        };
      })
    );
  };

  useEffect(() => {
    fetchCounterparties();
  }, [counterParties]);

  //clears the error while change of subfield
  useClearFieldErrors(fieldDetails);

  return (
    // <Card
    // sx={{
    //   width: "100%",
    // border: `1px solid ${colorArray[(Math.floor(Math.random() * 10) + 1) % 30]}`,
    //     mt: 1,
    //     p:1
    //   }}
    // >
    <Grid container>
      <Grid item xs={12} sm={12} md={12}>
        <RHFAutocomplete
          name={`${fieldDetails.id}`}
          label={`Choose counterparty(individual) *`}
          options={counterparties}
          getOptionLabel={(option) => option.fullName}
          ChipProps={{ size: 'small' }}
        />
      </Grid>
      {watch(fieldDetails.id) &&
        fields.map((item) => {
          return <RenderCounterPartyInfo item={item} fieldDetails={fieldDetails} />;
        })}
    </Grid>
    // </Card>
  );
}

export default RenderCounterPartyIndividualField;
