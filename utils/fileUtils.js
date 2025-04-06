// utils/fileUtils.js

import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';

export async function fileExists(filePath) {
  try {
    await fsp.stat(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}


export async function ensureFile(filePath, flg) {
  if (!(await fileExists(filePath))) {
    try {
      // Ensure the directory exists.
      let default_data = [];
      if(flg == 'c' || flg =='o'){
        default_data =[{}]
      }
      await fsp.mkdir(path.dirname(filePath), { recursive: true });
      // Write the default data without calling ensureFile again.
      await writeJSONFile(filePath,default_data);
      console.info(`File ${filePath} created with default data.`);
    } catch (error) {
      console.error(`Error ensuring file ${filePath}:`, error);
      throw error;
    }
  }
}

// check for file existence.
export const writeJSONFile = async (filePath, data, ensure = true) => {
  // Optionally ensure the file exists (if ensure is true).
  if (ensure) {
    // Only ensure the directory exists.
    await fsp.mkdir(path.dirname(filePath), { recursive: true });
  }
  return new Promise((resolve, reject) => {
    const jsonData = JSON.stringify(data, null, 2);
    const buffer = Buffer.from(jsonData, 'utf8');
    const stream = fs.createWriteStream(filePath);
    let errorOccurred = false;

    stream.write(buffer);
    stream.end();

    stream.on('finish', () => {
      if (!errorOccurred) {
        resolve();
      }
    });

    stream.on('error', (err) => {
      errorOccurred = true;
      reject(new Error(`Error writing JSON file: ${filePath} - ${err.message}`));
    });
  });
};

export const readJSONFile = async (filePath, flg) => {
  // Ensure the file exists; if not, it will be created with defaultData.
  await ensureFile(filePath, flg);
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath, 'utf8');
    let data = '';
    let errorOccurred = false;

    stream.on('data', chunk => {
      data += chunk;
    });
    stream.on('end', () => {
      if (errorOccurred) return;
      try {
        if(flg == 'c' || flg == 'o'){
          if(!data){
            data = JSON.stringify([{}])
          }
        }
        if(flg == 'u' || flg == 'p'){
          if(!data){
            data = JSON.stringify([])
          }
        }
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseError) {
        reject(new Error(`Error parsing JSON file: ${filePath} - ${parseError.message}`));
      }
    });

    stream.on('error', (err) => {
      errorOccurred = true;
      reject(new Error(`Error reading file: ${filePath} - ${err.message}`));
    });
  });
};
