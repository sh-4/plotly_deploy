function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// deliverable 1 - hbar chart

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var sampleResult = filteredSamples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = sampleResult.otu_ids;
    var otuLabels = sampleResult.otu_labels;
    var sampleValues = sampleResult.sample_values;

    // 7. Create the yticks for the bar chart.
    var yticks = otuIDs.slice(0,10).reverse().map(id => `OTU ${id}`);
    var xSamples = sampleValues.slice(0,10).reverse();
    var hover = otuLabels.reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xSamples,
      y: yticks,
      text: hover,
      type: "bar",
      orientation: "h",
      marker: {
        color: "deepskyblue",
      }
    }];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      xaxis: { title: "# of Bacteria"},
      yaxis: { title: "ID #"},
      paper_bgcolor: "rgba(0,0,0,0)"
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});

    // deliverable 2 - bubble chart

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIDs,
        colorscale: 'Picnic'
      }
    }];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis: { title: "OTU ID#"},
      yaxis: { title: "# of Bacteria"},
      automargin: true,
      hovermode: "closest",
      paper_bgcolor: "rgba(0,0,0,0)"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    // will not shrink to fit mobile devices due to affecting visual readability of chart. however, upon mobile viewing, the user is able to scroll sideways to view all bubbles in better detail

    // deliverable 3 - gauge chart

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    console.log(metadata);

    // 2. Create a variable that holds the first sample in the metadata array.
    var filteredMetadata = metadata.filter(sampleObj => sampleObj.id == sample);
    var metadataResult = filteredMetadata[0];
    console.log(filteredMetadata);
    console.log(metadataResult);

    // 3. Create a variable that holds the washing frequency.
    var washFreq = metadataResult.wfreq;
    console.log(washFreq);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washFreq,
      title: { 
        text: "<b>Belly Button Wash Frequency</b><br>Scrubs Per Week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [0, 10], tickwidth: 2},
        steps: [
          { range: [0, 2], color: "dodgerblue" },
          { range: [2, 4], color: "lightskyblue" },
          { range: [4, 6], color: "mediumpurple" },
          { range: [6, 8], color: "plum" },
          { range: [8, 10], color: "hotpink" },
        ],
        bar: { color: "black" }
        }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      // width: 500, 
      // height: 400,
      margin: { l: 50, t: 150, r: 50,  b: 50 },
      paper_bgcolor: "rgba(0,0,0,0)"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout, {responsive: true});
  });
}
