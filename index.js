const express = require("express");
const {
  createApplicant,
  getSdkToken,
  checkApplicant,
  getReports,
  getReport,
  findDocument,
  getCheck,
  getDocuments,
  getAutofill,
} = require("./onfido.js");

const { getDocument, getImage } = require("./files.js");

const cors = require("cors");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/CreateApplicant", async (req, res) => {
  const payload = req.body;
  console.log(`Create applicant ${JSON.stringify(payload)}`);
  const id = await createApplicant(payload.name, payload.firstSurname);
  const token = await getSdkToken(id);
  res.send({ applicant: { applicantId: id }, sdkToken: token });
});

app.put("/UpdateEvent", async (req, res) => {
  const payload = req.body;
  console.log(`Log event ${payload.eventName}`);
  res.send({});
});

app.post("/CreateCheck", async (req, res) => {
  const payload = req.body;
  console.log(`Create check ${JSON.stringify(payload)}`);
  const checks = await checkApplicant(payload.applicantId, payload.reportNames);
  console.log(`Response check ${JSON.stringify(checks)}`);
  res.send({
    id: payload.applicantId,
    checks: [
      {
        checkId: checks.id,
      },
    ],
    reportIds: checks.reportIds,
  });
});

app.get("/Check/:id", async (req, res) => {
  console.log(`Get check ${req.params.id}`);
  const check = await getCheck(req.params.id);
  console.log(`Response check ${JSON.stringify(check)}`);
  let status = 0;
  switch (check.status) {
    case "in_progress":
      status = 0;
      break;
    case "awaiting_applicant":
      status = 1;
      break;
    case "complete":
      status = 2;
      break;
    case "withdrawn":
      status = 3;
      break;
    case "paused":
      status = 4;
      break;
    case "reopened":
      status = 5;
      break;
  }

  res.send({
    checks: [
      {
        checkId: check.id,
        status: status,
      },
    ],
  });
});

app.get("/Reports/:checkId", async (req, res) => {
  const reports = await getReports(req.params.checkId);
  console.log(`Response reports ${JSON.stringify(reports)}`);
  reports.map((report) => {
    let result = 0;
    switch (report.result) {
      case "clear":
        result = 0;
        break;
      case "consider":
        result = 1;
        break;
      case "unidentified":
        result = 2;
        break;
    }
    report.result = result;
  });

  res.send({ reports: reports });
});

app.get("/Report/:reportId", async (req, res) => {
  const report = await getReport(req.params.reportId);
  res.send(report);
});

app.get("/Documents/:applicantId", async (req, res) => {
  const document = await getDocuments(req.params.applicantId);
  res.send(document);
});

app.get("/Document/:documentId", async (req, res) => {
  const document = await findDocument(req.params.documentId);
  res.send(document);
});

app.get("/Autofill/:documentId", async (req, res) => {
  console.log(`Autofill ${req.params.documentId}`);
  const document = await getAutofill(req.params.documentId);
  res.send(document);
});

app.get("/fakePDF", async (req, res) => {
  console.log(`fakePDF`);
  const document = getDocument();
  res.send(document);
});

app.get("/fakeImage", async (req, res) => {
  console.log(`fakeImage`);
  const image = getImage();
  res.send(image);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Export the Express API
module.exports = app;
