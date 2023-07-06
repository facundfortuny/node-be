const dotenv = require("dotenv");
const { Onfido, Region } = require("@onfido/api");

dotenv.config();

const onfido = new Onfido({
  apiToken: process.env.ONFIDO_API_TOKEN_PROD,
  region: Region.EU,
});

const createApplicant = async (firstName, lastName) => {
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

const getSdkToken = async (applicantId) => {
  try {
    const sdkToken = await onfido.sdkToken.generate({
      applicantId,
      referrer: process.env.REFERRER_URL,
    });
    return sdkToken;
  } catch (error) {
    console.log(error.message);
  }
};

const checkApplicant = async (applicantId, reportNames) => {
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

const getCheck = async (checkId) => {
  try {
    const check = await onfido.check.find(checkId);
    return check;
  } catch (error) {
    console.log(error.message);
  }
};

const getReports = async (checkId) => {
  try {
    const report = await onfido.report.list(checkId);
    return report;
  } catch (error) {
    console.log(error.message);
  }
};

const getReport = async (reportId) => {
  try {
    const report = await onfido.report.find(reportId);
    return report;
  } catch (error) {
    console.log(error.message);
  }
};

const findDocument = async (documentId) => {
  try {
    const document = await onfido.document.find(documentId);
    return document;
  } catch (error) {
    console.log(error.message);
  }
};

const getDocuments = async (applicantId) => {
  try {
    const document = await onfido.document.list(applicantId);
    return document;
  } catch (error) {
    console.log(error.message);
  }
};

const getAutofill = async (documentId) => {
  try {
    const autofill = await onfido.autofill.perform(documentId);
    return autofill;
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  createApplicant,
  getSdkToken,
  checkApplicant,
  getReports,
  getReport,
  findDocument,
  getCheck,
  getDocuments,
  getAutofill,
};
