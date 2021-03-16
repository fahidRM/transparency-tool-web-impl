angular.module('app.debugger')
    .controller('DebuggerCtrl',
        ['$scope',
            function ($scope) {
                // todo: pass API..... later on....


                var margin = {top: 20, right: 120, bottom: 20, left: 120},
                    width = 900000000 - margin.right - margin.left,
                    height = 500 - margin.top - margin.bottom;

                var vm = this;
                vm.belief_dumps = [];
                vm.states = [
                    {
                        "name": "Agent X",
                        "parent": "null",
                        "children": [
                            {
                                "name": "Move",
                                "parent": "Agent X",
                                "children": []
                            }
                        ]
                    }
                ];

                vm.currentNode = vm.states[0];
                vm.tree;
                vm.svg;
                vm.i = 0;
                vm.duration = 750;
                vm.diagonal;

                vm.root;

                vm.setSession = function () {

                };




                function appendNode (node) {

                }

                function appendBranch (branch) {

                }

                function swapNodes (branch, indexA, indexB) {

                    var holder = indexA;
                    branch[indexA] =  branch[indexB];
                    branch[indexB] = holder;

                }

                function selectNode (node) {

                }

                function snapToLatestNode () {

                }






















                vm.addNode = function () {

                    var newNode = {
                        "name": "Added node ",
                        "parent": vm.currentNode.name,
                        "children": []
                    }

                    vm.currentNode["children"] =[newNode];
                    vm.currentNode = newNode;

                    update(vm.states[0]);
                }

                vm.addBranch = function() {

                    update(vm.states[0]);
                    var newNodes = [{
                        "name": "1",
                        "parent": vm.currentNode.name,
                        "children": []
                    }, {
                        "name": "2",
                        "parent": vm.currentNode.name,
                        "children": []
                    }]
                    vm.currentNode["children"] =newNodes;
                    vm.currentNode = newNodes[0];

                    update(vm.states[0]);


                }


                function swapNodes (nodeCollection, indexA, indexB) {

                }




                vm.init =  function () {





                    vm.tree = d3.layout.tree()
                        .size([height, width]);

                    vm.diagonal = d3.svg.diagonal()
                        .projection(function(d) { return [d.y, d.x]; });

                    vm.svg = d3.select("#visualisation_board").append("svg")
                        .attr("width", width + margin.right + margin.left)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    vm.root = vm.states[0];
                    vm.root.x0 = height / 2;
                    vm.root.y0 = 0;

                    update(vm.root);

                    d3.select(self.frameElement).style("height", "500px");



                }

                function update(source) {

                    // Compute the new tree layout.
                    var tree = vm.tree;
                    var nodes = tree.nodes(vm.root).reverse(),
                        links = tree.links(nodes);

                    // Normalize for fixed-depth.
                    nodes.forEach(function(d) { d.y = d.depth * 180; });

                    // Update the nodes…
                    var node = vm.svg.selectAll("g.node")
                        .data(nodes, function(d) { return d.id || (d.id = ++vm.i); });

                    // Enter any new nodes at the parent's previous position.
                    var nodeEnter = node.enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                        .on("click", click);

                    /*nter.append("circle")
                        .attr("r", 1e-6)
                        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });*/

                    nodeEnter.append("text")
                        .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
                        .attr("dy", ".35em")
                        .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                        .text(function(d) { return d.name; })
                        .style("fill-opacity", 1e-6);

                    nodeEnter.insert('rect', 'text')
                        .attr("width", 100)
                        .attr("height", 100)
                        .style("fill-opacity", 0.4);

                    // Transition nodes to their new position.
                    var nodeUpdate = node.transition()
                        .duration(vm.duration)
                        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

                    nodeUpdate.select("circle")
                        .attr("r", 10)
                        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

                    nodeUpdate.select("text")
                        .style("fill-opacity", 1);

                    // Transition exiting nodes to the parent's new position.
                    var nodeExit = node.exit().transition()
                        .duration(vm.duration)
                        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                        .remove();

                    nodeExit.select("circle")
                        .attr("r", 1e-6);

                    nodeExit.select("text")
                        .style("fill-opacity", 1e-6);

                    // Update the links…
                    var link = vm.svg.selectAll("path.link")
                        .data(links, function(d) { return d.target.id; });

                    // Enter any new links at the parent's previous position.
                    link.enter().insert("path", "g")
                        .attr("class", "link")
                        .attr("d", function(d) {
                            var o = {x: source.x0, y: source.y0};
                            return vm.diagonal({source: o, target: o});
                        });

                    // Transition links to their new position.
                    link.transition()
                        .duration(vm.duration)
                        .attr("d", vm.diagonal);

                    // Transition exiting nodes to the parent's new position.
                    link.exit().transition()
                        .duration(vm.duration)
                        .attr("d", function(d) {
                            var o = {x: source.x, y: source.y};
                            return vm.diagonal({source: o, target: o});
                        })
                        .remove();

                    // Stash the old positions for transition.
                    nodes.forEach(function(d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });
                }

                function click(d) {
                    alert("clicked " +  d["name"]);
                }

            }
        ]
    )