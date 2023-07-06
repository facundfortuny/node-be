import dotenv from "dotenv";
import { Onfido, Region } from "@onfido/api";

dotenv.config();

const onfido = new Onfido({
  apiToken: process.env.ONFIDO_API_TOKEN_PROD,
  region: Region.EU,
});

export const createApplicant = async (firstName, lastName) => {
  try {
    const applicant = await onfido.applicant.create({
      firstName,
      lastName,
    });
    return applicant.id;
  } catch (error) {
    console.log(error.message);
  }
};

export const getSdkToken = async (applicantId) => {
  try {
    const sdkToken = await onfido.sdkToken.generate({
      applicantId,
      referrer: "http://localhost:5173/",
    });
    return sdkToken;
  } catch (error) {
    console.log(error.message);
  }
};

export const checkApplicant = async (applicantId, reportNames) => {
  try {
    const newCheck = await onfido.check.create({
      applicantId,
      reportNames: reportNames,
    });

    return newCheck;
  } catch (error) {
    console.log(error.message);
  }
};

export const getCheck = async (checkId) => {
  try {
    const check = await onfido.check.find(checkId);
    return check;
  } catch (error) {
    console.log(error.message);
  }
};

export const getReports = async (checkId) => {
  try {
    const report = await onfido.report.list(checkId);
    return report;
  } catch (error) {
    console.log(error.message);
  }
};

export const getReport = async (reportId) => {
  try {
    const report = await onfido.report.find(reportId);
    return report;
  } catch (error) {
    console.log(error.message);
  }
};

export const findDocument = async (documentId) => {
  try {
    const document = await onfido.document.find(documentId);
    return document;
  } catch (error) {
    console.log(error.message);
  }
};

export const getDocuments = async (applicantId) => {
  try {
    const document = await onfido.document.list(applicantId);
    return document;
  } catch (error) {
    console.log(error.message);
  }
};

export const getAutofill = async (documentId) => {
  try {
    const autofill = await onfido.autofill.perform(documentId);
    return autofill;
  } catch (error) {
    console.log(error.message);
  }
};
