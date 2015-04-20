
visAngular
  .directive('forceGraph', ['d3Service', function(d3Service) {
    return {
      restrict: 'EA',
      scope: {}, 
      link: function(scope, element, attrs) {
        console.log("forceGraph", scope, element, attrs);
        d3Service.d3().then(function(d3) {

          // Collect variables from HTML attributes
          var margin = parseInt(attrs.margin) || 20,
          barWidth = parseInt(attrs.barWidth) || 20,
          barPadding = parseInt(attrs.barPadding) || 5, 
          valueProperty = attrs.valueProperty, 
          fillColor = attrs.fillColor, 
          dataset = eval(attrs.dataset) || [];


          var color = d3.scale.category20();


          var svg = d3.select(element[0]).append("svg")
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

            // setup variables
            var canvasWidth = d3.select(element[0]).node().offsetWidth;
            var canvasHeight = d3.select(element[0]).node().offsetHeight;


            var force = d3.layout.force()
                .charge(-20)
                .linkDistance(20)
                .size([canvasWidth, canvasHeight]);

            var graph = dataset;
              force
                  .nodes(graph.nodes)
                  .links(graph.links)
                  .start();

              var link = svg.selectAll(".link")
                  .data(graph.links)
                .enter().append("line")
                  .attr("class", "link")
                  .style("stroke-width", function(d) { return 1; });

              var node = svg.selectAll(".node")
                  .data(graph.nodes)
                .enter().append("circle")
                  .attr("class", "node")
                  .attr("r", function(d){ 
                    return d.type == "artist" ? 2+Math.sqrt(d.model.releases.length)*1 : 2;
                   })
                  .style("fill", function(d) { 
                    return d.type == "artist" ? "#fc0" : fillColor;
                    //return fillColor; 
                    //return color(d.group); 
                  })
                  .on("mouseover", function(d){
                    log( "OVER: ", d.id, d);
                  })
                  .call(force.drag);

              node.append("title")
                  .text(function(d) { return d.name; });

              force.on("tick", function() {
                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
              });
            


          };
        });
      }};
  }]);