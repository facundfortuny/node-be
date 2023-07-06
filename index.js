import express from "express";
import {
  createApplicant,
  getSdkToken,
  checkApplicant,
  getReports,
  getReport,
  findDocument,
  getCheck,
  getDocuments,
  getAutofill,
} from "./onfido.js";
import cors from "cors";

const app = express();
const port = 3000;
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// export enum OnfidoCheckStatus {
// 	In_Progress = 0,
// 	Awaiting_Applicant = 1,
// 	Complete = 2,
// 	Withdrawn = 3,
// 	Paused = 4,
// 	Reopened = 5,
// }
// OnfidoReportResult {
// 	Clear = 0,
// 	Consider = 1,
// 	Unidentified = 2,
// }