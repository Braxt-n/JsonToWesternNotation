/**
 * Converts HarmonyHub JSON into a string format VexFlow's EasyScore can read.
 * Example input: [{ note: "C5", duration: 4 }, ...]
 * Example output: "C5/q, D5/q, E5/q"
 * Note this returns an array of strings, all 16 units in duration 
 */


export const convertJsonToVexString = (jsonData, timeSignature = "4/4") => {
  const map = new Map([[16, 'w'], [12, 'h.'], [8, 'h'], [6, 'q.'],[4, 'q'], [3, '8.'], [2, '8'], [1, '16']]);

  const [numerator, denominator] = timeSignature.split('/').map(Number);
  const unitsPerMeasure = numerator * (16/denominator);

  const measures = [];
  let currentMeasureNotes = [];
  let unitsInCurrentMeasure = 0;

  jsonData.forEach((item) => {
    let duration = item.duration;

    // Check if the note exceeds the unit boundary 
    if (unitsInCurrentMeasure + duration > unitsPerMeasure) {
      const fillDuration = unitsPerMeasure - unitsInCurrentMeasure;
      const overflowDuration = (unitsInCurrentMeasure + duration) - unitsPerMeasure;

      // Part A: Fill the current measure
      currentMeasureNotes.push(`${item.note}/${map.get(fillDuration)}`);
      measures.push(currentMeasureNotes.join(', '));

      // Part B: Start the new measure
      currentMeasureNotes = [`${item.note}/${map.get(overflowDuration)}`];
      unitsInCurrentMeasure = overflowDuration;
    } else {
      currentMeasureNotes.push(`${item.note}/${map.get(duration)}`);

            console.log("Duration was:")
            console.log(duration)
            console.log("Vx Note is: ")
            console.log(map.get(duration))

      unitsInCurrentMeasure += duration;
      
      if (unitsInCurrentMeasure === unitsPerMeasure) {

        console.log("Current Full Measure: ")
        console.log(currentMeasureNotes.join(', '))
        measures.push(currentMeasureNotes.join(', '));
        currentMeasureNotes = [];
        unitsInCurrentMeasure = 0;
        
      }
    }
  });

  return measures;
};