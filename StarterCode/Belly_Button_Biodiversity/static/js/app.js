function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
    var metadata_URL = '/metadata/' + sample;
    // Use `d3.json` to fetch the metadata for a sample
            Plotly.d3.json((metadata_URL), function(error, response) {
                  // Use d3 to select the panel with id of `#sample-metadata`
                   var metadataVal = d3.select('#sample-metadata');

                   // Use `.html("") to clear any existing metadata
                    metadataVal.html("");

                    // Use `Object.entries` to add each key and value pair to the panel
                    Object.entries(response).forEach(([key, value]) => {
                     // Hint: Inside the loop, you will need to use d3 to append new
                     // tags for each key-value in the metadata.

                     d3.select('#sample-metadata')
                          .append('p')
                          .text(key + ":" + value);
              });
          });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

    var samples_url = '/samples/' + sample;
   // @TODO: Use `d3.json` to fetch the sample data for the plots

     // @TODO: Build a Bubble Chart using the sample data
        var samples_url = '/samples/';
        Plotly.d3.json((samples_url + sample), function(error, response) {
            var trace = {
                x: response['otu_ids'],
                y: response['sample_values'],
                mode: 'markers',
                marker: { 
                          size: response['sample_values'],
                          color:response['otu_ids']
                          },
  
                text:response['otu_labels']
            }
            var bubbleData = [trace];
            var layout = {
              xaxis: {
                title: 'OUT ID',
                titlefont: {
                  family: 'Courier New, monospace',
                  size: 18,
                  color: '#7f7f7f'
                }
              },
              yaxis: {
                title: 'Sample Values',
                titlefont: {
                  family: 'Courier New, monospace',
                  size: 18,
                  color: '#7f7f7f'
                }
              }
            };

            Plotly.newPlot('bubble', bubbleData, layout)
        });



     // @TODO: Build a Pie Chart
     // HINT: You will need to use slice() to grab the top 10 sample_values,
     // otu_ids, and labels (10 each).
        Plotly.d3.json((samples_url + sample), function(error, response) {
            var trace = {
                values: response['sample_values'].slice(0,10),
                labels: response['otu_ids'].slice(0,10),
                hovertext: response['otu_labels'].slice(0,10),
                type: 'pie'
            }
            var layout = {
                width: 500,
                height: 500
            }
            var piedata = [trace]
            Plotly.newPlot('pie', piedata, layout)
        });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    console.log(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
