var svg = d3.select('svg');
var months = ['january', 'febuary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
function formatDate(numberDate) {
  var date = new Date(numberDate);
  var formated = date.getFullYear() + ' - ' + months[date.getMonth()];
  return formated;
}
console.log(formatDate('1000-02-11'))
//x and y coordinate origin is from the top left
$.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(data) {
  var chartData = data.data;
  var margin = 49;
  var svgWidth = parseInt(svg.attr('width'));
  var svgHeight = parseInt(svg.attr('height'));
  var barWidth = svgWidth / chartData.length;
  var xScale = d3.scaleTime()
    .domain([d3.min(chartData, function(d) {
      return new Date(d[0]);
    }), d3.max(chartData, function(d) {
      return new Date(d[0]);
    })])
    .range([margin, svgWidth]);

  var yScale = d3.scaleLinear()
    .domain([d3.min(chartData, function(d) {
      return d[1];
    }), d3.max(chartData, function(d) {
      return d[1];
    })])
    .range([svgHeight, margin]);

  // Create bars

  svg.selectAll('g').data(chartData).enter().append('g')
    .each(function(d, i) {
      d3.select(this).append('rect')
        .attr('class', function() {
          return 'data-point' + i + ' bar'
        })
        .attr('fill', 'lightblue')
        .attr('width', barWidth)
        .attr('height', function() {
        // Compensate for decreased y coordinate
        var space = 10;
          return (svgHeight - yScale(d[1])) + space;
        })
        .attr('x', function() {
          return xScale(new Date(d[0]));
        })
        .attr('y', function() {
        //make y coordinate slightly lower to make bars longer
        var space = 10;
          return yScale(d[1]) - margin-space;
        });
    });

  // Add grey background to tool tips

  svg.selectAll('div').data(chartData).enter().append('rect')
    .attr('class', function(d, i) {
      return 'data-point' + i + ' tool-tip-background'
    })
    .attr('fill', 'grey')
    .attr('height', 50)
    .attr('width', 120)
    .attr('x', function(d) {
    //lower x position to give space between left edge of box and text
      var space = 10
      return xScale(new Date(d[0]))-space;
    })
    .attr('y', function(d) {
    // Lower y coordinate
    var space = 40;
      return yScale(d[1]) - margin - space;
    });

  // Show billions of dollars
  svg.selectAll('div').data(chartData).enter().append('text')
    .attr('class', function(d, i) {
      return 'bar-info data-point' + i
    })
    .text(function(d) {
      return d[1] + ' Billion'
    })
     .attr('x', function(d) {
      return xScale(new Date(d[0]));
    })
    .attr('y', function(d) {
      return yScale(d[1]) - margin;
    });
  //Show year and month
  // Can't use svg.selectAll('text') because there's already data-binded text elements present
  svg.selectAll('div').data(chartData).enter().append('text')
    .attr('class', function(d, i) {
      return 'bar-info data-point' + i
    })
    .text(function(d) {
      return formatDate(d[0]);
    })
    .attr('x', function(d) {
      return xScale(new Date(d[0]));
    })
    .attr('y', function(d) {
      //subtract 20 to place under previous text element
    var space = 20;
      return yScale(d[1]) - margin - space;
    });

  var xAxisScale = d3.scaleTime()
    .domain([d3.min(chartData, function(d) {
      return new Date(d[0]);
    }), d3.max(chartData, function(d) {
      return new Date(d[0]);
    })])
    .range([margin, svgWidth]);

  var yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(chartData, function(d) {
      return d[1];
    })])
    .range([svgHeight - margin, 0]);
  var xAxis = d3.axisBottom(xAxisScale);
  var yAxis = d3.axisLeft(yAxisScale);
  //Create an SVG group Element for the Axis elements and call the xAxis function
  var xAxisGroup = svg.append("g")
    .attr("transform", "translate(0," + (svgHeight - margin) + ")")
    .call(xAxis);
  var yAxisGroup = svg.append('g')
    .attr("transform", "translate(" + (margin) + ",0)")
    .call(yAxis);

  $('.bar-info').hide();
  $('.tool-tip-background').hide();
  $('rect.bar').on('mouseover', function() {
    //get first class only
    var number = '.' + $(this).attr('class').split(' ')[0];
    $('.tool-tip-background' + number).show();
    $('text' + number).show();

  }).on('mouseleave', function() {
    var number = '.' + $(this).attr('class').split(' ')[0];
    $('.tool-tip-background' + number).hide();
    $('text' + number).hide();
  });
});
