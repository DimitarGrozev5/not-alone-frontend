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
        fileNames.push(`"/${file}",`);
      });

      resolve(fileNames);
    });
  });

  return list;
};

const openFile = async (fn) => {
  const fileName = path.join(__dirname, fn);
  return await new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf8", function (err, data) {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
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
  const fileList = [...cssFiles, ...jsFiles];

  // Inject file names in sw.js file
  const swData = await openFile("public/sw.js");
  const plug = swData.replace(
    "// {{{Inject static folder files here}}}",
    fileList.join("\n        ")
  );
  await writeFile("build/sw.js", plug);
};
fn();