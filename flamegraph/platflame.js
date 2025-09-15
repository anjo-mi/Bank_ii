import fs from "fs";
import { execSync } from "child_process";

const pbFiles = fs.readdirSync(".").filter((file) => file.endsWith(".pb"));

pbFiles.forEach((pbFile) => {
  const htmlFile = pbFile.replace(".pb", ".html");
  execSync(
    `node "C:\\Projects\\btwoo\\node_modules\\@platformatic\\flame\\bin\\flame.js" generate -o ${htmlFile} ${pbFile}`
  );
});

pbFiles.forEach((pbFile) => {
  fs.unlinkSync(pbFile);
});
