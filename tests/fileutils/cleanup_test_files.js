import fs from 'fs/promises';
import path from 'path';

async function cleanupTestFiles() {
  const testFilesDir = 'test_files';
  const nestedDir = path.join(testFilesDir, 'nested');
  const filesToDelete = [
    path.join(testFilesDir, 'test_exists.txt'),
    'test_ensure_new.json',
    'test_ensure_exists.json',
    path.join(nestedDir, 'test_ensure_nested.json'),
    'test_write.json',
    path.join(testFilesDir, 'test_read_valid.json'),
    path.join(testFilesDir, 'test_read_invalid.json'),
  ];

  try {
    console.log('--- Cleaning up test files ---');

    // Delete files
    for (const filePath of filesToDelete) {
      try {
        await fs.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`File not found, skipping deletion: ${filePath}`);
        } else {
          console.error(`Error deleting file ${filePath}:`, error);
        }
      }
    }

    // Delete nested directory
    try {
      await fs.rm(nestedDir, { recursive: true, force: true });
      console.log(`Deleted directory: ${nestedDir}`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`Directory not found, skipping deletion: ${nestedDir}`);
      } else {
        console.error(`Error deleting directory ${nestedDir}:`, error);
      }
    }

    // Delete main test files directory
    try {
      await fs.rm(testFilesDir, { recursive: true, force: true });
      console.log(`Deleted directory: ${testFilesDir}`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`Directory not found, skipping deletion: ${testFilesDir}`);
      } else {
        console.error(`Error deleting directory ${testFilesDir}:`, error);
      }
    }

    console.log('--- Cleanup complete ---');

  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

export default cleanupTestFiles;