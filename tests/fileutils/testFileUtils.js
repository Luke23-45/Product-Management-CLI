// testFileUtils.js

import { fileExists, ensureFile, readJSONFile, writeJSONFile } from './../../utils/fileUtils.js';
import fs from 'fs/promises';
import path from 'path';
import * as originalConsole from 'console'; // Import original console
import generateTestFiles from './generate_test_files.js'; // Assuming generate_test_files.js is in the same directory
import cleanupTestFiles from './cleanup_test_files.js';   // Assuming cleanup_test_files.js is in the same directory

async function runTests() {
  const testFileExists_existing = './test_files/test_exists.txt';
  const testFileExists_nonExisting = 'test_not_exists.txt';
  const testEnsureFile_new = 'test_ensure_new.json';
  const testEnsureFile_existing = 'test_ensure_exists.json';
  const testEnsureFile_nested = 'nested/test_ensure_nested.json';
  const testWriteJSON_file = 'test_write.json';
  const testReadJSON_valid = 'test_read_valid.json';
  const testReadJSON_invalid = 'test_read_invalid.json';
  const defaultData = { message: 'Default data' };
  const validJSONData = { key: 'value' };
  const invalidJSONData = 'not a json';
  const outputFilePath = 'test_results.txt';
  let outputStream;

  // Redirect console output to file
  try {
    outputStream = await fs.open(outputFilePath, 'w');
    const writer = outputStream.createWriteStream();
    global.console = new originalConsole.Console(writer, writer);
  } catch (error) {
    console.error('Error opening output file:', error);
    return;
  }

  // Generate test files
  console.log('--- Generating Test Files ---');
  await generateTestFiles();
  console.log('--- Test Files Generated ---');

  console.log('\n--- Testing fileExists ---');
  console.log(`'${testFileExists_existing}' exists:`, await fileExists(testFileExists_existing));
  console.log(`'${testFileExists_nonExisting}' exists:`, await fileExists(testFileExists_nonExisting));

  console.log('\n--- Testing ensureFile ---');
  await ensureFile(testEnsureFile_new, defaultData);
  console.log(`'${testEnsureFile_new}' created:`, await fileExists(testEnsureFile_new));
  const newFileData = await readJSONFile(testEnsureFile_new).catch(() => null);
  console.log(`Content of '${testEnsureFile_new}':`, newFileData);

  await ensureFile(testEnsureFile_existing, { shouldNotBeWritten: true });
  const existingFileData = await readJSONFile(testEnsureFile_existing).catch(() => null);
  console.log(`'${testEnsureFile_existing}' content (should not change):`, existingFileData);

  await ensureFile(testEnsureFile_nested, { nested: true });
  console.log(`'${testEnsureFile_nested}' created:`, await fileExists(testEnsureFile_nested));
  console.log(`Nested directory exists:`, await fs.stat(path.dirname(testEnsureFile_nested)).then(() => true).catch(() => false));
  const nestedFileData = await readJSONFile(testEnsureFile_nested).catch(() => null);
  console.log(`Content of '${testEnsureFile_nested}':`, nestedFileData);

  console.log('\n--- Testing writeJSONFile ---');
  const writeResult = await writeJSONFile(testWriteJSON_file, { dataToWrite: 'test' });
  console.log(`Writing to '${testWriteJSON_file}' successful:`, writeResult === undefined); // writeJSONFile resolves with undefined
  const writtenData = await readJSONFile(testWriteJSON_file).catch(() => null);
  console.log(`Content of '${testWriteJSON_file}':`, writtenData);

  console.log('\n--- Testing readJSONFile ---');
  const validReadResult = await readJSONFile(testReadJSON_valid);
  console.log(`Reading valid JSON from '${testReadJSON_valid}':`, validReadResult);

  try {
    await readJSONFile(testReadJSON_invalid);
    console.log(`Reading invalid JSON should have failed.`);
  } catch (error) {
    console.log(`Reading invalid JSON from '${testReadJSON_invalid}' failed:`, error.message);
  }

  const nonExistingReadResult = await readJSONFile('non_existent.json').catch(error => error.message);
  console.log(`Reading non-existent file:`, nonExistingReadResult);

  // Cleanup
  try {
    console.log('\n--- Cleaning Up Test Files ---');
    await cleanupTestFiles();
    console.log('--- Test Files Cleanup Done ---');
  } catch (cleanupError) {
    console.error('Cleanup Error:', cleanupError);
  } finally {
    await outputStream?.close();
  }
}

runTests();