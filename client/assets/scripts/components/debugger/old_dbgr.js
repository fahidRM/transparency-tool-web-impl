angular.module('app.debugger')
    .controller('DebuggerCtrl',
        ['$scope', '$interval', 'APIService',
            function ($scope, $interval, API) {
                /**
                 * Articles referred to:
                 *
                 *  https://bl.ocks.org/d3noob/8375092          [Dendrogram-d3]
                 *  http://bl.ocks.org/anotherjavadude/2952964  [tooltip]
                 */

                let vm = this;

                const COLOURS = {
                    traversedNode: "#16a085",
                    traversableNode: "#1abc9c",
                    unTraversableNode: "#e74c3c"
                };

                const DEFAULTS = {
                    invisibleNode: { IDENTIFIER: "", IS_PADDING_NODE: true },
                    maxTries:  1,
                    rootNode: {IDENTIFIER: "[My Agent]"},
                    session: "default"

                }

                const STATE = {
                    action: "ACTION",
                    planSelection: "PLAN_SELECTION",
                    planTrace: "PLAN_TRACE",
                    sense: "SENSE"

                }

                vm.agents = {
                    all: [],
                    current: ""
                }

                vm.beliefBase = {
                    cache: {},
                    current: []
                }

                vm.isDebugging = false;

                vm.nodes = {
                    branch: null,
                    current: null,
                    last: null,
                    selected: null
                }

                let states = {};




                var currentSequence = 0,
                    diagonal,
                    div,
                    duration = 750,
                    margin = {top: 20, right: 10, bottom: 20, left: 10},
                    height = 370 - margin.top - margin.bottom,
                    i = 0,
                    poll,
                    root,
                    sessionTag = "",
                    svg,
                    tree,
                    tries = 0,
                    width =  10000000; //d3.select('#visualisation_board').style('width').slice(0, -2);




                function addNode (node) {
                    vm.nodes.branch = null;
                    vm.nodes.current["children"] = [node];
                    vm.nodes.last = vm.nodes.current;
                    vm.nodes.current = node;
                }

                function selectNode (node) {

                    let beliefBaseAtSequence = vm.beliefBase.cache[node.SEQUENCE_NUMBER];
                    let beliefBaseAtPreviousSequence = vm.beliefBase.cache[node.SEQUENCE_NUMBER - 1];

                    if (beliefBaseAtSequence === undefined){
                        vm.beliefBase.current = [];
                    }
                    else {
                        let beliefBaseChanges = [];
                        if (beliefBaseAtPreviousSequence !== undefined) {
                            beliefBaseAtPreviousSequence = _.remove(
                                beliefBaseAtPreviousSequence,
                                function(belief) {
                                    return belief.is_deleted === undefined;
                                });
                            if (beliefBaseAtPreviousSequence.length > 0) {
                                beliefBaseChanges = _.differenceBy(
                                    beliefBaseAtPreviousSequence,
                                    beliefBaseAtSequence,
                                    "value"
                                )
                            }
                        }
                        beliefBaseChanges.forEach(function (change) {
                            change["is_deleted"] = true;
                            beliefBaseAtSequence.push(change);
                        });
                        vm.beliefBase.current = beliefBaseAtSequence;
                    }

                    $scope.$apply();
                }

                function onActionReceived (state) {
                    state.TYPE_INFO["SEQUENCE_NUMBER"] = state.SEQUENCE_NUMBER;
                    addNode(state.TYPE_INFO);
                }

                function onPlanTraceReceived (state) {
                    if ((state.TYPE_INFO.length %2) === 0){
                        state.TYPE_INFO.unshift(DEFAULTS.invisibleNode);
                    }
                    addBranch(state);
                }
                function addBranch (branch) {
                    vm.nodes.branch = branch;
                    vm.nodes.current["children"] = branch;
                    vm.nodes.last = vm.nodes.current;
                    vm.nodes.current = branch[0];
                }



                function onPlanSelectionReceived (state) {
                    if (vm.nodes.branch === null) { return; }
                    let targetIndex = 0;
                    vm.nodes.branch.forEach(function(item, index) {
                        if (item.IDENTIFIER === state.TYPE_INFO.IDENTIFIER) {
                            targetIndex =  index;
                        }
                    });
                    swapBranchNodes(
                        vm.nodes.branch,
                        Math.floor(vm.currentBranch.length / 2),
                        targetIndex
                    )
                }

                function onSenseReceived (state) {
                    let currentState = [];
                    if (state.TYPE_INFO.ACTION && (state.TYPE_INFO.ACTION === "DUMP")) {
                        let valueStr = state.TYPE_INFO.VALUES || "";
                        let values = valueStr.split(";");
                        values.forEach(function (value) {
                            let valueParts =  (value + "|").split("|");
                            if (valueParts[0].trim().length > 0){
                                currentState.push({
                                    value: valueParts[0].trim(),
                                    source: valueParts[1].trim()
                                });
                            }
                        })
                    }
                    vm.beliefBase.cache[state.SEQUENCE_NUMBER] = currentState;
                    vm.beliefBase.current = currentState;
                }

                function onStateReceived (state, loggingDefault) {

                    if (loggingDefault === undefined) {
                        if (vm.agents.current === null) {
                            vm.agents.current = state.AGENT;
                            vm.agents.all.push(state.AGENT);
                        }

                        if (states[vm.agents.current] === undefined) {
                            states[vm.agents.current] = [];
                        }

                        if (state.AGENT !== vm.agents.current) {
                            vm.agents.all.push(state.AGENT);
                            vm.agents.all = _.uniq(vm.agents.all);
                            states[vm.agents.current].push(state);
                            return;
                        }
                    }
                    switch (state.TYPE){
                        case undefined:
                            return;
                        case STATE.action:
                            onActionReceived(state);
                            break;
                        case STATE.planSelection:
                            onPlanSelectionReceived(state);
                            break;
                        case STATE.planTrace:
                            onPlanTraceReceived(state);
                            break;
                        case STATE.sense:
                            onSenseReceived(state);
                            break;
                        default:
                            return;
                    }
                    updateGraph(states[vm.agents.current][0]);
                }

                function swapBranchNodes (branch, indexA, indexB) {
                    var temp = branch[indexA];
                    branch[indexA] = branch[indexB];
                    branch[indexB] = temp;
                    vm.nodes.lase["children"] = branch;
                    vm.nodes.current = branch[indexA];
                    vm.nodes.branch = branch;
                }

                function resetDebugger () {
                    sessionTag = prompt("Enter your session ID", DEFAULTS.session);
                    switch (sessionTag) {
                        case undefined:
                        case null:
                        case "":
                            sessionTag = DEFAULTS.session;
                        case DEFAULTS.session:
                            alert("No Session ID provided.\nLoading Default session.");
                            break;
                        default:
                            sessionTag = sessionTag.trim();
                    }

                    currentSequence = 0;
                    states[vm.agents.current] = [DEFAULTS.rootNode];
                    tries = 0;
                    vm.nodes.branch =  null;
                    vm.nodes.current = states[vm.agents.current][0];
                    vm.nodes.last = null;
                    vm.nodes.selected = null;
                    vm.isDebugging = true;
                    updateGraph(states[vm.agents.current][0]);
                }

                vm.selectAgent = function (agentName) {
                    vm.agents.current = agentName;
                    vm.stopDebugging();
                    states[vm.agents.current] = [DEFAULTS.rootNode];
                    states[vm.agents.current].forEach(function (state) {
                        onStateReceived(state, true);
                    });
                    vm.startDebugging(true);
                }


                vm.startDebugging = function (resume) {
                    resetDebugger(resume);
                    poll = $interval(function() {
                        API.get(["index.php", "Log", sessionTag, currentSequence])
                            .then(function (resp) {
                                if (resp && resp.length > 0) {
                                    vm.currentSequence += resp.length;
                                    resp.forEach(function(raw_state) {
                                        onStateReceived(JSON.parse(raw_state.log_dump));
                                    });
                                    currentSequence ++;
                                } else {
                                    tries ++;
                                    if (tries === DEFAULTS.maxTries) {
                                        tries = 0;
                                        currentSequence ++;
                                    }
                                }
                            })
                            .catch(function (e){
                                console.log("Got an error: ", e);
                            });
                    }, 500);
                }


                vm.stopDebugging = function () {
                    $interval.cancel(poll);
                    poll = undefined;
                    vm.isDebugging = false;
                }

                vm.init = function () {
                    tree = d3.layout.tree()
                        .size([height, width]);
                    diagonal = d3.svg.diagonal()
                        .projection(function(d) { return [d.y, d.x]; });
                    svg = d3.select("#visualisation_board").append("svg")
                        .attr("width", width + margin.right + margin.left)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    states[vm.agents.current] = [DEFAULTS.rootNode];
                    root = states[vm.agents.current][0];
                    root.x0 = height / 2;
                    root.y0 = 0;
                    updateGraph(root);
                    d3.select(self.frameElement).style("height", "500px");
                }

                function mouseover() {
                    div.transition()
                        .duration(300)
                        .style("opacity", 1);
                }

                function mousemove(d) {
                    div.text("")
                        .style("left", (d3.event.pageX ) + "px")
                        .style("top", (d3.event.pageY) + "px");
                    div.append("b").text(d.IDENTIFIER);
                    if (d.CONTEXT_META !== undefined) {
                        div.append("br")
                        div.append("br")
                        div.append("b").text("context:");
                        d.CONTEXT_META.forEach(function (metaEntry) {
                            div.append("br")
                            div.append("span")
                                .text(metaEntry[0])
                                .style("color",
                                    metaEntry[1] ? COLOURS.traversableNode
                                        : COLOURS.unTraversableNode
                                );
                        });
                    }
                }

                function mouseout() {
                    div.transition()
                        .duration(300)
                        .style("opacity", 1e-6);
                }


                function updateGraph(source) {

                    // Compute the new tree layout.

                    if (div === undefined) {
                        div = d3.select("body").append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 1e-6);
                    }

                    var nodes = tree.nodes(root).reverse();
                    var links = tree.links(nodes);

                    links = _.remove(links, function (link) {
                        return (link.target.IS_PADDING_NODE === undefined);
                    });



                    // Normalize for fixed-depth.
                    nodes.forEach(function(d) { d.y = d.depth * 180; });

                    // Update the nodes…
                    var node = svg.selectAll("g.node").data(
                        nodes, function(d) {
                            return d.id || (d.id = ++i);
                        });

                    // Enter any new nodes at the parent's previous position.
                    var nodeEnter = node.enter()
                        .append("g")
                        .attr("class", "node")
                        .attr(
                            "transform",
                            function(d) {
                                return "translate(" + source.y0 + "," + source.x0 + ")";
                            })
                        .on("click", onNodeClicked);

                    nodeEnter.append("svg:circle")
                        .on("mouseover", mouseover)
                        .on("mousemove", function(d){mousemove(d);})
                        .on("mouseout", mouseout)
                        .attr("r", 1e-6)
                        .style(
                            "fill",
                            function(d) {
                                return (d.IS_PADDING_NODE !== undefined) ? "white" :
                                    (d.CONTEXT_PASSED === undefined) || d.CONTEXT_PASSED ?
                                        COLOURS.traversableNode : COLOURS.unTraversableNode;
                            });

                    nodeEnter.append("svg:text")
                        .attr(
                            "x",
                            function(d) {
                                return d.children || d._children ? -13 : 13;
                            })
                        .attr("dy", ".35em")
                        .attr(
                            "text-anchor",
                            function(d) {
                                return d.children || d._children ? "end" : "start";
                            })
                        .text(function(d) { return "\n" + d.IDENTIFIER; })
                        .style("fill-opacity", 1e-6);

                    // Transition nodes to their new position.
                    var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

                    nodeUpdate.select("circle")
                        .attr("r", 10)
                        .style("fill", function(d) {
                            return (d.IS_PADDING_NODE !== undefined) ? "white" :

                                (d.CONTEXT_PASSED === undefined) || d.CONTEXT_PASSED ?
                                    COLOURS.traversableNode : UN_COLOURS.traversableNode;
                        });

                    nodeUpdate.select("text")
                        .style("fill-opacity", 1);

                    // Transition exiting nodes to the parent's new position.
                    var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                        .remove();

                    nodeExit.select("circle")
                        .attr("r", 1e-6);

                    nodeExit.select("text")
                        .style("fill-opacity", 1e-6);


                    // Update the links…
                    var link = svg.selectAll("path.link")
                        .data(links, function(d) {
                            if (d.IS_PADDING_NODE !== undefined) {
                                return null;
                            } else {
                                return d.target.id;
                            }
                        });



                    // Enter any new links at the parent's previous position.
                    link.enter().insert("path", "g")
                        .attr("class", "link")
                        .attr("d", function(d) {
                            var o = {x: source.x0, y: source.y0};
                            return diagonal({source: o, target: o});
                        });

                    // Transition links to their new position.
                    link.transition()
                        .duration(duration)
                        .attr("d", diagonal);

                    // Transition exiting nodes to the parent's new position.
                    link.exit().transition()
                        .duration(duration)
                        .attr("d", function(d) {
                            var o = {x: source.x, y: source.y};
                            return diagonal({source: o, target: o});
                        })
                        .remove();

                    // Stash the old positions for transition.
                    nodes.forEach(function(d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });


                }


                function onNodeClicked(d) {
                    selectNode(d);

                }


                vm.mimicAction =  function () {

                    onStateReceived({
                        "TYPE": "ACTION",
                        "TYPE_INFO": {
                            "IDENTIFIER": "move(1,0)"
                        }

                    });
                }
                vm.mimicPlanTrace =  function () {
                    onStateReceived({
                        "TYPE": "PLAN_TRACE",
                        "TYPE_INFO": [
                            {
                                "IDENTIFIER": "opt_a",
                                "CONTEXT": "has_cat & has_bicycle",
                                "CONTEXT_PASSED": false,
                                "CONTEXT_META": [
                                    ["has_cattle", false],
                                    ["has_beans", true]
                                ]
                            },
                            {
                                "IDENTIFIER": "opt_c",
                                "CONTEXT": "has_cat & not has_bicycle",
                                "CONTEXT_PASSED": true,
                                "CONTEXT_META": [
                                    ["is_plant_farm", true],
                                    ["has_beans", true]
                                ]
                            }
                        ]
                    });
                }
                vm.mimicPlanSelection =  function () {
                    onStateReceived({
                        "TYPE": "PLAN_SELECTION",
                        "TYPE_INFO": {
                            "IDENTIFIER": "opt_c",
                            "CONTEXT": "has_cat & not has_bicycle"
                        }
                    });
                }

            }
        ]
    )