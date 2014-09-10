"use strict";
function Net(nodes, branches)  // узлы {T, V}, ветви {i, j, y, C, E}
{
    this.prepare = function() // prepare готовит списки, устанавливает связи
    {
        function prepareE(br)
        {
        // Нужно сформировать массивы Ep и Em в ветви, которые указывают, на Vo каких узлов будет влиять E этой ветви
            var i = (br.i !== null) ? nodes[br.i] : null, j = (br.j !== null) ? nodes[br.j] : null;
            var p = null, m = null; // узлы, которые влияют положительно и отрицательно
            if(i && i.p !== undefined) {p = i; i = i.p;}
            if(j && j.p !== undefined) {m = j; j = j.p;}
            if(i === j) throw "EMF inside same EMF isle.";
            var f = "Ep";
            if(!j || j.T)
            {
                if(!i || i.T) throw "EMF between const nodes.";
                var t = i; i = j; j = t;
                t = p; p = m; m = t;
                f = "Em";
            }
            j[f] = [br];
            j.p = i;
            if(j.E) for(var t in j.E) 
            {
                var et = j.E[t];
                if(et[f]) et[f].push(br);
                else et[f] = [br];
                et.p = i;
            }
            if(i)
            {
                if(i.E) i.E.push(j);
                else i.E = [j];
                if(j.E) i.E = i.E.concat(j.E);
            }
            if(j.E) delete j.E;
        }
        function prepareC(br)
        {
            var i = (br.i !== null) ? nodes[br.i] : null, j = (br.j !== null) ? nodes[br.j] : null;
            if(i && i.p !== undefined) { /*E += i.Vo;*/ i = i.p;}
            if(j && j.p !== undefined) { /*E -= j.Vo;*/ j = j.p;}
            if(i === j) return;
            if(!j || j.T)
            {
                if(!i || i.T) return;
                var t = i; i = j; j = t;
            }
            j.Vo = 0;
            j.p = i;
            if(j.C) for(var t in j.C) 
            {
                //j.C[t].Vo += E; 
                j.C[t].p = i;
            }
            if(i)
            {
                if(i.C) i.C.push(j);
                else i.C = [j];
                if(j.C) i.C = i.C.concat(j.C);
            }
            if(j.C) delete j.C;   
        }
        function prepareY(br)
        {
            var i = (br.i !== null) ? nodes[br.i] : null, j = (br.j !== null) ? nodes[br.j] : null;
            if(i && i.p !== undefined) {i = i.p; if(i && i.p !== undefined) i = i.p;}
            if(j && j.p !== undefined) {j = j.p; if(j && j.p !== undefined) j = j.p;}
            if(i === j) return;
            //i.y += br.y;
            if(i){if(i.b) i.b.push(j); else i.b = [j];}
            if(j){if(j.b) j.b.push(i); else j.b = [i];}
        
        }
       
        for(var b in branches) if(typeof branches[b].E === "number") prepareE(branches[b]);
        for(var b in branches) if(typeof branches[b].C === "number") prepareC(branches[b]);
        for(var b in branches) if(typeof branches[b].y === "number") prepareY(branches[b]);
    }
    this.makeY = function()
    {
    
    
    };
    this.choleskyPrepare = function(nodes)
    {
    
    
    };
    this.choleskyDecomp = function(nodes) // сортированные узлы nodes: [{A:[исходная матрица], L:[триангулированная матрица]}]
    {
        for(var s in nodes) 
        {
            var i = nodes[s];
            i.L = [];
            var Aii = i.D;
            for(var J in i.A) // считаем Lij = (Aij - sum(Lik * Ljk) / Ljj, где k < j < i
            {
                var Lij = i.A[J];
                var j = nodes[J];
                for(var k in i.L) if(j.L[k]) Lij -= i.L[k] * j.L[k];
                Lij /= j.D;
                i.L[J] = Lij;
                Aii -= Lij * Lij;
            }
            i.D = Math.sqrt(Aii);  // считаем Lii = sqrt(Aii - sum(Lij * Lij))
        }
    };
    this.choleskySolve = function(nodes)
    {
        for(var i in nodes)
        {
            var I = nodes[i];
            for(var j in I.L) I.V -= I.L[j] * nodes[j].V;
            I.V /= I.D;     
        }
        for(var i = nodes.length; i--;)
        {
            var I = nodes[i];
            I.V /= I.D;
            for(var j in I.L) nodes[j].V -= I.L[j] * I.V;
        }
    };
    this.solve = function()
    {
        function calcVo()
        {
            for(var x in nodes)
            {
                var n = nodes[x];
                if(!(n.Ep || n.Em)) continue;
                var Vo = 0;
                if(n.Ep) for(var y in n.Ep) Vo += n.Ep[y].E;
                if(n.Em) for(var y in n.Em) Vo -= n.Em[y].E;
                n.Vo = Vo;
           }
        }
        function sumI()
        {
        
    
        }
        function solveY()
        {
    
        }
        function calcV()
        {
        }
        function calcIc(){}
        function calcVo1(){}
        calcVo();
    }
}









