function Element(tag)
{
    this.tag = tag;
    this.children = [];
}

Element.prototype =
{
    appendChild: function(c) {this.children.push(c);}
};

var doc =
{
    body:new Element('body'),
    createElement: function(tag) {return new Element(tag);}
}

describe('User Interface', function()
{
    describe('index.js', function()
    {
        it('creating ui', function() {
            var ui = new UI(document);
            var a = ui.add('file/edit/test');
            chai.expect(a).to.equal(ui.file.edit.test);
            var b = a.add('testB/testC');
            chai.expect(b).to.equal(a.testB.testC);
            chai.expect('a/b/c').to.equal('a/b/c');
            chai.expect('c/b/a').not.to.equal('a/b/c');
        });
        it('loading tree', function(){
            var ui = new UI(doc);
            var tree = {
                view:{_: Menu('View'),
                    grid:{_: 'Grid',
                        lines:  'Lines',
                        dots:   'Dots',
                        none:   'None',
                        props:  'Settings ...'
                    }
                }
            }
            ui.setTree(tree);
            console.log(ui);
        });
    });
});