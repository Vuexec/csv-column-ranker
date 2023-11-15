const fs = require('fs'); // Import the File System module
const csv = require('csv-parser'); // Import the csv-parser package
const path = require('path'); // Import the path module for handling file paths

const columnName = 'name/first'; // Column name to analyse

// Function to find CSV files in a directory
function findCSVFiles(dir) {
  try {
    // Read all files in the directory
    const files = fs.readdirSync(dir);
    // Filter and return only files with a .csv extension
    return files.filter(file => path.extname(file).toLowerCase() === '.csv');
  } catch (err) {
    // Handle and log any error that occurs while reading the directory
    console.error(`Error reading directory: ${err.message}`);
    return [];
  }
}

// Find CSV files in the specified directory
const csvFiles = findCSVFiles('CSV_LIST_HERE/');

if (csvFiles.length > 1) {
  // Output an error message if more than one CSV file is found
  console.error('Please ensure there is only one CSV file in the directory.');
} else if (csvFiles.length === 0) {
  // Output an error message if no CSV files are found
  console.error('No CSV files found in the directory.');
} else {
  // Construct the full file path for the found CSV file
  const filePath = path.join('CSV_LIST_HERE/', csvFiles[0]);

  // Check if the path exists and is a file
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const counts = {}; // Object to store the frequency of each value
    let totalCount = 0; // Counter for the total number of values processed

    fs.createReadStream(filePath)
      .pipe(csv()) // Pipe the stream through csv-parser
      .on('data', (row) => { // For each row in the CSV file
        if (row[columnName]) { // If the specified column has a value
          counts[row[columnName]] = (counts[row[columnName]] || 0) + 1; // Update the count
          totalCount++; // Increment the total count
        }
      })
      .on('error', (err) => { // In case of an error (e.g., invalid CSV content)
        // Log the error message for invalid CSV content
        console.error('Invalid CSV content: ' + err.message);
      })
      .on('end', () => { // Once the file is fully read
        // Sort the counts
        const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        let rank = 1; // Initialise rank for the most common value
        sortedCounts.forEach(([value, count]) => { // For each value and count
          // Output the rank, value, and count
          console.log(`${rank}. ${value}: ${count}`);
          rank++; // Increment the rank for the next value
        });
        // Output the total count
        console.log(`Total count: ${totalCount}`);
      });
  } else {
    console.error('The specified path does not point to a file.');
  }
}