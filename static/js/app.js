// read json and create dropdown menu
d3.json('../data/samples.json').then(data=>{
	console.log(data);
	
	var names = Object.values(data.names);
	var dropDownlist = document.getElementById('selDataset');
	for (i=0; i<names.length; i++) {
		dropDownlist.options[i] = new Option(names[i])
	};
});

// initialize dashboard
function engage() {
	buildPlot('940');
};
engage();

// connect dropdown to plot builder
function optionChanged() {
	dropDownMenu=d3.select('#selDataset');
	id=dropDownMenu.property('value');
	console.log(id);
	buildPlot(id);

};
optionChanged();

// etl json into dashboard
function buildPlot(id) {
	var jsonPath = `../data/samples.json`;
	d3.json(jsonPath).then(data=>{
		console.log(data);
		// assign variables
		var sampleSet = data['samples'];
		var metaData = data['metadata'];
		// filter metadata
		var chosenMeta = metaData.filter(record=>record.id==id);
		console.log(chosenMeta);
		// etl metadata
		var moreMeta = Object.entries(chosenMeta[0]);
		console.log(moreMeta);
		// format metadata
		var cleanMeta = moreMeta.map(entry=>entry.join(': '));
		// reset list
		d3.select('#sample-metadata>ul').remove();
		// use d3 to build ul tag
		var metaList = d3.select('#sample-metadata').append('ul');
		// append to ul
		cleanMeta.forEach(item=> {
			var itemText=metaList.append('li');
			itemText.text(`${item}`);
		});
		// filter dataset on chosen id in dropdown
		var chosenData = sampleSet.filter(record=>record.id==id);
		console.log(chosenData);
		// extract plot arrays
		var sampleValues = chosenData[0]['sample_values'];
		var otuLabels = chosenData[0]['otu_labels'];
		var otuIds = chosenData[0]['otu_ids'];
		// clean otus
		var cleanOtuIds = [];
		Object.values(otuIds).forEach((id)=> {
			var items=(`OTU:${id}`);
			cleanOtuIds.push(items);
		});
		console.log(cleanOtuIds);
		// horizontal bar chart
		var trace1 = {
			y: cleanOtuIds.slice(0,10).reverse(),
			x: sampleValues.slice(0,10).reverse(),
			type: 'bar',
			hovertext: otuLabels.slice(0,10).reverse(),
			orientation: 'h',
		};
		var data = [trace1];
		var layout = {
			title: 'Top Ten OTU IDs by Sample Value',
			axis: {
				tickabgle: -45
			}
		};
		Plotly.newPlot('bar', data, layout);
		// bubble chart
		var trace1 = {
			x: otuIds,
			y: sampleValues,
			text: otuLabels,
			mode: 'markers',
			marker: {
				color: otuIds,
				colorscale: 'Viridis',
				size: sampleValues
			}
		};
		var data = [trace1]
		var layout = {
			title: 'Belly Button Bubble Chart',
			showlegend: false,
			xaxis: {
				title: 'OTU IDs',
			},
			yaxis: {
				title: 'Sample Values'
			}
		};
		Plotly.newPlot('bubble', data, layout);
		// gauge chart
		var data = [{
			type: 'indicator',
			mode: 'gauge+number',
			value: chosenMeta[0]['wfreq'],
			title: {text: 'Belly Button Wash Frequency (d/wk)'},
			gauge: {
				axis: {
					range: [null,9], tickmode: 'linear', tickwidth:1, tickcolor: 'black'
				},
				bar: {color:'#34495e'},
				borderwidth: 2, 
				bordercolor: 'black',
				steps: [
					{range:[0,1], color: '#e74c3c'},
					{range:[1,2], color: '#d35400'},
					{range:[2,3], color: '#e67e22'},
					{range:[3,4], color: '#f39c12'},
					{range:[4,5], color: '#f1c40f'},
					{range:[5,6], color: '#27ae60'},
					{range:[6,7], color: '#2ecc71'},
					{range:[7,8], color: '#3498db'},
					{range:[8,9], color: '#9b59b6'},
				],
			}
		}];
		var layout = {
			width: 500,
			height: 400,
			margin: {t:25, r:25, l:25, b:25}
		};
		Plotly.newPlot('gauge', data, layout);
	});
};
