//requiring path and fs modules
const path = require("path");
const fs = require("fs");

//joining path of directory
const cssDirectoryPath = path.join(__dirname, "build/static/css");
const jsDirectoryPath = path.join(__dirname, "build/static/js");

const getFileList = async (dir) => {
  const list = await new Promise((resolve, reject) => {
    const fileNames = [];
    //passsing directoryPath and callback function
    fs.readdir(dir, function (err, files) {
      //handling error
      if (err) {
        reject(err);
      }

      //listing all files using forEach
      files.forEach(function (file) {
        // Do whatever you want to do with the file
        fileNames.push(file);
      });

      resolve(fileNames);
    });
  });

  return list;
};

const openFile = async (fn) => {
  const fileName = path.join(__dirname, fn);
  const files = await new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf8", function (err, data) {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
  return files;
};

const writeFile = async (fn, data) => {
  const fileName = path.join(__dirname, fn);
  await new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, "utf8", function (err) {
      if (err) reject(err);
      resolve();
    });
  });
};

const fn = async () => {
  // Get all static file names
  const cssFiles = await getFileList(cssDirectoryPath);
  const jsFiles = await getFileList(jsDirectoryPath);
  const fileList = [
    ...cssFiles.map((f) => `"/static/css/${f}"`),
    ...jsFiles.map((f) => `"/static/js/${f}"`),
  ];

  const swData = await openFile("public/sw.js");

  // Replace version number for static and dynamic cache
  const staticVersion = swData.match(/static-v([0-9]+)/)[1];
  const dynamicVersion = swData.match(/static-v([0-9]+)/)[1];

  const ver = swData
    .replace(`static-v${staticVersion}`, `static-v${1 + +staticVersion}`)
    .replace(`dynamic-v${dynamicVersion}`, `dynamic-v${1 + +dynamicVersion}`);
  await writeFile("public/sw.js", ver);

  // Inject file names in sw.js file
  const plug = ver.replace(
    "// {{{Inject static folder files here}}}",
    fileList.join(",\n  ")
  );
  await writeFile("build/sw.js", plug);
};
fn();
