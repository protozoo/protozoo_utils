/*
  A simple D3 bar chart as an Angular directive
 */
visAngular
  .directive('horizontalBars', ['d3Service', function(d3Service) {
    return {
      restrict: 'EA',
      scope: {}, 
      link: function(scope, element, attrs) {
        console.log("d3Service 2", scope, element, attrs);
        d3Service.d3().then(function(d3) {

          scope.onElementClick = function(element)
          {
            console.log( "element clicked: ", element );
            scope.elementClickHandler( element );
          }

          // Collect variables from HTML attributes
          var margin = parseInt(attrs.margin) || 20,
          barWidth = parseInt(attrs.barWidth) || 20,
          barPadding = parseInt(attrs.barPadding) || 5, 
          valueProperty = attrs.valueProperty, 
          fillColor = attrs.fillColor;

          // Store element click event handler
          scope.elementClickHandler = eval( attrs.elementClickHandler );

          // Attempt to get dataset from HTML attribute
          try
          {
            dataset = eval(attrs.dataset) || [];
          }catch(e){
            console.log( "no dataset at bars");
            return;

          }

          // Store dataset
          scope.dataset = dataset;

          // Create theSVG object
          var svg = d3.select(element[0])
            .append('svg')
            .style('width', '100%')        
            .style('height', '100%');      

          // Browser onresize event
          window.onresize = function() {
            scope.$apply();
          };          

          // Watch for resize event
          scope.$watch(function() {
            return angular.element(window)[0].innerWidth;
          }, function() {
            scope.render();
          });

          
          // *********    RENDER Function    ********
          // ========================================
          scope.render = function() {
            // remove all previous items before render
            svg.selectAll('*').remove();

            // If we don't pass any scope.dataset, return out of the element
            if (!scope.dataset)
            { 
              console.log( "·LINK NOT scope.dataset");
              return;
            }

            
            // setup variables
            var canvasWidth = d3.select(element[0]).node().offsetWidth;
            var canvasHeight = d3.select(element[0]).node().offsetHeight;

            var width = d3.select(element[0]).node().offsetWidth - margin*2,
                height = d3.select(element[0]).node().offsetHeight - margin*2,
                // our xScale
                xScale = d3.scale.linear()
                  .domain([0, d3.max(scope.dataset, function(d) {
                    return d[valueProperty];
                  })])
                  .range([0, height]);
            var color = d3.scale.linear()
              .domain( [0, d3.max(scope.dataset, function(d) {
                    return d[valueProperty];
                  })])
              .range( [ fillColor, fillColor ] );

            // set the height based on the calculations above
            svg.attr('height', canvasHeight);
            svg.attr('width', canvasWidth);
            
            barWidth = Math.max(2, (width-margin)/scope.dataset.length)

            //create the rectangles for the bar chart
            var barSprites = svg.selectAll('g')
              .data(scope.dataset)
              .enter()
              .append("g")
                .on("click", function(d){
                  scope.onElementClick(d)
                })



            var bars = barSprites.append('rect')
                .attr('height', 1)
                .attr('width', barWidth-barPadding)
                .attr('class', "horizontalBar")
                .attr('x',function(d,i) {
                  return margin + (i * (barWidth + barPadding));
                })
                .attr('y', height+margin)
                .attr('fill', function(d) { return color(d[valueProperty]); })
                // .on("mouseover", function(d), function(d){
                //   log( "OVER: ", d.id, d);
                // })
                
                .transition()
                  .duration(1000)
                  .attr('height', function(d) {
                    return xScale(d[valueProperty]);
                  })
                  .attr('y', function(d) {
                    return margin+height-xScale(d[valueProperty]);
                  })
                ;
            var labels = barSprites.append("text")
                .attr("class", "caption2")
                .attr('x',function(d,i) {
                  return margin + (i * (barWidth + barPadding));
                })
                .attr('y', canvasHeight-margin/2)
                .text(function(d){ 
                  // To-do: this should be parametrized
                   var year = d.id;
                   return year % 5 == 0 ? year : null;
                });

            var barSensibleAreas = barSprites.append('rect')
                .attr('height', height)
                .attr('fill', "rgba(0,0,0,0)" )
                .attr('width', barWidth-barPadding)
                .attr('x',function(d,i) {
                  return margin + (i * (barWidth + barPadding));
                })
                .attr('y', margin)
                .on("mouseover", function() { 
                  console.log( this.parentElement.children[0] );
                    d3.select(this.parentElement.children[0])
                      .transition()
                      .duration(100)
                      .attr("fill", "white");
                  })
                  .on("mouseout", function() { 
                    d3.select(this.parentElement.children[0])
                      .transition()
                      .duration(300)
                      .attr("fill", fillColor);
                  });

          }
        });
      }};
  }]);