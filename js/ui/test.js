describe('User Interface', function()
{
    describe('index.js', function()
    {
        it('creating ui', function() {
            var a = ui.add('file/edit/test');
            chai.expect(a).to.equal(ui.file.edit.test);
            var b = a.add('testB/testC');
            chai.expect(b).to.equal(a.testB.testC);
            chai.expect('a/b/c').to.equal('a/b/c');
            chai.expect('c/b/a').not.to.equal('a/b/c');
        });
    });

});