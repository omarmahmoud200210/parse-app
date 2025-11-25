import levels from "../data/levels.js";
import status from "../data/status.js";
import dicipline from "../data/discipline.js";
import types from "../data/type.js";
import buidlings from "../data/zones.js";

const workingPackages = {
  PRW: "Program Wide",
  PA: "Parcel A",
  PB: "Parcel B",
};

const organizations = {
  MAF: "Majid Al Futtaim Properties ",
  ARC: "ARCHIMID",
  ACE: "Moharram Bakhoum",
  SCG: "Shaker Consultancy group",
  MYA: "MY&A",
};

let parsed = {};

const handleParsing = (files) => {
  files.forEach((file) => {
    const parse = file.name.split("-");

    const documentNo = file.name;
    const revision = Number(parse[parse.length - 1].split(".").shift());
    const title = levels[parse[5]] + "plan";
    const typeDWG = types[parse[7]];
    const statusDWG = status[parse[9]];
    const diciplineDWG = dicipline[parse[6]];
    const projectStage = "Gateway 6 - Detailed Design"; // Will check aconex for that..
    const project = "MOEg Business Park";
    const workingPackage = workingPackages[parse[3]];
    const zone = buidlings[parse[4].split(".").join("")];
    const level = levels[parse[5]];
    const createdBy = organizations[parse[2]];
    const extenstion = file.type;

    const parsedData = {
      documentNo,
      revision,
      title,
      typeDWG,
      statusDWG,
      diciplineDWG,
      projectStage,
      project,
      workingPackage,
      zone,
      level,
      createdBy,
      extenstion,
      dateCreated: new Date().toLocaleDateString(),
    };

    parsed[file.name] = parsedData;
  });

  return parsed;
};

export { handleParsing, parsed };

// ['EGY003','007', 'ARC', 'PA', 'B3.10', 'GFL', 'AR', 'DWG', '15000',  'TD', '00.pdf']
