import fs from 'fs/promises';
import path from 'path';

async function generateTestFiles() {
  const testFilesDir = 'test_files'; // We might still want to create this directory
  const nestedDir = path.join(testFilesDir, 'nested');

  const filesToCreate = [
    { filePath: 'test_exists.txt', content: 'This file exists.' },
    { filePath: 'test_not_exists.txt', content: null }, // This file should not be created
    { filePath: 'test_ensure_new.json', content: JSON.stringify({ message: 'Default data' }, null, 2) },
    { filePath: 'test_ensure_exists.json', content: JSON.stringify({ existing: true }, null, 2) },
    { filePath: 'test_ensure_nested.json', content: JSON.stringify({ nested: true }, null, 2) },
    { filePath: 'test_write.json', content: JSON.stringify({ dataToWrite: 'test' }, null, 2) },
    { filePath: 'test_read_valid.json', content: JSON.stringify({ key: 'value' }, null, 2) },
    { filePath: 'test_read_invalid.json', content: 'not a json' },
  ];

  try {
    // Create the main test files directory if it doesn't exist (for test_exists.txt)
    await fs.mkdir(testFilesDir, { recursive: true });
    await fs.writeFile(path.join(testFilesDir, 'test_exists.txt'), 'This file exists.', 'utf8');
    console.log(`File created: ${path.join(testFilesDir, 'test_exists.txt')}`);


    // Create the nested directory if it doesn't exist (for test_ensure_nested.json)
    await fs.mkdir('nested', { recursive: true });
    await fs.writeFile('nested/test_ensure_nested.json', JSON.stringify({ nested: true }, null, 2), 'utf8');
    console.log(`File created: nested/test_ensure_nested.json`);


    for (const fileInfo of filesToCreate) {
      if (fileInfo.filePath.includes('test_exists.txt') || fileInfo.filePath.includes('test_ensure_nested.json') || fileInfo.content === null) {
        continue; // Skip these as they are handled above or shouldn't be created
      }
      await fs.writeFile(fileInfo.filePath, fileInfo.content, 'utf8');
      console.log(`File created: ${fileInfo.filePath}`);
    }

    console.log('All necessary files have been generated.');

  } catch (error) {
    console.error('Error generating files:', error);
  }
}

export default generateTestFiles;