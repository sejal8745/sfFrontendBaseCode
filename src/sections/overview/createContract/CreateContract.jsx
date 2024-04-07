import { Divider, Grid, Typography, Box, Button, Tooltip } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider from 'src/components/hook-form/form-provider';
import React, { useEffect, useState } from 'react';
import axiosInstance from 'src/utils/axios';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CompressOutlined } from '@mui/icons-material';
import CounterPartyAdditionDrawer from './counterpartyUtils/counterpartyForm/CounterPartyAdditionDrawer';
import RenderField from './RenderField';

export const CreateContract = () => {
  const methods = useForm();
  const { setValue, watch, reset } = methods;
  const { enqueueSnackbar } = useSnackbar();
  const { orgId, templateId, recordId } = useParams();
  const [templateFields, setTemplateFields] = useState(null);
  const [templateVersionWarningFlag, setTemplateVersionWarningFlag] = useState(false);
  const [attributeValueMap, setAttributeValueMap] = useState({});
  const [isCounterPartyAdditionDrawerOpen, setIsCounterPartyAdditionDrawerOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [counterParties, setCounterParties] = useState([]);

  console.log('orgId ----->', orgId);
  console.log('templateId ----->', templateId);
  console.log('recordId ------->', recordId);

  // function to fetch the template fields
  async function fetchTemplateFields(templateId) {
    try {
      const response = await axios.get(
        `https://cmt-backend-playground.intellosync.com/api/v1/templates/660ba71a71594032ea9c281b`,
        // `https://cmt-backend-playground.intellosync.com/api/v1/templates/${templateId}`,
        {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWU3ZjQ4MDI5Y2FhYjdlNGM4OGMyNDkiLCJmdWxsTmFtZSI6IlNhaGlsIEt1bWFyIiwiZW1haWwiOiJzYWhpbC5rdW1hckBpbnRlbGxvc3luYy5jb20iLCJvcmdJZCI6IjY1ZTdlNWY3MmU3Y2QzNGMzY2EyNTk2NCIsInJvbGUiOiJhZG1pbiIsImVkaXRvckFjY2VzcyI6IndyaXRlciIsImVudmlyb25tZW50IjoicGxheWdyb3VuZCIsImlhdCI6MTcxMjIxNDQ5OSwiZXhwIjoxNzEyMzAwODk5fQ.77_b2p6OwaUieuUxzE9nwXFc4vVeVT4XlBcpAtppF9A',
          },
        }
      );
      const templateDetails = response.data.data;

      // Extract ID, type, and optionally isMandatory for counterpartyIndividual fields
      const fieldDetails = templateDetails.templateFields.map((field) => {
        const fieldInfo = {
          id: field.id,
          type: field.type,
          label: field.label,
        };

        return fieldInfo;
      });

      return fieldDetails;
    } catch (error) {
      console.error('Error fetching template fields:', error);
      throw new Error('Failed to fetch template fields');
    }
  }

  // if type === counterparties wala
  async function fetchCounterparties() {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://cmt-backend-playground.intellosync.com/api/v1/thirdPartyUsers/all/counterparties?type=IndependentIndividual',
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWU3ZjQ4MDI5Y2FhYjdlNGM4OGMyNDkiLCJmdWxsTmFtZSI6IlNhaGlsIEt1bWFyIiwiZW1haWwiOiJzYWhpbC5rdW1hckBpbnRlbGxvc3luYy5jb20iLCJvcmdJZCI6IjY1ZTdlNWY3MmU3Y2QzNGMzY2EyNTk2NCIsInJvbGUiOiJhZG1pbiIsImVkaXRvckFjY2VzcyI6IndyaXRlciIsImVudmlyb25tZW50IjoicGxheWdyb3VuZCIsImlhdCI6MTcxMjIxNDQ5OSwiZXhwIjoxNzEyMzAwODk5fQ.77_b2p6OwaUieuUxzE9nwXFc4vVeVT4XlBcpAtppF9A',
      },
    };

    try {
      const response = await axios.request(config);
      console.log('get counterparties ', response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch counterparties');
    }
  }

  async function fetchRecordDetails(recordId) {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:3015/api/v1/salesforce/launch/${recordId}`,
        headers: {},
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error; // Rethrow the error to handle it outside this function
    }
  }

  async function fetchMappingConfiguration(templateId) {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:3015/api/v1/configuration/mapping/${templateId}`,
        headers: {},
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error; // Rethrow the error to handle it outside this function
    }
  }

  //fucntion jisko id VS type kii mapping denge aur wo fieldDetails wala array fill krega

  useEffect(() => {
    const fetchData = async () => {
      const getTemplateFields = async () => {
        try {
          const templateFieldDetails = await fetchTemplateFields(templateId);
          console.log('template field response ', templateFieldDetails);
          setTemplateFields(templateFieldDetails);
        } catch (error) {
          console.error('Error fetching template fields:', error);
        }
      };
      getTemplateFields();

      const getCounterparties = async () => {
        try {
          const counterparties = await fetchCounterparties();
          console.log('counterparties wala data iss --->', counterparties);
          setCounterParties(counterparties);
          console.log('capital wala counterparty', counterParties);
        } catch (error) {
          console.log('error in fetching counter parties', error);
        }
      };

      try {
        // Fetch record details
        const recordDetails = await fetchRecordDetails(recordId);
        console.log('recordDetails are ---->', recordDetails);

        // Fetch mapping configuration
        const fieldMappingConfiguration = await fetchMappingConfiguration(templateId);
        console.log('fieldMappingConfig are ---->', fieldMappingConfiguration);

        // Create key-value mapping
        const attributeValueMaps = getTemplateAttributesValues(
          recordDetails,
          fieldMappingConfiguration
        );
        console.log('Attribute values map', attributeValueMap);
        setAttributeValueMap(attributeValueMaps);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  function getTemplateAttributesValues(recordDetails, fieldMappingConfiguration) {
    const attributeValueMap = {};

    // Iterate through each field mapping configuration
    fieldMappingConfiguration.forEach((mapping) => {
      // Extract necessary information from the mapping
      const templateAttributeId = mapping.templateAttributeId;
      const externalSystemAttributeName = mapping.externalSystemAttributeName;

      // Find the value in recordDetails corresponding to externalSystemAttributeName
      const value = recordDetails[externalSystemAttributeName];

      // Map the templateAttributeId to the value
      attributeValueMap[templateAttributeId] = value;
    });

    return attributeValueMap;
  }

  //ye function call hoga on submit
  const onSubmit = async (data) => {
    console.log('Hello from create org', data);

    try {
      const formatData = {
        ...data,
        features: {
          editor: data.editor,
          esign: data.esign,
          aiAssist: data.aiAssist,
        },
      };

      delete formatData.editor;
      delete formatData.esign;
      delete formatData.aiAssist;

      const response = await axiosInstance.post('/v1/support/org', formatData, {});
      console.log('response on creating data', response);
      reset();
      enqueueSnackbar('Org created has been updated!!');
    } catch (error) {
      console.log(error);
    }
  };

  const openFieldsAsDrawer = (e) => {
    e.preventDefault();
    setOpenDrawer(!openDrawer);
  };

  const closeFieldsDrawer = () => {
    setOpenDrawer(false);
  };

  console.log(watch(), 'formValues');

  return (
    <div>
      <Grid xs={12} s={12} md={12} variant="contained" sx={{ textAlign: 'right' }}>
        {templateFields &&
          templateFields.filter(
            (res) =>
              res.type === 'counterpartyOrg' ||
              res.type === 'counterpartyOrgPerson' ||
              res.type === 'counterpartyIndividual'
          ).length === 0 && (
            <Button sx={{ mr: 1 }} variant="outlined" onClick={openFieldsAsDrawer}>
              Assign to Any Other Party
            </Button>
          )}
        {isCounterPartyAdditionDrawerOpen && (
          <CounterPartyAdditionDrawer
            open={isCounterPartyAdditionDrawerOpen}
            setIsCounterPartyAdditionDrawerOpen={setIsCounterPartyAdditionDrawerOpen}
            setCounterParties={setCounterParties}
            counterParties={counterParties}
            attributeValueMap={attributeValueMap}
          />
        )}
      </Grid>

      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={10}>
            <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
              Create contract
            </Typography>
            {/* <br /> */}
            <Divider variant="middle" />
          </Grid>
          <Grid item xs={12} sm={12} md={2}>
            {templateFields &&
              templateFields.filter(
                (res) =>
                  res.type == 'counterpartyOrg' ||
                  res.type === 'counterpartyOrgPerson' ||
                  res.type === 'counterpartyIndividual'
              ).length !== 0 && (
                <Button
                  sx={{ ml: 1 }}
                  variant="contained"
                  onClick={(e) => setIsCounterPartyAdditionDrawerOpen(true)}
                >
                  Add Counterparty
                </Button>
              )}
          </Grid>
          <Grid item xs={12} sm={12} md={12}></Grid>
          {templateFields?.map((fieldDetails, idx) => {
            console.log(fieldDetails, 'fielddetails are here ');
            {
              return (
                <Grid
                  item
                  xs={6}
                  sm={6}
                  key={idx}
                  md={
                    fieldDetails.type === 'address' ||
                    fieldDetails.type === 'monetary' ||
                    fieldDetails.type === 'duration' ||
                    fieldDetails.type === 'phone' ||
                    fieldDetails.type === 'counterpartyIndividual' ||
                    fieldDetails.type === 'counterpartyOrg' ||
                    fieldDetails.type === 'counterpartyOrgPerson' ||
                    fieldDetails.type === 'paragraph'
                      ? 12
                      : 6
                  }
                >
                  <Tooltip title={fieldDetails.id} placement="top-end">
                    <span>
                      <RenderField
                        attributeValueMap={attributeValueMap}
                        otherPartyMode={false}
                        fieldDetails={fieldDetails}
                        control={methods.control}
                        counterParties={counterParties}
                      />
                    </span>
                  </Tooltip>
                </Grid>
              );
            }
          })}
          {/* <OrgForm /> */}
          <Grid item sx={{ p: 2 }} xs={12} sm={12} md={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained">
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </FormProvider>
    </div>
  );
};
