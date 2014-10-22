function Element(tag)
{
    this.tag = tag;
    this.children = [];
}

Element.prototype =
{
    appendChild: function(c) 
	{
		var tag = c.tag;
		if(tag)
		{
			if(this[tag])
			{
				if(this[tag] instanceof Array) this[tag].push(c);
				else this[tag] = [this[tag], c];
			}
			else this[tag] = c;
		}
		this.children.push(c);
	},
    find: function(tag) 
    {
        for(var x in this.children) if(this.children[x].tag === tag) return this.children[x];
    }
};

function Document()
{
    this.body = new Element('body');
}

Document.prototype =
{
    createElement: function(tag) {return new Element(tag);}
};

describe('User Interface', function()
{
    describe('index', function()
    {
        it('creating ui', function() {
            var ui = new UI();
            var abc = ui('a/b/c');
            chai.expect(abc).to.equal(ui.a.b.c);
            chai.expect(ui('c/b/a')).to.equal(ui('c/b/a'));
            chai.expect(ui('c/b/a')).not.to.equal(ui('a/b/c'));
        });
        it('loading tree', function(){
            var ui = new UI();
            var tree = {
                view:{_: 'View',
                    grid:{_: 'Grid',
                        lines:  'Lines',
                        dots:   'Dots',
                        none:   'None',
                        props:  'Settings ...'
                    }
                }
            }
            ui.load(tree);
            chai.expect(ui.view._name).to.equal('View');
            chai.expect(ui('view/grid/lines')._name).to.equal('Lines');
        });
    });
    describe('menu', function()
    {
        it('creating menu', function() {
            var ui = new UI(), doc = new Document();
            Menu(ui, doc);
            ui.makeMenu('project', 'view');
            var menu = doc.body.menu;
            chai.expect(menu.tag).to.equal('menu');
            chai.expect(menu.className).to.be.a('string');
            chai.expect(menu.innerText).to.be.an('undefined');
            var view = menu.li[1];
            chai.expect(view.tag).to.equal('li');
            chai.expect(view.innerText).to.be.an('undefined');
		});
        it('make menu and then load tree', function() {
            var ui = new UI(), doc = new Document();
            Menu(ui, doc);
            ui.makeMenu('project', 'view');
            var tree = {
                view:{_: 'View',
                    grid:{_: 'Grid',
                        lines:  'Lines',
                        dots:   'Dots'
                    }
                }
            }
            ui.load(tree);
            chai.expect(doc.body.menu.li[0]).to.equal(ui.project._li);
            chai.expect(doc.body.menu.li[1]).to.equal(ui.view._li);
            chai.expect(doc.body.menu.li[1].innerText).to.equal('View');
            chai.expect(doc.body.menu.li[1].ul.li.innerText).to.equal('Grid');
		});
        it('load tree and then make menu', function() {
            var ui = new UI(), doc = new Document();
            Menu(ui, doc);
            var tree = {
                view:{_: 'View',
                    grid:{_: 'Grid',
                        lines:  'Lines',
                        dots:   'Dots'
                    }
                }
            }
            ui.load(tree);
            ui.makeMenu('project', 'view');
            var view = doc.body.children[0].children[1];
            chai.expect(ui.view._li).to.equal(view);
            chai.expect(view.innerText).to.equal('View');
            var ul = view.children[0];
            chai.expect(ul.tag).to.equal('ul');
            var grid_li = ul.children[0];
            chai.expect(grid_li.tag).to.equal('li');
		});
        it('assign handler and then create menu', function() {
            var ui = new UI(), doc = new Document();
            Menu(ui, doc);
            ui('view/theme/lite', 'handler');
            chai.expect(ui.view.theme.lite._ex).to.equal('handler');
            ui.makeMenu('project', 'view');
            var view = doc.body.menu.li[1];
            chai.expect(ui.view._li).to.equal(view);
            var theme = view.ul.li;
            chai.expect(ui.view.theme._li).to.equal(theme);
		});
        it('assign handler, create menu, load tree', function() {
            var ui = new UI(), doc = new Document();
            Menu(ui, doc);
            ui('view/theme/lite', 'handler');
            ui.makeMenu('project', 'view');
			ui.load({
                project: {_:'Project'},
                edit: {_: 'Edit',
                    undo: 'Undo',
                    redo: 'Redo',
                    _1: '-'
                },
                view: {_: 'View',
                    theme: {_: 'Theme',
                        lite:  'Lite',
                        matrix: 'Matrix'
                    },
                    grid:{_: 'Grid',
                        lines:  'Lines',
                        dots:   'Dots',
                        none:   'None',
                        props:  'Settings ...'
                    }
                }
            });
            chai.expect(doc.body.menu.li[1].innerText).to.equal('View');
            chai.expect(doc.body.menu.li[1].ul.li[0].innerText).to.equal('Theme');
        });
    });
});