"use strict";
(function(){
    var nodes = [{I:0}, {I:0}, {I:0}];
    var branches = [
        {i:null, j:0, y:10},
        {i:0, j:2, y:10},
        {i:0, j:2, C:1},
        {i:0, j:1, C:1},
        {i:1, j:2, E:5},
        {i:null, j:2, y:10}
    ];
    //for(var x in branches) show(branches[x]);
    //show(branches);
    var test = new Test("Тест подготовки сети 1");
    test.showTableArray({nodes:{array:nodes, tree:"L"}, branches:{array:branches}}, "Исходные данные");
    var net = new Net(nodes, branches);
    net.prepare();
    test.showTableArray({nodes:{array:nodes, tree:"L"}, branches:{array:branches}}, "После prepareNet()");
    
    
    
    
    
    var test1 = new Test("Тест подготовки сети GND-R-E-C");
    branches = [
        {i:null, j:0, y:1},
        {i:0, j:1, E:5},
        {i:1, j:2, C:2}
    ];
    nodes = [{I:0}, {I:0}, {I:0}];
    test1.showTableArray({nodes:{array:nodes, tree:"L"}, branches:{array:branches}}, "Исходные данные");
    net = new Net(nodes, branches);
    net.prepare();
    test1.showTableArray({nodes:{array:nodes, tree:"L"}, branches:{array:branches}}, "После prepareNet()");
    
    var test3 = new Test("Тест подготовки сети GND-E + Vc-E");
    nodes = [{}, {T:true, V:5}, {}];
    branches = [
        {i:null, j:0, E:5},
        {i:2, j:1, E:5}
    ];
    test3.showTableArray({nodes:{array:nodes, tree:"L"}, branches:{array:branches}}, "Исходные данные");
    net = new Net(nodes, branches);
    net.prepare();
    test3.showTableArray({nodes:{array:nodes, tree:"L"}, branches:{array:branches}}, "После prepareNet()");
    net.solve();
    test3.showTableArray({nodes:{array:nodes, tree:"L"}, branches:{array:branches}}, "После solveNet()");

    var test4 = new Test("Тест метода Холецкого");
    var sorted = 
    [
        {D:  9,       V: 21}, //  9    6
        {A:[6], D:20, V: 46}  //  6   20
    ];
    test4.showTableArray({sorted:{array:sorted}}, "Исходные данные");
    net.choleskyDecomp(sorted);
    test4.showTableArray({sorted:{array:sorted}}, "После net.choleskyDecomp()");
    net.choleskySolve(sorted);
    test4.showTableArray({sorted:{array:sorted}}, "После net.choleskySolve()");
})();