document.getElementById('seatForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get inputs
  const numStudents = parseInt(document.getElementById('numStudents').value);
  const numColumns = parseInt(document.getElementById('numColumns').value);
  const previousSeatingInput = document.getElementById('previousSeating').value.trim();
  const numOptions = parseInt(document.getElementById('numOptions').value); // Number of seating options (k)

  // Validate previous seating
  let previousSeating;
  if (previousSeatingInput) {
      // Parse previous seating
      previousSeating = previousSeatingInput.split(',').map(Number);
      if (previousSeating.length !== numStudents || previousSeating.some(isNaN)) {
          alert("Invalid previous seating input. Ensure it's a comma-separated list of numbers matching the number of students.");
          return;
      }
  } else {
      // Generate a random seating if none is provided
      previousSeating = Array.from({ length: numStudents }, (_, i) => i + 1);
      previousSeating = shuffleArray(previousSeating);
  }

  // Generate k seating options
  const seatingOptionsDiv = document.getElementById('seatingOptions');
  seatingOptionsDiv.innerHTML = '';  // Clear previous seating options

  for (let i = 0; i < numOptions; i++) {
      // Generate new seating with weighting
      const newSeating = generateWeightedSeating(previousSeating, numStudents, numColumns);

      // Create a new section for each seating
      const seatingDiv = document.createElement('div');
      seatingDiv.className = 'seatingOption';
      seatingDiv.style.margin = '20px';
      seatingDiv.innerHTML = `<h3>Seating Option ${i + 1}</h3>`;

      const seatingGrid = document.createElement('div');
      seatingGrid.className = 'grid';
      seatingGrid.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;

      // Populate grid with new seating
      newSeating.forEach(id => {
          const seatDiv = document.createElement('div');
          seatDiv.className = 'seat';
          seatDiv.innerText = `Student ${id}`;
          seatingGrid.appendChild(seatDiv);
      });

      // Display the new seating array in a copyable format
      const seatingArrayText = newSeating.join(',');
      const seatingArrayDiv = document.createElement('textarea');
      seatingArrayDiv.value = seatingArrayText;
      seatingArrayDiv.rows = '3';
      seatingArrayDiv.cols = '40';
      seatingArrayDiv.readOnly = true;

      // Append grid and copyable text to the seating option
      seatingDiv.appendChild(seatingGrid);
      seatingDiv.appendChild(seatingArrayDiv);

      // Add the seating option to the main container
      seatingOptionsDiv.appendChild(seatingDiv);
  }
});

// Shuffle array function (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to generate weighted seating based on previous seating
function generateWeightedSeating(previousSeating, numStudents, numColumns) {
  const numRows = Math.ceil(numStudents / numColumns); // Total number of rows

  // Assign weights: the ith row will have weight i (higher row number, higher weight)
  const weights = previousSeating.map((studentId, index) => {
      const row = Math.floor(index / numColumns) + 1; // Calculate which row the student is in (1-based index)
      return row; // The row number becomes the weight (students in back rows get higher weights)
  });

  // Create a new array of student IDs and shuffle based on weights
  const newSeating = weightedShuffle(previousSeating, weights);

  return newSeating;
}


// Function to shuffle students based on their weights
function weightedShuffle(array, weights) {
  const weightedArray = [];

  // Add each element to the weighted array based on its weight
  array.forEach((item, index) => {
      for (let i = 0; i < weights[index]; i++) {
          weightedArray.push(item);
      }
  });

  // Shuffle the weighted array
  shuffleArray(weightedArray);

  // Extract unique students in the shuffled order
  const uniqueSeating = [...new Set(weightedArray)];

  // Return only the first 'array.length' items (to match the number of students)
  return uniqueSeating.slice(0, array.length);
}

